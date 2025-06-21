import { RunStatus } from "../providers/wes-provider.js";

export class EccRunsChangeEvent extends CustomEvent<{ runs: RunStatus[] }> {
  constructor(runs: RunStatus[]) {
    super("ecc-runs-change", {
      bubbles: true,
      composed: true,
      detail: { runs },
    });
  }
}
