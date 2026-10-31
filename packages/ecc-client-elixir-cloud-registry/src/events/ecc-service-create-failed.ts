export type EccServiceCreateFailedEvent = CustomEvent<{
  /** What went wrong, e.g. the registry's explanation (problem `detail`). */
  error: string;
  /** HTTP status of the failed request, e.g. `401` or `403`, if any. */
  status?: number;
  /** Problem `title` of the failed request, if any. */
  title?: string;
  /** Problem `detail` of the failed request, if any. */
  detail?: string;
  /** ID of the existing service, for duplicate registrations (`409`). */
  serviceId?: string;
  /** The error that the provider threw, if any. */
  cause?: unknown;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-failed": EccServiceCreateFailedEvent;
  }
}
