import { LitElement, html, css, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ComplianceConfig,
  cookieCategories,
  DEFAULT_COOKIE_TEXTS,
  FooterItem,
  footerItems,
  hasConsent,
  onConsentChange,
  openCookiePreferences,
} from "../cookie-consent/consent.js";
import {
  isSameOrigin,
  mailtoHref,
  safeEmbedSrc,
  safeHref,
} from "../cookie-consent/urls.js";
import { renderMarkdown } from "./markdown.js";
import "../button/index.js";

type DialogItem = FooterItem & {
  action: Extract<FooterItem["action"], { type: "page" | "embed" }>;
};

/**
 * @summary Footer with links to legal and regulatory information, configured
 * by the shared compliance configuration.
 * @since 2.0.0
 *
 * @property {ComplianceConfig} config - Shared compliance configuration; the component uses `config.footer` (and `config.cookies` for embeds that need consent).
 *
 * @fires ecc-compliance-item-selected - Fired when the user selects an item (detail: `{ item }`), before its action runs. Cancel the event (`preventDefault()`) to handle the item yourself, e.g. with the app's router.
 *
 * @csspart nav - The navigation with the items.
 * @csspart item - Each item.
 * @csspart dialog - The dialog of pages and embeds.
 */
export class EccUtilsDesignComplianceFooter extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
      dialog::backdrop {
        background: rgb(0 0 0 / 0.5);
      }
    `,
  ];

  @property({ attribute: false }) config: ComplianceConfig = {};

  /** The page or embed shown in the dialog. */
  @state() private openItem: DialogItem | null = null;

  @query("dialog") private dialog?: HTMLDialogElement;

  private stopListening?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.listen();
  }

  disconnectedCallback(): void {
    this.stopListening?.();
    this.stopListening = undefined;
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config") && this.isConnected) this.listen();
  }

  /** Renders again when consent changes, so that embeds load once allowed. */
  private listen(): void {
    this.stopListening?.();
    this.stopListening = onConsentChange(
      () => this.requestUpdate(),
      this.config?.cookies
    );
  }

  private select(item: FooterItem, event?: Event): boolean {
    const selected = new CustomEvent("ecc-compliance-item-selected", {
      detail: { item },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const proceed = this.dispatchEvent(selected);
    if (!proceed) event?.preventDefault();
    return proceed;
  }

  private async openDialog(item: DialogItem): Promise<void> {
    this.openItem = item;
    await this.updateComplete;
    if (this.isConnected && this.dialog && !this.dialog.open) {
      this.dialog.showModal();
    }
  }

  private runAction(item: FooterItem): void {
    const { action } = item;
    if (!action || !this.select(item)) return;
    if (action.type === "preferences") openCookiePreferences();
    else if (action.type === "page" || action.type === "embed") {
      this.openDialog(item as DialogItem);
    }
  }

  private renderItem(item: FooterItem) {
    const { action } = item;
    const linkClasses =
      "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";
    if (action?.type === "link" || action?.type === "mailto") {
      const href =
        action.type === "link"
          ? safeHref(action.href)
          : mailtoHref(action.email, action.subject);
      if (!href) return nothing;
      const newTab = action.type === "link" && action.newTab;
      return html`<li part="item">
        <a
          class=${linkClasses}
          href=${href}
          target=${newTab ? "_blank" : nothing}
          rel=${newTab ? "noopener noreferrer" : nothing}
          @click=${(event: Event) => this.select(item, event)}
          >${item.label}</a
        >
      </li>`;
    }
    if (action?.type === "embed" && !safeEmbedSrc(action.src)) return nothing;
    return html`<li part="item">
      <button
        type="button"
        class="${linkClasses} cursor-pointer"
        aria-haspopup=${action?.type === "preferences" ? nothing : "dialog"}
        @click=${() => this.runAction(item)}
      >
        ${item.label}
      </button>
    </li>`;
  }

  private renderEmbed(item: DialogItem) {
    if (item.action.type !== "embed") return nothing;
    const { consent } = item.action;
    const src = safeEmbedSrc(item.action.src);
    if (!src) return nothing;
    // checked on every render; consent changes request one
    if (consent && !hasConsent(consent, this.config?.cookies)) {
      const texts = { ...DEFAULT_COOKIE_TEXTS, ...this.config?.cookies?.texts };
      const label =
        cookieCategories(this.config?.cookies).find((c) => c.id === consent)
          ?.label ?? consent;
      return html`<p class="mt-4 text-sm">
          ${texts.embedConsent.replace("{category}", label)}
        </p>
        <ecc-utils-design-button
          class="mt-2"
          variant="outline"
          @click=${() => openCookiePreferences()}
          >${texts.preferencesTitle}</ecc-utils-design-button
        >`;
    }
    // a same-origin frame with both flags could lift its own sandbox
    const sandbox = isSameOrigin(src)
      ? "allow-scripts allow-popups"
      : "allow-scripts allow-same-origin allow-popups";
    return html`<iframe
      class="mt-4 h-[60vh] w-full rounded-md border border-border"
      src=${src}
      title=${item.action.title ?? item.label}
      referrerpolicy="no-referrer"
      sandbox=${sandbox}
    ></iframe>`;
  }

  private renderDialog() {
    const item = this.openItem;
    const close =
      this.config?.footer?.texts?.close ??
      this.config?.cookies?.texts?.close ??
      DEFAULT_COOKIE_TEXTS.close;
    return html`
      <dialog
        part="dialog"
        aria-labelledby="ecc-compliance-dialog-title"
        class="m-auto w-[min(48rem,calc(100%-2rem))] rounded-lg border border-border bg-background p-6 text-foreground shadow-lg"
        @close=${() => {
          this.openItem = null;
        }}
      >
        ${item
          ? html`<h2
                id="ecc-compliance-dialog-title"
                class="text-lg font-semibold"
              >
                ${item.action.title ?? item.label}
              </h2>
              <div class="max-h-[70vh] overflow-y-auto text-sm">
                ${item.action.type === "page"
                  ? renderMarkdown(item.action.markdown)
                  : this.renderEmbed(item)}
              </div>`
          : nothing}
        <div class="mt-4 flex justify-end">
          <ecc-utils-design-button
            variant="outline"
            @click=${() => this.dialog?.close()}
            >${close}</ecc-utils-design-button
          >
        </div>
      </dialog>
    `;
  }

  render() {
    const items = footerItems(this.config?.footer);
    return html`
      <nav
        part="nav"
        aria-label=${this.config?.footer?.label ?? "Legal"}
        class="w-full"
      >
        <ul class="flex flex-wrap items-center gap-x-4 gap-y-1">
          ${items.map((item) => this.renderItem(item))}
        </ul>
      </nav>
      ${this.renderDialog()}
    `;
  }
}

export default EccUtilsDesignComplianceFooter;
