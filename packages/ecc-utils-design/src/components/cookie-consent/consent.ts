/**
 * Cookie consent: configuration, storage and checks, shared by
 * `ecc-utils-design-cookie-consent`, `ecc-utils-design-compliance-footer`
 * and any other code, e.g. code that loads analytics only with consent.
 * Framework independent: everything goes through `localStorage` and
 * events on `window`.
 */

/** A category of cookies (and similar storage) that users consent to. */
export interface CookieCategory {
  /** Stable identifier, e.g. "analytics"; changing it asks users again. */
  id: string;
  /** Name shown to users, e.g. "Analytics". */
  label: string;
  /** What the category is used for, shown in the preferences. */
  description?: string;
  /** Strictly necessary: always on, can't be switched off. */
  required?: boolean;
}

/** Texts of the banner and the preferences. */
export interface CookieConsentTexts {
  bannerTitle: string;
  bannerText: string;
  policyLink: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  preferencesTitle: string;
  preferencesText: string;
  save: string;
  close: string;
  alwaysOn: string;
  /** Shown instead of an embed without consent; `{category}` is replaced. */
  embedConsent: string;
}

/** Configuration of the cookie consent. */
export interface CookieConsentConfig {
  /**
   * Version of the cookie policy; changing it asks users again, as adding,
   * removing or renaming categories does.
   */
  version?: string;
  /** `localStorage` key of the stored consent. */
  storageKey?: string;
  /**
   * Categories; a required "necessary" category is added if none is
   * required. Without optional categories, the banner is shown only if
   * `notice` is set, as nothing needs consent.
   */
  categories?: CookieCategory[];
  /** Show the banner even if there are no optional categories. */
  notice?: boolean;
  /** Texts; each has an English default. */
  texts?: Partial<CookieConsentTexts>;
  /** Link to the cookie policy, shown in the banner and preferences. */
  policyUrl?: string;
}

/** Stored consent. */
export interface CookieConsent {
  /** Consent per category ID. */
  categories: Record<string, boolean>;
  /** Identifies the configuration that the consent was given for. */
  signature: string;
  /** When the consent was given (ISO 8601). */
  updatedAt: string;
}

/** What a footer item does when it is selected. */
export type FooterItemAction =
  /** Follow a link (`http(s)` or relative). */
  | { type: "link"; href: string; newTab?: boolean }
  /** Open the mail client. */
  | { type: "mailto"; email: string; subject?: string }
  /** Open the cookie preferences. */
  | { type: "preferences" }
  /** Show a page from Markdown (headings, paragraphs, lists, links, bold). */
  | { type: "page"; markdown: string; title?: string }
  /**
   * Show an embedded document (`https` URL) in a frame, e.g. a policy
   * hosted by Iubenda, Termly or GetTerms. With `consent`, the frame loads
   * only once users consented to that category.
   */
  | { type: "embed"; src: string; title?: string; consent?: string };

/** An item of the compliance footer. */
export interface FooterItem {
  /** Stable identifier, e.g. "privacy-policy". */
  id: string;
  /** Text of the item. */
  label: string;
  /** What the item does; items without an action are not shown. */
  action?: FooterItemAction;
}

/** An item in the configuration: overrides the default with its ID. */
export interface FooterItemConfig extends Partial<FooterItem> {
  id: string;
  /** Removes the (default) item. */
  hidden?: boolean;
}

/** Texts of the compliance footer. */
export interface ComplianceFooterTexts {
  /** Button that closes a page or embed. */
  close: string;
}

/** Configuration of the compliance footer. */
export interface ComplianceFooterConfig {
  /**
   * Items: entries with the ID of a default item change or hide it, others
   * are added after the defaults, in their order.
   */
  items?: FooterItemConfig[];
  /** Use only the configured items, not the defaults. */
  replaceDefaults?: boolean;
  /** Accessible name of the footer's navigation, default "Legal". */
  label?: string;
  /** Texts of the footer's dialog. */
  texts?: Partial<ComplianceFooterTexts>;
}

/** Shared configuration of the compliance components. */
export interface ComplianceConfig {
  cookies?: CookieConsentConfig;
  footer?: ComplianceFooterConfig;
}

/** Name of the `window` event fired when the consent was saved. */
export const CONSENT_CHANGED_EVENT = "ecc-cookie-consent-changed";

/** Name of the `window` event that asks to open the cookie preferences. */
export const PREFERENCES_REQUESTED_EVENT = "ecc-cookie-preferences-requested";

