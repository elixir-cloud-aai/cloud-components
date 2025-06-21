import { RunLog } from "../providers/wes-provider.js";

export class EccRunLogChangeEvent extends CustomEvent<{ runLog: RunLog }> {
  constructor(runLog: RunLog) {
    super("ecc-run-log-change", {
      bubbles: true,
      composed: true,
      detail: { runLog },
    });
  }
}
