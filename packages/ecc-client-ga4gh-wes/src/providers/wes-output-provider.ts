/**
 * Access to the files that workflow runs produce (their outputs), for the
 * elements that show outputs (e.g. `ecc-client-ga4gh-wes-run-output`).
 *
 * The app implements it: it decides how the URIs of outputs (e.g. `s3://`
 * or `drs://`) become URLs that the browser can fetch, and adds
 * credentials. Elements call it only for URIs whose scheme is on their
 * allow-list; they never fetch or link the URIs themselves.
 *
 * The allow-list doesn't check hosts, and output URIs come from the run:
 * an `https` URI can name an internal service. Implementations that fetch
 * or sign URIs on a server (a proxy, a presigning service) must accept only
 * the deployment's own storage and DRS hosts, and must not follow
 * redirects elsewhere.
 */
export interface WesOutputProvider {
  /**
   * Fetches the content of an output file, for a viewer (e.g. a table or a
   * sandboxed HTML frame). Responses that aren't `ok` are shown as errors.
   *
   * @param uri - URI of the output, as in the normalised outputs object.
   * @param init - Options of the request; `signal` aborts it when the
   *   element no longer needs the content.
   */
  fetchOutput(uri: string, init?: { signal?: AbortSignal }): Promise<Response>;

  /**
   * Returns an `http:` or `https:` URL that downloads an output file. The
   * response to that URL must make the browser save the file rather than
   * show it: `Content-Disposition: attachment` and
   * `X-Content-Type-Options: nosniff`, set by a proxy or by the storage
   * (e.g. the `response-content-disposition` parameter of a presigned S3
   * URL). Stored files can contain active content (HTML, SVG, PDF), which
   * would otherwise open unsandboxed on the origin of the storage.
   *
   * @param uri - URI of the output, as in the normalised outputs object.
   */
  getDownloadUrl(uri: string): Promise<string>;
}
