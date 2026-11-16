import type { RunLog } from "../providers/wes-provider.js";

export type EccRunLogChangedEvent = CustomEvent<{ runLog: RunLog }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-log-changed": CustomEvent<{ task: object } | { runLog: object }>;
  }
}
