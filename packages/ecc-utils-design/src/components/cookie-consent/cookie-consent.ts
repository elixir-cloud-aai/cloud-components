import { LitElement, html, css, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ComplianceConfig,
  CookieCategory,
  CookieConsent,
  DEFAULT_COOKIE_TEXTS,
  PREFERENCES_REQUESTED_EVENT,
  cookieCategories,
  readConsent,
  saveConsent,
} from "./consent.js";
import { safeHref } from "./urls.js";
import "../button/index.js";

/**
 * @summary Cookie consent banner and preferences, configured by the shared
 * compliance configuration.
 * @since 2.0.0
 *
 * @property {ComplianceConfig} config - Shared compliance configuration; the component uses `config.cookies`.
 *
 * @fires ecc-cookie-consent-changed - Fired when the user saved their choices (detail: `{ consent }`). The event doesn't bubble; the same event fires on `window` for any code on the page.
 *
 * @csspart banner - The banner.
 * @csspart dialog - The preferences dialog.
 */
export class EccUtilsDesignCookieConsent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: contents;
      }
      dialog::backdrop {
        background: rgb(0 0 0 / 0.5);
      }
    `,
  ];

  @property({ attribute: false }) config: ComplianceConfig = {};

  /** Whether the banner is shown. */
  @state() private bannerOpen = false;

  /** Choices in the preferences, per category ID. */
  @state() private choices: Record<string, boolean> = {};

  @query("dialog") private dialog?: HTMLDialogElement;

  private readonly onPreferencesRequested = () => this.openPreferences();

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(
      PREFERENCES_REQUESTED_EVENT,
      this.onPreferencesRequested
    );
  }

  disconnectedCallback(): void {
    window.removeEventListener(
      PREFERENCES_REQUESTED_EVENT,
      this.onPreferencesRequested
    );
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config")) {
      const consent = readConsent(this.config?.cookies);
      const optional = this.categories.some((category) => !category.required);
      this.bannerOpen =
        !consent && (optional || !!this.config?.cookies?.notice);
      this.choices = this.currentChoices(consent);
    }
  }

  /** Opens the preferences, e.g. from a "Cookie Preferences" link. */
  async openPreferences(): Promise<void> {
    this.choices = this.currentChoices(readConsent(this.config?.cookies));
    await this.updateComplete;
    if (this.dialog && !this.dialog.open) this.dialog.showModal();
  }

  private get categories(): CookieCategory[] {
    return cookieCategories(this.config?.cookies);
  }

  private get texts() {
    return { ...DEFAULT_COOKIE_TEXTS, ...this.config?.cookies?.texts };
  }

  private currentChoices(consent: CookieConsent | null) {
    const choices: Record<string, boolean> = {};
    this.categories.forEach((category) => {
      choices[category.id] =
        !!category.required || consent?.categories[category.id] === true;
    });
    return choices;
  }

  private save(choices: Record<string, boolean>): void {
    const consent = saveConsent(this.config?.cookies, choices);
    this.choices = this.currentChoices(consent);
    this.bannerOpen = false;
    if (this.dialog?.open) this.dialog.close();
    this.dispatchEvent(
      // not bubbling: `saveConsent()` fires the same event on `window`
      new CustomEvent("ecc-cookie-consent-changed", { detail: { consent } })
    );
  }

  private all(on: boolean): Record<string, boolean> {
    const choices: Record<string, boolean> = {};
    this.categories.forEach((category) => {
      choices[category.id] = on || !!category.required;
    });
    return choices;
  }

  private toggle(id: string, event: Event): void {
    const { checked } = event.target as HTMLInputElement;
    this.choices = { ...this.choices, [id]: checked };
  }

  private renderPolicyLink() {
    const href = safeHref(this.config?.cookies?.policyUrl);
    if (!href) return nothing;
    return html`<a class="underline underline-offset-4" href=${href}
      >${this.texts.policyLink}</a
    >`;
  }

  private renderBanner() {
    if (!this.bannerOpen) return nothing;
    const { texts } = this;
    return html`
      <section
        part="banner"
        aria-labelledby="ecc-cookie-banner-title"
        class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-4 text-foreground shadow-lg"
      >
        <div
          class="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="text-sm">
            <h2 id="ecc-cookie-banner-title" class="mb-1 font-semibold">
              ${texts.bannerTitle}
            </h2>
            <p>${texts.bannerText} ${this.renderPolicyLink()}</p>
          </div>
          <div class="flex shrink-0 flex-wrap gap-2">
            <ecc-utils-design-button
              variant="outline"
              @click=${() => this.openPreferences()}
              >${texts.customize}</ecc-utils-design-button
            >
            <ecc-utils-design-button
              variant="default"
              data-action="reject"
              @click=${() => this.save(this.all(false))}
              >${texts.rejectAll}</ecc-utils-design-button
            >
            <ecc-utils-design-button
              variant="default"
              data-action="accept"
              @click=${() => this.save(this.all(true))}
              >${texts.acceptAll}</ecc-utils-design-button
            >
          </div>
        </div>
      </section>
    `;
  }

  private renderCategory(category: CookieCategory) {
    const inputId = `ecc-cookie-category-${category.id}`;
    return html`
      <li class="flex items-start gap-3 py-3">
        <input
          id=${inputId}
          type="checkbox"
          class="mt-1 h-4 w-4 accent-primary"
          .checked=${!!category.required || !!this.choices[category.id]}
          ?disabled=${!!category.required}
          @change=${(event: Event) => this.toggle(category.id, event)}
        />
        <label for=${inputId} class="text-sm">
          <span class="font-medium">${category.label}</span>
          ${category.required
            ? html`<span class="text-muted-foreground">
                (${this.texts.alwaysOn})</span
              >`
            : nothing}
          ${category.description
            ? html`<span class="block text-muted-foreground"
                >${category.description}</span
              >`
            : nothing}
        </label>
      </li>
    `;
  }

  private renderDialog() {
    const { texts } = this;
    return html`
      <dialog
        part="dialog"
        aria-labelledby="ecc-cookie-preferences-title"
        class="m-auto w-[min(32rem,calc(100%-2rem))] rounded-lg border border-border bg-background p-6 text-foreground shadow-lg"
      >
        <h2 id="ecc-cookie-preferences-title" class="text-lg font-semibold">
          ${texts.preferencesTitle}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          ${texts.preferencesText} ${this.renderPolicyLink()}
        </p>
        <ul class="mt-2 divide-y divide-border">
          ${this.categories.map((category) => this.renderCategory(category))}
        </ul>
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <ecc-utils-design-button
            variant="ghost"
            @click=${() => this.dialog?.close()}
            >${texts.close}</ecc-utils-design-button
          >
          <ecc-utils-design-button
            variant="outline"
            data-action="reject"
            @click=${() => this.save(this.all(false))}
            >${texts.rejectAll}</ecc-utils-design-button
          >
          <ecc-utils-design-button
            variant="outline"
            data-action="accept"
            @click=${() => this.save(this.all(true))}
            >${texts.acceptAll}</ecc-utils-design-button
          >
          <ecc-utils-design-button
            variant="default"
            data-action="save"
            @click=${() => this.save(this.choices)}
            >${texts.save}</ecc-utils-design-button
          >
        </div>
      </dialog>
    `;
  }

  render() {
    return html`${this.renderBanner()}${this.renderDialog()}`;
  }
}

export default EccUtilsDesignCookieConsent;
