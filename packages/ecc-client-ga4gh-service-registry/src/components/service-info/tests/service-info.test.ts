/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryServiceInfo } from "../service-info.js";
import type {
  Service,
  ServiceRegistryProvider,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";
const OTHER_URL = "https://other.example.org/ga4gh/registry/v1";
const MISSING = "Please provide either a base URL";

/** The service info of a fresh registry: only the required fields. */
const minimal = (name = "Registry"): Service => ({
  id: "org.example.registry",
  name,
  type: {
    group: "org.ga4gh",
    artifact: "service-registry",
    version: "1.0.0",
  },
  organization: { name: "Example", url: "https://example.org" },
  version: "0.4.0",
});

const full: Service = {
  ...minimal(),
  description: "A registry\nfor services",
  environment: "prod",
  contactUrl: "mailto:admin@example.org",
  documentationUrl: "https://docs.example.org",
  createdAt: "2026-01-02T03:04:05Z",
  updatedAt: "2026-02-03T04:05:06Z",
};

/** A provider whose methods are stubs; `getServiceInfo` returns `result`. */
const stubProvider = (result: Service | Promise<Service> = minimal()) =>
  ({
    getServices: sinon.stub().rejects(new Error("not used")),
    getServiceById: sinon.stub().rejects(new Error("not used")),
    getServiceTypes: sinon.stub().rejects(new Error("not used")),
    getServiceInfo: sinon.stub().callsFake(async () => result),
  } satisfies ServiceRegistryProvider);

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** The service info the component shows. */
const shown = (el: ECCClientGa4ghServiceRegistryServiceInfo) =>
  (el as unknown as { serviceInfo: Service | null }).serviceInfo;

/** The keys of the detail rows on display. */
const fields = (el: ECCClientGa4ghServiceRegistryServiceInfo) =>
  Array.from(el.shadowRoot?.querySelectorAll("[data-field]") ?? []).map((row) =>
    row.getAttribute("data-field")
  );

/** The detail row with the key. */
const field = (el: ECCClientGa4ghServiceRegistryServiceInfo, key: string) =>
  el.shadowRoot?.querySelector(`[data-field="${key}"]`);

/** The badge with the key. */
const badge = (el: ECCClientGa4ghServiceRegistryServiceInfo, key: string) =>
  el.shadowRoot?.querySelector(`[data-badge="${key}"]`);

/** The targets of the links on display. */
const links = (el: ECCClientGa4ghServiceRegistryServiceInfo) =>
  Array.from(el.shadowRoot?.querySelectorAll("a") ?? []).map((a) =>
    a.getAttribute("href")
  );

const render = (provider: ServiceRegistryProvider) =>
  fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
    html`<ecc-client-ga4gh-service-registry-service-info
      .provider=${provider}
    ></ecc-client-ga4gh-service-registry-service-info>`
  );

