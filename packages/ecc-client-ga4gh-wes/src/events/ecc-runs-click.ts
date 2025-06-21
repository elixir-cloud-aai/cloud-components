export class EccRunsClickEvent extends CustomEvent<{ runId: string }> {
  constructor(runId: string) {
    super("ecc-runs-click", {
      bubbles: true,
      composed: true,
      detail: { runId },
    });
  }
}