/** Default `localStorage` key. */
export const DEFAULT_STORAGE_KEY = "ecc-cookie-consent";

/** The default required category. */
export const NECESSARY_CATEGORY: CookieCategory = {
  id: "necessary",
  label: "Necessary",
  description:
    "Needed for the site to work, e.g. to keep you logged in and to remember these choices.",
  required: true,
};

/** Default texts. */
export const DEFAULT_COOKIE_TEXTS: CookieConsentTexts = {
  bannerTitle: "Cookies",
  bannerText:
    "We use cookies and similar technologies. Some are necessary for this site to work; others are used only with your consent.",
  policyLink: "Cookie Policy",
  acceptAll: "Accept all",
  rejectAll: "Necessary only",
  customize: "Customize",
  preferencesTitle: "Cookie preferences",
  preferencesText:
    "Choose which cookies we may use. You can change your choice at any time.",
  save: "Save choices",
  close: "Close",
  alwaysOn: "Always on",
  embedConsent:
    "This content is shown only with your consent to {category} cookies.",
};

/** Default footer items; those without an action are shown once configured. */
export const DEFAULT_FOOTER_ITEMS: readonly FooterItem[] = Object.freeze([
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "cookie-policy", label: "Cookie Policy" },
  {
    id: "cookie-preferences",
    label: "Cookie Preferences",
    action: { type: "preferences" },
  },
  { id: "imprint", label: "Imprint" },
  { id: "accessibility", label: "Accessibility Statement" },
  { id: "contact", label: "Contact Us" },
  { id: "privacy-choices", label: "Your Privacy Choices" },
]);

/**
 * The categories of a configuration, with a required one first. Entries
 * with the same ID are merged (required if any of them is); entries that
 * aren't usable (no ID, `__proto__`, a non-array setting) are skipped.
 * @param config Cookie consent configuration
 * @returns The categories
 */
export function cookieCategories(
  config?: CookieConsentConfig
): CookieCategory[] {
  const listed = config?.categories;
  const configured = Array.isArray(listed) ? listed : [];
  const categories = configured.filter(
    (category) =>
      category &&
      typeof category.id === "string" &&
      category.id &&
      category.id !== "__proto__"
  );
  const all = categories.some((category) => category.required)
    ? categories
    : [NECESSARY_CATEGORY, ...categories];
  const byId = new Map<string, CookieCategory>();
  all.forEach((category) => {
    const known = byId.get(category.id);
    byId.set(
      category.id,
      known
        ? {
            ...known,
            ...category,
            required: !!known.required || !!category.required,
          }
        : category
    );
  });
  return Array.from(byId.values());
}

/**
 * Identifies a configuration for stored consent: its version and its
 * categories (IDs and whether they are required), so that consent is asked
 * again when they change.
 * @param config Cookie consent configuration
 * @returns The signature
 */
export function consentSignature(config?: CookieConsentConfig): string {
  const categories = cookieCategories(config)
    .map((category): [string, boolean] => [category.id, !!category.required])
    .sort(([a], [b]) => (a < b ? -1 : Number(a > b)));
  return JSON.stringify([config?.version ?? "", categories]);
}

/**
 * The `localStorage` key of a configuration.
 * @param config Cookie consent configuration
 * @returns The key
 */
export const consentStorageKey = (config?: CookieConsentConfig): string =>
  config?.storageKey || DEFAULT_STORAGE_KEY;

// consent of this page that couldn't be stored, e.g. if storage is blocked
// or full; it takes precedence over what `localStorage` still holds
const memory = new Map<string, string>();

function readItem(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
    try {
      // don't leave an older choice behind for other pages
      window.localStorage.removeItem(key);
    } catch {
      // storage can't be used at all
    }
  }
}

/**
 * The stored consent, if it was given for this configuration.
 * @param config Cookie consent configuration
 * @returns The consent, or `null` if users must be asked (again)
 */
export function readConsent(
  config?: CookieConsentConfig
): CookieConsent | null {
  const raw = readItem(consentStorageKey(config));
  if (!raw) return null;
  let stored: unknown;
  try {
    stored = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!stored || typeof stored !== "object") return null;
  const consent = stored as Partial<CookieConsent>;
  if (consent.signature !== consentSignature(config)) return null;
  if (!consent.categories || typeof consent.categories !== "object") {
    return null;
  }
  const categories: Record<string, boolean> = {};
  cookieCategories(config).forEach((category) => {
    categories[category.id] =
      !!category.required || consent.categories?.[category.id] === true;
  });
  return {
    categories,
    signature: consent.signature,
    updatedAt: String(consent.updatedAt ?? ""),
  };
}

