// In-memory store: collections of items, loaded from fixture files on start
// and never written back. Each `<name>.json` file in the fixtures directory
// holds a JSON array of objects: the fixtures of the collection `<name>`.
// Items created through the API are kept apart from the fixtures and capped
// per collection, by number and by size, so that a public instance can't be
// filled up; a restart (or `reset`) drops them. `list`, `find` and `create`
// hand out copies, so that changes by handlers never reach the store (nor
// bypass its caps); a stub that needs to change stored items adds a method
// here that measures them again

import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import { HttpError } from "./http.ts";

export type Item = Record<string, unknown>;

export interface StoreOptions {
  // Created items kept per collection (default 100); above it, the oldest
  // created item is dropped. Fixtures don't count and are never dropped
  maxCreated?: number;
  // Total size of the created items per collection, as JSON (default
  // 4 MiB); above it, the oldest created items are dropped. A larger item
  // is rejected (413). Parsed items take many times their JSON size in
  // memory
  maxCreatedBytes?: number;
}

interface Created {
  item: Item;
  // Size as JSON
  size: number;
}

interface Collection {
  fixtures: Item[];
  created: Created[];
  // Sum of the sizes of the created items
  bytes: number;
}

const emptyCollection = (fixtures: Item[] = []): Collection => ({
  fixtures,
  created: [],
  bytes: 0,
});

const checkCap = (name: string, value: number): number => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`The cap of ${name} must be >= 1: ${value}`);
  }
  return value;
};

const isItem = (value: unknown): value is Item =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readFixtures = (file: string): Item[] => {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Fixture file ${file} is not valid JSON: ${error}`);
  }
  if (!Array.isArray(data) || !data.every(isItem)) {
    throw new Error(`Fixture file ${file} must hold an array of objects`);
  }
  return data;
};

export class Store {
  readonly maxCreated: number;

  readonly maxCreatedBytes: number;

  // As loaded, never handed out
  readonly #fixtures: ReadonlyMap<string, readonly Item[]>;

  #collections = new Map<string, Collection>();

  constructor(fixtures: Map<string, Item[]>, options: StoreOptions = {}) {
    this.maxCreated = checkCap("created items", options.maxCreated ?? 100);
    this.maxCreatedBytes = checkCap(
      "created bytes",
      options.maxCreatedBytes ?? 4 * 1024 * 1024
    );
    this.#fixtures = fixtures;
    this.reset();
  }

  // Loads the `*.json` files of `dir`, in the order of their names
  static load(dir: string, options: StoreOptions = {}): Store {
    const fixtures = new Map<string, Item[]>();
    const files = readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .sort();
    for (const file of files) {
      fixtures.set(basename(file, ".json"), readFixtures(join(dir, file)));
    }
    return new Store(fixtures, options);
  }

  // Back to the fixtures as loaded, without created items
  reset(): void {
    this.#collections = new Map(
      [...this.#fixtures].map(([name, items]) => [
        name,
        emptyCollection(structuredClone([...items])),
      ])
    );
  }

  // Names of the collections, sorted
  collections(): string[] {
    return [...this.#collections.keys()].sort();
  }

  // Copies of the fixtures, then of the created items, oldest first; empty
  // for unknown collections
  list(name: string): Item[] {
    const collection = this.#collections.get(name);
    if (!collection) {
      return [];
    }
    return structuredClone([
      ...collection.fixtures,
      ...collection.created.map(({ item }) => item),
    ]);
  }

  // A copy of the first item that matches
  find(name: string, predicate: (item: Item) => boolean): Item | undefined {
    return this.list(name).find(predicate);
  }

  // Adds a copy of `item` to the collection (created if needed) and returns
  // another copy; 413 if the item alone exceeds `maxCreatedBytes`
  create(name: string, item: Item): Item {
    const size = Buffer.byteLength(JSON.stringify(item));
    if (size > this.maxCreatedBytes) {
      throw new HttpError(
        413,
        `The item exceeds the ${this.maxCreatedBytes} bytes of its collection`
      );
    }
    let collection = this.#collections.get(name);
    if (!collection) {
      collection = emptyCollection();
      this.#collections.set(name, collection);
    }
    collection.created.push({ item: structuredClone(item), size });
    collection.bytes += size;
    while (
      collection.created.length > this.maxCreated ||
      collection.bytes > this.maxCreatedBytes
    ) {
      const [oldest] = collection.created.splice(0, 1);
      collection.bytes -= oldest.size;
    }
    return structuredClone(item);
  }
}
