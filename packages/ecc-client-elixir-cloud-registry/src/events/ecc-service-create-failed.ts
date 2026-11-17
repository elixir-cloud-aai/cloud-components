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
  /**
   * The registry's field errors that the form shows at its fields, as a
   * message per field, e.g. `{ "organization.url": "Must be a valid URI." }`;
   * empty if there are none. Keys are the fields' paths in the request body
   * (`name`, `url`, `organization.name`, `organization.url`, `type`,
   * `type.group`, `type.artifact`, `type.version`, `version`, `description`,
   * `contactUrl`, `documentationUrl`, `environment`, `createdAt`,
   * `updatedAt`), and `serviceId` for the custom service ID.
   */
  fieldErrors: Record<string, string>;
  /**
   * Message to show as a general error, or `undefined` if the form shows
   * every error at a field: `error` if the response has no field errors,
   * else the field errors that match no field of the form.
   */
  generalError?: string;
  /** The error that the provider threw, if any. */
  cause?: unknown;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-failed": EccServiceCreateFailedEvent;
  }
}
