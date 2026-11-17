/**
 * Failures of verification requests, shared by the verification component
 * and the services list, so that their `ecc-service-verification-failed`
 * events carry the same fields and they reload after the same failures
 */

import { nonBlankString } from "../../providers/errors.js";
import type { EccServiceVerificationFailedEvent } from "../../events/index.js";

export type FailureDetail = EccServiceVerificationFailedEvent["detail"];

/**
 * Status of an error that a provider threw, if it has one
 * @param err The error
 * @returns Its numeric `status`, else `undefined`
 */
export const statusOf = (err: unknown): number | undefined => {
  const status =
    err && typeof err === "object"
      ? (err as Record<string, unknown>).status
      : undefined;
  return typeof status === "number" ? status : undefined;
};

/**
 * Detail of `ecc-service-verification-failed` for an error that a provider
 * threw: its message, and the status and problem details if it has them.
 * They are read from the error's fields, as `CloudRegistryError` has them,
 * so that errors of custom providers with the same fields work too.
 * @param serviceId ID of the service (empty for the list's verifications)
 * @param action What failed
 * @param err The error
 * @param fallback Message if the error has none
 * @returns The event's detail
 */
export const failureDetail = (
  serviceId: string,
  action: FailureDetail["action"],
  err: unknown,
  fallback: string
): FailureDetail => {
  const fields =
    err && typeof err === "object" ? (err as Record<string, unknown>) : {};
  const detail = nonBlankString(fields.detail);
  return {
    serviceId,
    action,
    error:
      nonBlankString(fields.message) ??
      detail ??
      nonBlankString(err) ??
      fallback,
    status: statusOf(err),
    title: nonBlankString(fields.title),
    detail,
    code: nonBlankString(fields.code),
    cause: err,
  };
};

/**
 * Whether the verifications must be loaded again after a failed verify or
 * remove: if its outcome is unclear (no status, e.g. a lost connection, or
 * a server error), as the registry may have applied it, or if it conflicts
 * (`409`), e.g. because the service changed. Other failures (e.g. `400`,
 * `403`, `404`) left the verification as it was.
 * @param status HTTP status of the failure, if there is one
 * @returns `true` if the verifications must be loaded again
 */
export const needsReload = (status: number | undefined): boolean =>
  status === undefined || status === 409 || status >= 500;