/**
 * Whether users consented to a category. Required categories always are;
 * unknown ones and those without a stored consent never are.
 * @param category Category ID, e.g. "analytics"
 * @param config Cookie consent configuration
 * @returns Whether code may use the category
 */
export function hasConsent(
  category: string,
  config?: CookieConsentConfig
): boolean {
  const known = cookieCategories(config).find((c) => c.id === category);
  if (!known) return false;
  if (known.required) return true;
  return readConsent(config)?.categories[category] === true;
}

/** Detail of the `window` event `ecc-cookie-consent-changed`. */
export interface ConsentChangedDetail {
  consent: CookieConsent;
  /** Storage key of the configuration that the consent was saved for. */
  storageKey: string;
}

// notifications in save order, also if a listener saves consent itself
const pending: ConsentChangedDetail[] = [];
let notifying = false;

function notify(detail: ConsentChangedDetail): void {
  pending.push(detail);
  if (notifying) return;
  notifying = true;
  try {
    while (pending.length) {
      const next = pending.shift() as ConsentChangedDetail;
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next })
      );
    }
  } finally {
    notifying = false;
  }
}

/**
 * Stores the consent and fires `ecc-cookie-consent-changed` on `window`.
 * @param config Cookie consent configuration
 * @param choices Consent per category ID; required ones are always on
 * @returns The stored consent
 */
export function saveConsent(
  config: CookieConsentConfig | undefined,
  choices: Record<string, boolean>
): CookieConsent {
  const categories: Record<string, boolean> = {};
  cookieCategories(config).forEach((category) => {
    categories[category.id] =
      !!category.required || choices[category.id] === true;
  });
  const consent: CookieConsent = {
    categories,
    signature: consentSignature(config),
    updatedAt: new Date().toISOString(),
  };
  const storageKey = consentStorageKey(config);
  writeItem(storageKey, JSON.stringify(consent));
  notify({ consent, storageKey });
  return consent;
}

/**
 * Calls `listener` whenever consent for the storage key of `config` is
 * saved, in this page or in another tab or window of the same origin.
 * @param listener Called with the new consent; `null` if the consent of
 * another tab was removed or doesn't fit `config`
 * @param config Cookie consent configuration
 * @returns A function that removes the listener
 */
export function onConsentChange(
  listener: (consent: CookieConsent | null) => void,
  config?: CookieConsentConfig
): () => void {
  const handler = (event: Event) => {
    const { detail } = event as CustomEvent<Partial<ConsentChangedDetail>>;
    if (!detail?.consent) return;
    if (detail.storageKey !== consentStorageKey(config)) return;
    listener(detail.consent);
  };
  const storageHandler = (event: StorageEvent) => {
    // `null`: another tab cleared the storage
    const key = consentStorageKey(config);
    if (event.key !== null && event.key !== key) return;
    // the other tab's write is newer than consent kept in memory here
    memory.delete(key);
    listener(readConsent(config));
  };
  window.addEventListener(CONSENT_CHANGED_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

/** Asks the page's cookie consent component to open the preferences. */
export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent(PREFERENCES_REQUESTED_EVENT));
}

/**
 * The footer items of a configuration: the defaults, changed, hidden or
 * extended by the configured items, without those that have no valid
 * action.
 * @param config Footer configuration
 * @returns The items to show
 */
export function footerItems(config?: ComplianceFooterConfig): FooterItem[] {
  const listed = config?.items;
  const configured = (Array.isArray(listed) ? listed : []).filter(
    (item) => item && typeof item.id === "string" && item.id
  );
  const byId = new Map(configured.map((item) => [item.id, item]));
  const defaults = config?.replaceDefaults ? [] : DEFAULT_FOOTER_ITEMS;
  const defaultIds = new Set(defaults.map((item) => item.id));
  const merged: (FooterItemConfig | FooterItem)[] = [
    ...defaults.map((item) => ({ ...item, ...byId.get(item.id) })),
    ...configured.filter((item) => !defaultIds.has(item.id)),
  ];
  return merged
    .filter((item) => !(item as FooterItemConfig).hidden)
    .filter((item): item is FooterItem => !!item.label && !!item.action)
    .map(({ id, label, action }) => ({ id, label, action }));
}
