import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parsePort } from "../src/config.ts";

describe("parsePort", () => {
  it("defaults to 8080", () => {
    assert.equal(parsePort(undefined), 8080);
    assert.equal(parsePort(""), 8080);
  });

  it("accepts ports from 1 to 65535", () => {
    assert.equal(parsePort("1"), 1);
    assert.equal(parsePort("3000"), 3000);
    assert.equal(parsePort("65535"), 65535);
  });

  it("rejects other values", () => {
    for (const value of ["0", "65536", "-1", "80.5", "abc", "8080x", " 80"]) {
      assert.throws(() => parsePort(value), /PORT/, value);
    }
  });
});
