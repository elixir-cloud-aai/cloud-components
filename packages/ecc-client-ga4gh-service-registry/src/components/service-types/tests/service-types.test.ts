/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryServiceTypes } from "../service-types.js";
import type {
  ServiceRegistryProvider,
  ServiceType,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";
const OTHER_URL = "https://other.example.org/ga4gh/registry/v1";
const MISSING = "Please provide either a base URL";

const TES: ServiceType = {
  group: "org.ga4gh",
  artifact: "tes",
  version: "1.1.0",
};
const WES: ServiceType = {
  group: "org.ga4gh",
  artifact: "wes",
  version: "1.1.0",
};
const CUSTOM: ServiceType = {
  group: "org.example",
  artifact: "custom",
  version: "0.1.0",
};

/** A provider whose methods are stubs; `getServiceTypes` returns `result`. */
const stubProvider = (
  result: ServiceType[] | Promise<ServiceType[]> = [TES, WES]
) =>
  ({
    getServices: sinon.stub().rejects(new Error("not used")),
    getServiceById: sinon.stub().rejects(new Error("not used")),
    getServiceTypes: sinon.stub().callsFake(async () => result),
    getServiceInfo: sinon.stub().rejects(new Error("not used")),
  } satisfies ServiceRegistryProvider);

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** The service types the component shows. */
const shown = (el: ECCClientGa4ghServiceRegistryServiceTypes) =>
  (el as unknown as { serviceTypes: ServiceType[] }).serviceTypes;

/** The rows of service types in the table, by their data attribute. */
const rows = (el: ECCClientGa4ghServiceRegistryServiceTypes) =>
  Array.from(el.shadowRoot?.querySelectorAll("[data-service-type]") ?? []).map(
    (row) => row.getAttribute("data-service-type")
  );

/** Whether the component shows skeleton rows. */
const isLoading = (el: ECCClientGa4ghServiceRegistryServiceTypes) =>
  (el.shadowRoot?.querySelectorAll("ecc-utils-design-skeleton").length ?? 0) >
  0;

describe("ecc-client-ga4gh-service-registry-service-types", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify([TES]), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("lists the service types of the provider", async () => {
    const provider = stubProvider([TES, CUSTOM]);
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 2);

    expect(rows(el)).to.deep.equal([
      "org.ga4gh:tes:1.1.0",
      "org.example:custom:0.1.0",
    ]);
    const text = el.shadowRoot?.textContent ?? "";
    expect(text).to.contain("org.ga4gh");
    expect(text).to.contain("custom");
    expect(text).to.contain("0.1.0");
    expect(provider.getServiceTypes.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("highlights GA4GH and ELIXIR groups", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider([TES, CUSTOM])}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 2);

    const variants = Array.from(
      el.shadowRoot?.querySelectorAll("ecc-utils-design-badge") ?? []
    ).map((badge) => badge.getAttribute("variant"));
    expect(variants).to.deep.equal(["secondary", "default"]);
  });

  it("shows an empty state without service types", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider([])}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("No service types found")
    );

    expect(rows(el)).to.deep.equal([]);
    expect(isLoading(el)).to.equal(false);
  });

  it("shows skeleton rows while loading", async () => {
    const slow = deferred<ServiceType[]>();
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider(slow.promise)}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => isLoading(el));

    expect(el.shadowRoot?.textContent).not.to.contain("No service types");

    slow.resolve([TES]);
    await waitUntil(() => rows(el).length === 1);
    expect(isLoading(el)).to.equal(false);
  });

  it("shows the error of a failed load", async () => {
    const provider = stubProvider();
    provider.getServiceTypes.callsFake(async () => {
      throw new Error("Failed to fetch service types: Bad Gateway");
    });
    const consoleStub = sinon.stub(console, "error");
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Bad Gateway"));

    expect(rows(el)).to.deep.equal([]);
    expect(el.shadowRoot?.textContent).not.to.contain("No service types");
    expect(consoleStub.callCount).to.equal(1);
  });

  it("shows a generic error for a failure without an Error", async () => {
    const provider = stubProvider();
    // eslint-disable-next-line prefer-promise-reject-errors
    provider.getServiceTypes.callsFake(() => Promise.reject("boom"));
    sinon.stub(console, "error");
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("Failed to load service types")
    );
  });

  it("shows a generic error for an Error without a message", async () => {
    const provider = stubProvider();
    provider.getServiceTypes.callsFake(() => Promise.reject(new Error("")));
    sinon.stub(console, "error");
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("Failed to load service types")
    );
  });

  it("reports the service types it loads", async () => {
    const reported: ServiceType[][] = [];
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider([TES])}
        @ecc-service-types-changed=${(e: CustomEvent) =>
          reported.push(e.detail.serviceTypes)}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 1);

    expect(reported).to.deep.equal([[TES]]);
  });

  it("asks for a provider without a base URL or provider", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types></ecc-client-ga4gh-service-registry-service-types>`
    );
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 1);
    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/services/types`);
    fetchStub.callsFake(
      async () =>
        new Response(JSON.stringify([WES, CUSTOM]), {
          headers: { "Content-Type": "application/json" },
        })
    );

    el.baseUrl = OTHER_URL;
    await waitUntil(() => rows(el).length === 2);

    expect(fetchStub.lastCall.args[0]).to.equal(`${OTHER_URL}/services/types`);
    expect(rows(el)).to.deep.equal([
      "org.ga4gh:wes:1.1.0",
      "org.example:custom:0.1.0",
    ]);
  });

  it("shows an error for a response that isn't a list", async () => {
    const reported: ServiceType[][] = [];
    sinon.stub(console, "error");
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider({ types: [TES] } as unknown as ServiceType[])}
        @ecc-service-types-changed=${(e: CustomEvent) =>
          reported.push(e.detail.serviceTypes)}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() =>
      el.shadowRoot?.textContent?.includes("Invalid service types")
    );

    expect(shown(el)).to.deep.equal([]);
    expect(reported).to.deep.equal([[]]);
  });

  (
    [
      ["null", null],
      ["a type without a group", { artifact: "tes", version: "1.1.0" }],
      ["a type with a numeric artifact", { ...TES, artifact: 1 }],
      ["a type without a version", { group: "org.ga4gh", artifact: "tes" }],
    ] as [string, unknown][]
  ).forEach(([name, entry]) => {
    it(`shows an error for a list with ${name}`, async () => {
      const reported: ServiceType[][] = [];
      sinon.stub(console, "error");
      const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
        html`<ecc-client-ga4gh-service-registry-service-types
          .provider=${stubProvider([TES, entry] as unknown as ServiceType[])}
          @ecc-service-types-changed=${(e: CustomEvent) =>
            reported.push(e.detail.serviceTypes)}
        ></ecc-client-ga4gh-service-registry-service-types>`
      );
      await waitUntil(() =>
        el.shadowRoot?.textContent?.includes(
          "Invalid service types: a type lacks a string group, artifact or version"
        )
      );

      expect(shown(el)).to.deep.equal([]);
      expect(reported).to.deep.equal([[]]);
    });
  });

  it("reports no service types once the base URL is cleared", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 1);
    const reported: ServiceType[][] = [];
    el.addEventListener("ecc-service-types-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceTypes)
    );

    el.baseUrl = "";
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.deep.equal([]);
    expect(reported).to.deep.equal([[]]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });

  it("loads from a provider set after the first update", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types></ecc-client-ga4gh-service-registry-service-types>`
    );
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    const provider = stubProvider();

    el.provider = provider;
    await waitUntil(() => rows(el).length === 2);

    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 2);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(provider.getServiceTypes.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<ServiceType[]>();
    const first = stubProvider(slow.promise);
    const second = stubProvider([WES]);
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );

    el.provider = second;
    await waitUntil(() => rows(el).length === 1);
    slow.resolve([TES, CUSTOM]);
    await slow.promise;
    await el.updateComplete;

    expect(shown(el)).to.deep.equal([WES]);
  });

  it("drops a late failure from a replaced provider", async () => {
    let fail: (reason: Error) => void = () => undefined;
    const first = stubProvider();
    first.getServiceTypes.callsFake(
      () =>
        new Promise<ServiceType[]>((_resolve, reject) => {
          fail = reject;
        })
    );
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );

    el.provider = stubProvider([WES]);
    await waitUntil(() => rows(el).length === 1);
    fail(new Error("Stale failure"));
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).not.to.contain("Stale failure");
    expect(shown(el)).to.deep.equal([WES]);
  });

  it("reports no service types when a replacing provider fails", async () => {
    const second = stubProvider();
    second.getServiceTypes.callsFake(async () => {
      throw new Error("Unavailable");
    });
    sinon.stub(console, "error");
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider()}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 2);
    const reported: ServiceType[][] = [];
    el.addEventListener("ecc-service-types-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceTypes)
    );

    el.provider = second;
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Unavailable"));

    expect(shown(el)).to.deep.equal([]);
    expect(reported).to.deep.equal([[]]);
  });

  it("reports no service types once the provider is removed", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServiceTypes>(
      html`<ecc-client-ga4gh-service-registry-service-types
        .provider=${stubProvider()}
      ></ecc-client-ga4gh-service-registry-service-types>`
    );
    await waitUntil(() => rows(el).length === 2);
    const reported: ServiceType[][] = [];
    el.addEventListener("ecc-service-types-changed", (e) =>
      reported.push((e as CustomEvent).detail.serviceTypes)
    );

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.deep.equal([]);
    expect(reported).to.deep.equal([[]]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });
});
