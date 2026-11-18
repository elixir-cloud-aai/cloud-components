// Starts the mock server on `PORT` (default 8080) with the fixtures of
// `fixtures/`

import { fileURLToPath } from "node:url";

import { parsePort } from "./config.ts";
import { createServer } from "./server.ts";
import { Store } from "./store.ts";

const port = parsePort(process.env.PORT);
const fixturesDir = fileURLToPath(new URL("../fixtures", import.meta.url));
const server = createServer({ store: Store.load(fixturesDir) });

server.listen(port, () => {
  console.log(`Mock server listening on port ${port}`);
});

// Stop accepting connections, let requests in flight finish (at most 10 s),
// then exit
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    setTimeout(() => server.closeAllConnections(), 10_000).unref();
  });
}
