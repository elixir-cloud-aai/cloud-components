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