describe("ecc-client-ga4gh-service-registry-service-info", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify(minimal()), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("shows the required fields of a fresh registry only", async () => {
    const provider = stubProvider();
    const el = await render(provider);
    await waitUntil(() => fields(el).length > 0);

    expect(fields(el)).to.deep.equal(["id", "type", "organization"]);
    const text = el.shadowRoot?.textContent ?? "";
    expect(text).to.contain("Registry");
    expect(text).to.contain("org.example.registry");
    expect(text).to.contain("org.ga4gh · service-registry · 1.0.0");
    expect(text).not.to.contain("Not specified");
    expect(text).not.to.contain("Invalid Date");
    expect(el.shadowRoot?.querySelector("[data-description]")).to.equal(null);
    expect(links(el)).to.deep.equal(["https://example.org"]);
    expect(provider.getServiceInfo.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("shows the optional fields that are set", async () => {
    const el = await render(stubProvider(full));
    await waitUntil(() => fields(el).length > 0);

    expect(fields(el)).to.deep.equal([
      "id",
      "type",
      "organization",
      "contact",
      "documentation",
      "created",
      "updated",
    ]);
    expect(links(el)).to.deep.equal([
      "https://example.org",
      "mailto:admin@example.org",
      "https://docs.example.org",
    ]);
    // version and environment show once, as badges
    expect(badge(el, "version")?.textContent?.trim()).to.equal("v0.4.0");
    expect(badge(el, "environment")?.textContent?.trim()).to.equal("prod");
    expect(field(el, "contact")?.textContent).to.contain("admin@example.org");
    expect(field(el, "contact")?.textContent).not.to.contain("mailto:");
    expect(field(el, "created")?.textContent).to.contain(
      new Date(full.createdAt as string).toLocaleString()
    );
    expect(
      el.shadowRoot?.querySelectorAll("[data-description] p").length
    ).to.equal(2);
  });

  it("leaves out invalid timestamps and links", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        organization: { name: "Example", url: "" },
        // eslint-disable-next-line no-script-url
        contactUrl: "javascript:alert(1)",
        documentationUrl: "docs/index.html",
        createdAt: "not a date",
        updatedAt: "",
      })
    );
    await waitUntil(() => fields(el).length > 0);

    expect(fields(el)).to.deep.equal(["id", "type", "organization"]);
    expect(links(el)).to.deep.equal([]);
    expect(field(el, "organization")?.textContent).to.contain("Example");
    expect(el.shadowRoot?.textContent).not.to.contain("Invalid Date");
  });

  it("leaves out a mailto: contact without an address", async () => {
    const el = await render(
      stubProvider({ ...minimal(), contactUrl: "mailto:?subject=Hello" })
    );
    await waitUntil(() => fields(el).length > 0);

    expect(field(el, "contact")).to.equal(null);
  });

  ["mailto:%E0%A4%A", "mailto:%20"].forEach((contactUrl) => {
    it(`leaves out the contact ${contactUrl} without an address`, async () => {
      const el = await render(stubProvider({ ...minimal(), contactUrl }));
      await waitUntil(() => fields(el).length > 0);

      expect(fields(el)).not.to.include("contact");
    });
  });

  [
    ["mailto:admin@example.org?subject=Hello", "admin@example.org"],
    ["MAILTO:admin@example.org", "admin@example.org"],
    ["mailto:admin%40example.org", "admin@example.org"],
    [
      "mailto:admin@example.org,help@example.org",
      "admin@example.org,help@example.org",
    ],
    ["mailto:help@example.org?cc=admin@example.org", "help@example.org"],
  ].forEach(([contactUrl, label]) => {
    it(`shows the contact ${contactUrl} as its addresses`, async () => {
      const el = await render(stubProvider({ ...minimal(), contactUrl }));
      await waitUntil(() => fields(el).length > 0);

      expect(links(el)).to.include(contactUrl);
      expect(field(el, "contact")?.querySelector("a")?.textContent).to.equal(
        label
      );
    });
  });

  (["not a date", "", 1767323045000] as unknown[]).forEach((timestamp) => {
    it(`leaves out the timestamps ${JSON.stringify(timestamp)}`, async () => {
      const el = await render(
        stubProvider({
          ...minimal(),
          createdAt: timestamp,
          updatedAt: timestamp,
        } as Service)
      );
      await waitUntil(() => fields(el).length > 0);

      expect(fields(el)).not.to.include("created");
      expect(fields(el)).not.to.include("updated");
    });
  });

  // the instants are fixed, so that the parsing isn't tested against itself
  (
    [
      ["2026-01-02T03:04:05Z", new Date(Date.UTC(2026, 0, 2, 3, 4, 5))],
      ["2026-01-02T03:04:05+02:00", new Date(Date.UTC(2026, 0, 2, 1, 4, 5))],
    ] as [string, Date][]
  ).forEach(([timestamp, instant]) => {
    it(`shows the timestamps ${timestamp}`, async () => {
      const el = await render(
        stubProvider({
          ...minimal(),
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      );
      await waitUntil(() => fields(el).length > 0);

      ["created", "updated"].forEach((key) => {
        expect(field(el, key)?.querySelector("dd")?.textContent).to.equal(
          instant.toLocaleString()
        );
      });
    });
  });

  it("styles links as links", async () => {
    const el = await render(stubProvider(full));
    await waitUntil(() => fields(el).length > 0);

    const anchors = Array.from(el.shadowRoot?.querySelectorAll("a") ?? []);
    expect(anchors.length).to.equal(3);
    anchors.forEach((anchor) => {
      expect(getComputedStyle(anchor).textDecorationLine).to.equal("underline");
    });
  });

  it("shows no undefined values for missing required fields", async () => {
    // A registry that doesn't follow the specification
    const info: Partial<Service> = minimal();
    delete info.type;
    delete info.version;
    const el = await render(stubProvider(info as Service));
    await waitUntil(() => fields(el).length > 0);

    expect(fields(el)).to.deep.equal(["id", "organization"]);
    expect(el.shadowRoot?.querySelector("[data-type]")).to.equal(null);
    expect(el.shadowRoot?.textContent).not.to.contain("undefined");
  });

  it("shows only the parts of a type that are set", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        type: { artifact: "service-registry", version: "1.0.0" },
      } as unknown as Service)
    );
    await waitUntil(() => fields(el).length > 0);

    expect(
      field(el, "type")?.querySelector("dd")?.textContent?.trim()
    ).to.equal("service-registry · 1.0.0");
    expect(el.shadowRoot?.textContent).not.to.contain("undefined");
  });

  it("shows the type badge without a version and none without artifact", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        type: { group: "org.ga4gh", artifact: "service-registry" },
      } as unknown as Service)
    );
    await waitUntil(() => fields(el).length > 0);
    expect(
      el.shadowRoot?.querySelector("[data-type]")?.textContent?.trim()
    ).to.equal("service-registry");

    el.provider = stubProvider({
      ...minimal(),
      type: { group: "org.ga4gh", version: "1.0.0" },
    } as unknown as Service);
    await waitUntil(() => field(el, "type")?.textContent?.includes("1.0.0"));
    expect(el.shadowRoot?.querySelector("[data-type]")).to.equal(null);
    expect(el.shadowRoot?.textContent).not.to.contain("undefined");
  });

  it("leaves out blank fields and fields of other types", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        id: "",
        name: " ",
        environment: " ",
        description: 1,
        contactUrl: ["https://example.org/contact"],
        documentationUrl: 42,
        createdAt: 0,
        type: { group: 5, artifact: "service-registry", version: "1.0.0" },
      } as unknown as Service)
    );
    await waitUntil(() => fields(el).length > 0);

    expect(fields(el)).to.deep.equal(["type", "organization"]);
    expect(badge(el, "environment")).to.equal(null);
    expect(el.shadowRoot?.querySelector("h2")?.textContent?.trim()).to.equal(
      "Service Registry"
    );
    expect(el.shadowRoot?.querySelector("[data-description]")).to.equal(null);
    expect(links(el)).to.deep.equal(["https://example.org"]);
    expect(
      el.shadowRoot?.querySelector("[data-type]")?.getAttribute("variant")
    ).to.equal("default");
  });

  it("falls back to the base URL once the provider is removed", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info
        .baseUrl=${BASE_URL}
        .provider=${stubProvider(minimal("Custom"))}
      ></ecc-client-ga4gh-service-registry-service-info>`
    );
    await waitUntil(() => shown(el)?.name === "Custom");
    expect(fetchStub.callCount).to.equal(0);

    el.provider = undefined;
    await waitUntil(() => shown(el)?.name === "Registry");

    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/service-info`);
  });

  it("shows the organization URL as its name without one", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        organization: { name: "", url: "https://example.org" },
      })
    );
    await waitUntil(() => fields(el).length > 0);

    expect(field(el, "organization")?.textContent).to.contain(
      "https://example.org"
    );
  });

  it("highlights the type of GA4GH and ELIXIR groups", async () => {
    const el = await render(
      stubProvider({
        ...minimal(),
        type: { group: "org.example", artifact: "custom", version: "1" },
      })
    );
    await waitUntil(() => fields(el).length > 0);

    expect(
      el.shadowRoot?.querySelector("[data-type]")?.getAttribute("variant")
    ).to.equal("default");

    el.provider = stubProvider(minimal());
    await waitUntil(
      () =>
        el.shadowRoot?.querySelector("[data-type]")?.getAttribute("variant") ===
        "secondary"
    );
  });

  it("shows skeletons while loading", async () => {
    const slow = deferred<Service>();
    const el = await render(stubProvider(slow.promise));
    await waitUntil(() => el.shadowRoot?.querySelector("[data-loading]"));

    slow.resolve(minimal());
    await waitUntil(() => fields(el).length > 0);
    expect(el.shadowRoot?.querySelector("[data-loading]")).to.equal(null);
  });

  it("shows the error of a failed load", async () => {
    const provider = stubProvider();
    provider.getServiceInfo.callsFake(async () => {
      throw new Error("Failed to fetch service info: Bad Gateway");
    });
    const consoleStub = sinon.stub(console, "error");
    const el = await render(provider);
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Bad Gateway"));

    expect(fields(el)).to.deep.equal([]);
    expect(consoleStub.callCount).to.equal(1);
  });

  for (const [label, response] of [
    ["null", null],
    ["a list", [minimal()]],
    ["a string", "Registry"],
  ] as const) {
    it(`shows an error for ${label} as service info`, async () => {
      const reported: (Service | null)[] = [];
      sinon.stub(console, "error");
      const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
        html`<ecc-client-ga4gh-service-registry-service-info
          .provider=${stubProvider(response as unknown as Service)}
          @ecc-service-info-changed=${(e: CustomEvent) =>
            reported.push(e.detail.serviceInfo)}
        ></ecc-client-ga4gh-service-registry-service-info>`
      );
      await waitUntil(() =>
        el.shadowRoot?.textContent?.includes("Invalid service info")
      );

      expect(shown(el)).to.equal(null);
      expect(reported).to.deep.equal([null]);
    });
  }

  it("shows a generic error for an Error without a message", async () => {
    const provider = stubProvider();
    provider.getServiceInfo.callsFake(() => Promise.reject(new Error("")));
    sinon.stub(console, "error");
    const el = await render(provider);
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("Failed to load service info")
    );
  });

  it("shows a generic error for a failure without an Error", async () => {
    const provider = stubProvider();
    // eslint-disable-next-line prefer-promise-reject-errors
    provider.getServiceInfo.callsFake(() => Promise.reject("boom"));
    sinon.stub(console, "error");
    const el = await render(provider);
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("Failed to load service info")
    );
  });

  it("reports the service info it loads", async () => {
    const reported: (Service | null)[] = [];
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info
        .provider=${stubProvider(full)}
        @ecc-service-info-changed=${(e: CustomEvent) =>
          reported.push(e.detail.serviceInfo)}
      ></ecc-client-ga4gh-service-registry-service-info>`
    );
    await waitUntil(() => fields(el).length > 0);

    expect(reported).to.deep.equal([full]);
  });

  it("asks for a provider without a base URL or provider", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info></ecc-client-ga4gh-service-registry-service-info>`
    );
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-service-info>`
    );
    await waitUntil(() => fields(el).length > 0);
    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/service-info`);

    el.baseUrl = OTHER_URL;
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => call.args[0] === `${OTHER_URL}/service-info`)
    );
  });

  it("reports no service info once the base URL is cleared", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-service-info>`
    );
    await waitUntil(() => fields(el).length > 0);
    const reported: (Service | null)[] = [];
    el.addEventListener("ecc-service-info-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceInfo)
    );

    el.baseUrl = "";
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.equal(null);
    expect(reported).to.deep.equal([null]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });

  it("loads from a provider set after the first update", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceInfo>(
      html`<ecc-client-ga4gh-service-registry-service-info></ecc-client-ga4gh-service-registry-service-info>`
    );
    expect(el.shadowRoot?.textContent).to.contain(MISSING);

    el.provider = stubProvider();
    await waitUntil(() => fields(el).length > 0);

    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await render(provider);
    await waitUntil(() => fields(el).length > 0);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(provider.getServiceInfo.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<Service>();
    const el = await render(stubProvider(slow.promise));

    el.provider = stubProvider(minimal("Second"));
    await waitUntil(() => shown(el)?.name === "Second");
    slow.resolve(minimal("Stale"));
    await slow.promise;
    await el.updateComplete;

    expect(shown(el)?.name).to.equal("Second");
  });

  it("drops a late failure from a replaced provider", async () => {
    let fail: (reason: Error) => void = () => undefined;
    const first = stubProvider();
    first.getServiceInfo.callsFake(
      () =>
        new Promise<Service>((_resolve, reject) => {
          fail = reject;
        })
    );
    const el = await render(first);

    el.provider = stubProvider(minimal("Second"));
    await waitUntil(() => shown(el)?.name === "Second");
    fail(new Error("Stale failure"));
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).not.to.contain("Stale failure");
    expect(shown(el)?.name).to.equal("Second");
  });

  it("reports no service info when a replacing provider fails", async () => {
    const second = stubProvider();
    second.getServiceInfo.callsFake(async () => {
      throw new Error("Unavailable");
    });
    sinon.stub(console, "error");
    const el = await render(stubProvider());
    await waitUntil(() => fields(el).length > 0);
    const reported: (Service | null)[] = [];
    el.addEventListener("ecc-service-info-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceInfo)
    );

    el.provider = second;
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Unavailable"));

    expect(shown(el)).to.equal(null);
    expect(reported).to.deep.equal([null]);
  });

  it("reports no service info once the provider is removed", async () => {
    const el = await render(stubProvider());
    await waitUntil(() => fields(el).length > 0);
    const reported: (Service | null)[] = [];
    el.addEventListener("ecc-service-info-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceInfo)
    );

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.equal(null);
    expect(reported).to.deep.equal([null]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });
});
