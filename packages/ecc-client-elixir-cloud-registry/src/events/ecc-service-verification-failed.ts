export type EccServiceVerificationFailedEvent = CustomEvent<{
  /** ID of the service. */
  serviceId: string;
  /** What failed: loading, verifying or removing the verification. */
  action: "load" | "verify" | "remove";
  /** What went wrong, e.g. the registry's explanation (problem `detail`). */
  error: string;
  /** HTTP status of the failed request, e.g. `403` or `409`, if any. */
  status?: number;
  /** Problem `title` of the failed request, if any. */
  title?: string;
  /** Problem `detail` of the failed request, if any. */
  detail?: string;
  /**
   * Problem `code` of a conflict (`409`), if any, e.g.
   * `verification-mismatch` or `pending-service`.
   */
  code?: string;
  /** The error that the provider threw, if any. */
  cause?: unknown;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-verification-failed": EccServiceVerificationFailedEvent;
  }
}
