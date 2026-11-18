import type { AddressInfo } from "node:net";
import { fileURLToPath } from "node:url";

import { createServer, type ServerOptions } from "../src/server.ts";
import { Store } from "../src/store.ts";

// Fixtures of the tests, not those of the deployed server
export const fixturesDir = fileURLToPath(new URL("fixtures", import.meta.url));

export interface RunningServer {
  url: string;
  store: Store;
  logs: string[];
  close: () => Promise<void>;
}

// Starts a server on a free port of the loopback interface, with the test
// fixtures (unless `store` is given; `maxCreated` caps its created items)
// and the log lines collected
export const startServer = async ({
  maxCreated,
  ...options
}: Partial<ServerOptions> & {
  maxCreated?: number;
} = {}): Promise<RunningServer> => {
  const logs: string[] = [];
  const store = options.store ?? Store.load(fixturesDir, { maxCreated });
  const server = createServer({
    log: (line) => logs.push(line),
    ...options,
    store,
  });
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    store,
    logs,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};
