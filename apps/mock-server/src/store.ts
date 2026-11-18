// In-memory store: collections of items, loaded from fixture files on start
// and never written back. Each `<name>.json` file in the fixtures directory
// holds a JSON array of objects: the fixtures of the collection `<name>`.
// Items created through the API are kept apart from the fixtures and capped
// per collection, by number and by size, so that a public instance can't be
// filled up; a restart
// (or `reset`) drops them. `list`, `find` and `create` hand out the stored
// items themselves, not copies: a handler that changes an item changes it
// in the store (until the next reset)

import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

export type Item = Record<string, unknown>;

export interface StoreOptions {
  // Created items kept per collection (default 100); above it, the oldest
  // created item is dropped. Fixtures don't count and are never dropped
  maxCreated?: number;
  // Total size of the created items per collection, as JSON (default
  // 4 MiB); above it, the oldest created items are dropped, but never the
  // newest. Parsed items take many times their JSON size in memory
  maxCreatedBytes?: number;
}

interface Collection {
  fixtures: Item[];
  created: Item[];
  // Sizes of the created items, as JSON, and their sum
  sizes: number[];
  bytes: number;
}

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

  // As loaded, never handed out, so that changes to items don't survive a
  // reset
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
        {
          fixtures: structuredClone([...items]),
          created: [],
          sizes: [],
          bytes: 0,
        },
      ])
    );
  }

  // Names of the collections, sorted
  collections(): string[] {
    return [...this.#collections.keys()].sort();
  }

  // Fixtures first, then created items, oldest first; empty for unknown
  // collections
  list(name: string): Item[] {
    const collection = this.#collections.get(name);
    return collection ? [...collection.fixtures, ...collection.created] : [];
  }

  find(name: string, predicate: (item: Item) => boolean): Item | undefined {
    return this.list(name).find(predicate);
  }

  // Adds `item` to the collection (created if needed) and returns it
  create(name: string, item: Item): Item {
    let collection = this.#collections.get(name);
    if (!collection) {
      collection = { fixtures: [], created: [], sizes: [], bytes: 0 };
      this.#collections.set(name, collection);
    }
    const size = Buffer.byteLength(JSON.stringify(item));
    collection.created.push(item);
    collection.sizes.push(size);
    collection.bytes += size;
    while (
      collection.created.length > 1 &&
      (collection.created.length > this.maxCreated ||
        collection.bytes > this.maxCreatedBytes)
    ) {
      collection.created.shift();
      collection.bytes -= collection.sizes.shift() ?? 0;
    }
    return item;
  }
}
