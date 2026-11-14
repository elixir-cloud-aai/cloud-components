import type { Task } from "../providers/tes-provider.js";

export type EccRunLogChangedEvent = CustomEvent<{ task: Task }>;
declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-log-changed": CustomEvent<{ task: object } | { runLog: object }>;
  }
}
