import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";

import { Store } from "../src/store.ts";
import { fixturesDir } from "./helpers.ts";

describe("Store", () => {
  it("loads each fixture file as a collection named after it", () => {
    const store = Store.load(fixturesDir);
    assert.deepEqual(store.collections(), ["things"]);
    assert.deepEqual(
      store.list("things").map((item) => item.id),
      ["fixture-1", "fixture-2"]
    );
  });

  it("lists unknown collections as empty", () => {
    assert.deepEqual(Store.load(fixturesDir).list("nothing"), []);
  });

  it("finds items", () => {
    const store = Store.load(fixturesDir);
    assert.equal(
      store.find("things", (item) => item.id === "fixture-2")?.name,
      "Second fixture"
    );
    assert.equal(
      store.find("things", (item) => item.id === "none"),
      undefined
    );
    assert.equal(
      store.find("nothing", () => true),
      undefined
    );
  });

  it("creates items, also in collections without fixtures", () => {
    const store = Store.load(fixturesDir);
    store.create("runs", { id: "run-1" });
    assert.deepEqual(store.list("runs"), [{ id: "run-1" }]);
    assert.deepEqual(store.collections(), ["runs", "things"]);
  });

  it("caps created items per collection, dropping the oldest", () => {
    const store = Store.load(fixturesDir, { maxCreated: 2 });
    for (const id of ["a", "b", "c"]) {
      store.create("things", { id });
      store.create("runs", { id });
    }
    assert.deepEqual(
      store.list("things").map((item) => item.id),
      ["fixture-1", "fixture-2", "b", "c"]
    );
    assert.deepEqual(
      store.list("runs").map((item) => item.id),
      ["b", "c"]
    );
  });

  it("caps the size of created items per collection, dropping the oldest", () => {
    const store = Store.load(fixturesDir, { maxCreatedBytes: 100 });
    const big = (id: string) => ({ id, data: "x".repeat(30) });
    for (const id of ["a", "b", "c", "d"]) {
      store.create("runs", big(id));
    }
    // Each item serializes to 50 bytes: two fit
    assert.deepEqual(
      store.list("runs").map((item) => item.id),
      ["c", "d"]
    );
  });

  it("keeps the newest created item even if it alone exceeds the size cap", () => {
    const store = Store.load(fixturesDir, { maxCreatedBytes: 10 });
    store.create("runs", { id: "a" });
    store.create("runs", { id: "b", data: "x".repeat(100) });
    assert.deepEqual(
      store.list("runs").map((item) => item.id),
      ["b"]
    );
  });

  it("defaults to a size cap of 4 MiB", () => {
    assert.equal(Store.load(fixturesDir).maxCreatedBytes, 4 * 1024 * 1024);
  });

  it("rejects a size cap below 1", () => {
    assert.throws(() => Store.load(fixturesDir, { maxCreatedBytes: 0 }), /cap/);
  });

  it("defaults to a cap of 100", () => {
    const store = Store.load(fixturesDir);
    assert.equal(store.maxCreated, 100);
  });

  it("rejects a cap below 1", () => {
    assert.throws(() => Store.load(fixturesDir, { maxCreated: 0 }), /cap/);
  });

  it("resets to the fixtures, undoing changes to fixture items", () => {
    const store = Store.load(fixturesDir);
    store.create("things", { id: "created" });
    const fixture = store.find("things", (item) => item.id === "fixture-1");
    assert.ok(fixture);
    fixture.name = "changed";
    store.reset();
    assert.deepEqual(store.list("things"), [
      { id: "fixture-1", name: "First fixture" },
      { id: "fixture-2", name: "Second fixture" },
    ]);
  });

  it("never writes the fixture files", () => {
    const file = join(fixturesDir, "things.json");
    const before = readFileSync(file, "utf8");
    const store = Store.load(fixturesDir);
    store.create("things", { id: "created" });
    store.reset();
    assert.equal(readFileSync(file, "utf8"), before);
  });

  describe("with invalid fixtures", () => {
    let dir: string;

    before(() => {
      dir = mkdtempSync(join(import.meta.dirname, "invalid-"));
    });

    after(() => {
      rmSync(dir, { recursive: true, force: true });
    });

    it("loads an empty directory as no collections", () => {
      assert.deepEqual(Store.load(dir).collections(), []);
    });

    it("rejects a file that is not an array of objects", () => {
      const file = join(dir, "bad.json");
      writeFileSync(file, JSON.stringify({ id: "x" }));
      try {
        assert.throws(() => Store.load(dir), /bad\.json/);
        writeFileSync(file, JSON.stringify([1]));
        assert.throws(() => Store.load(dir), /bad\.json/);
        writeFileSync(file, "[");
        assert.throws(() => Store.load(dir), /bad\.json/);
      } finally {
        rmSync(file);
      }
    });
  });
});
