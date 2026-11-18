import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { Verification } from "../../providers/index.js";
import "@elixir-cloud/design/components/badge/index.js";

/** Date of a verification for people, e.g. "20 Oct 2026"; else as sent */
const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * @summary Shows a "Verified" badge for a service that is verified in Cloud Registry
 * @since 2.0.0
 *
 * @property {Verification | null} verification - The verification of the service, as the app loaded it (e.g. from `getVerifications()` with `verifiedServices()`); `null` or `undefined`: not verified
 * @property {boolean} showUnverified - Whether to show a "Not verified" badge for services that aren't verified (attribute `show-unverified`), e.g. for admins; default `false`
 *
 * @csspart badge - The "Verified" (or "Not verified") badge
 */
export class ECCClientElixirCloudRegistryServiceVerificationBadge extends LitElement {
  static styles = [
    TailwindStyles,
    GlobalStyles,
    css`
      :host {
        display: inline-block;
      }
    `,
  ];

  /**
   * The verification of the service, as the app loaded it: e.g. from
   * `getVerifications()` with `verifiedServices()`, which keeps only the
   * verifications that still match their services. The badge sends no
   * requests: the app updates the value, e.g. from
   * `ecc-service-verification-changed`.
   */
  @property({ attribute: false }) verification?: Verification | null;

  /**
   * Whether to show a "Not verified" badge for a service without
   * verification, e.g. for admins, who can verify it; else nothing shows.
   */
  @property({ type: Boolean, attribute: "show-unverified" })
  showUnverified = false;

  render() {
    const { verification } = this;
    if (verification) {
      return html`<ecc-utils-design-badge
        part="badge"
        variant="secondary"
        title=${verification.verifiedAt
          ? `Verified on ${formatDate(verification.verifiedAt)}`
          : "Verified"}
      >
        <svg
          class="mr-1 h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
        Verified
      </ecc-utils-design-badge>`;
    }
    return this.showUnverified
      ? html`<ecc-utils-design-badge part="badge" variant="outline">
          Not verified
        </ecc-utils-design-badge>`
      : nothing;
  }
}

export default ECCClientElixirCloudRegistryServiceVerificationBadge;
