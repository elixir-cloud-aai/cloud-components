/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { html as litHtml } from "lit";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryServices } from "../services.js";
import type {
  ExternalService,
  ServiceRegistryProvider,
  ServiceType,
} from "../../../providers/index.js";

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
const DRS: ServiceType = {
  group: "org.ga4gh",
  artifact: "drs",
  version: "1.4.0",
};

/** The value of a type in the type filter. */
const key = (type: ServiceType) =>
  JSON.stringify([type.group, type.artifact, type.version]);

/** A service with the given fields; the rest are defaults. */
const service = (
  id: string,
  fields: Partial<ExternalService> = {}
): ExternalService => ({
  id,
  name: `Service ${id}`,
  type: TES,
  organization: { name: "Org A", url: "https://a.example.org" },
  version: "1.0.0",
  url: `https://${id}.example.org/ga4gh/tes/v1`,
  ...fields,
});

const SERVICES: ExternalService[] = [
  service("s1", { environment: "prod" }),
  service("s2", {
    type: WES,
    organization: { name: "Org B", url: "" },
    environment: "test",
  }),
  service("s3", { environment: "test" }),
];

/** A provider whose methods are stubs. */
const stubProvider = (services: ExternalService[] = SERVICES) =>
  ({
    getServices: sinon.stub().resolves(services),
    getServiceById: sinon.stub().rejects(new Error("not used")),
    getServiceTypes: sinon.stub().resolves([TES, WES]),
    getServiceInfo: sinon.stub().rejects(new Error("not used")),
  } satisfies ServiceRegistryProvider);

type El = ECCClientGa4ghServiceRegistryServices;

const root = (el: El) => el.shadowRoot as ShadowRoot;

/** The rows of the table body that show a service. */
const rows = (el: El) =>
  Array.from(
    root(el).querySelectorAll<HTMLElement>(
      "ecc-utils-design-table-body ecc-utils-design-table-row[data-service-id]"
    )
  );

const shownIds = (el: El) => rows(el).map((row) => row.dataset.serviceId);

/**
 * Replaces the loaded services, as a reload (e.g. from another registry)
 * does; the lifecycle that reloads is out of scope here.
 */
const setServices = (el: El, services: ExternalService[]) => {
  const internals = el as unknown as { services: ExternalService[] };
  internals.services = services;
};

/** Renders the component and waits until the services are listed. */
const renderLoaded = async (
  provider: ServiceRegistryProvider = stubProvider(),
  attributes = ""
): Promise<El> => {
  const el = await fixture<El>(
    html`<ecc-client-ga4gh-service-registry-services
      .provider=${provider}
    ></ecc-client-ga4gh-service-registry-services>`
  );
  for (const [name, value] of attributes
    .split(" ")
    .filter(Boolean)
    .map((pair) => pair.split("="))) {
    el.setAttribute(name, value ?? "");
  }
  await waitUntil(() => rows(el).length > 0, "services not listed");
  await el.updateComplete;
  return el;
};

/** Sends a value as the design system's inputs and selects do. */
const change = async (el: El, target: Element | null, value: string) => {
  if (!target) throw new Error("control not found");
  target.dispatchEvent(
    new CustomEvent("ecc-input-changed", {
      detail: { value },
      bubbles: true,
      composed: true,
    })
  );
  await el.updateComplete;
};

/** The element that matches the selector; fails the test if there is none. */
const find = <T extends Element = HTMLElement>(el: El, selector: string): T => {
  const found = root(el).querySelector<T>(selector);
  if (!found) throw new Error(`${selector} not found`);
  return found;
};

/** The values of the type filter's options. */
const typeValues = (el: El) =>
  Array.from(
    root(el).querySelectorAll(
      'ecc-utils-design-select[data-filter="type"] ecc-utils-design-select-item'
    )
  ).map((item) => item.getAttribute("value"));

const filterSelect = (el: El, name: string) =>
  root(el).querySelector(`ecc-utils-design-select[data-filter="${name}"]`);

const searchInput = (el: El) =>
  root(el).querySelector("ecc-utils-design-input[data-search]");

describe("ecc-client-ga4gh-service-registry-services", () => {
  afterEach(() => sinon.restore());

  describe("search", () => {
    it("filters the loaded list without fetching it again", async () => {
      const provider = stubProvider();
      const el = await renderLoaded(provider);

      await change(el, searchInput(el), "Service s2");

      expect(shownIds(el)).to.deep.equal(["s2"]);
      expect(provider.getServices.callCount).to.equal(1);
    });

    it("matches the type version", async () => {
      const el = await renderLoaded(
        stubProvider([service("s1"), service("s2", { type: DRS })])
      );

      await change(el, searchInput(el), "1.4.0");

      expect(shownIds(el)).to.deep.equal(["s2"]);
    });

    it("matches the service URL", async () => {
      const el = await renderLoaded();

      await change(el, searchInput(el), "s3.example.org");

      expect(shownIds(el)).to.deep.equal(["s3"]);
    });

    it("shows all services again when the query is cleared", async () => {
      const el = await renderLoaded();

      await change(el, searchInput(el), "s3.example.org");
      await change(el, searchInput(el), "");

      expect(shownIds(el)).to.deep.equal(["s1", "s2", "s3"]);
    });

    it("ignores the query while the search is hidden", async () => {
      const el = await renderLoaded();
      await change(el, searchInput(el), "s3.example.org");

      el.search = false;
      await el.updateComplete;
      expect(shownIds(el)).to.deep.equal(["s1", "s2", "s3"]);

      el.search = true;
      await el.updateComplete;
      expect(shownIds(el)).to.deep.equal(["s3"]);
      expect(
        (searchInput(el) as HTMLElement & { value: string }).value
      ).to.equal("s3.example.org");
    });
  });

  describe("filters", () => {
    it("filters by type", async () => {
      const el = await renderLoaded();

      await change(el, filterSelect(el, "type"), key(WES));

      expect(shownIds(el)).to.deep.equal(["s2"]);
    });

    it("keeps types apart whose fields contain separators", async () => {
      const a: ServiceType = { group: "x:y", artifact: "z", version: "1" };
      const b: ServiceType = { group: "x", artifact: "y:z", version: "1" };
      const provider = stubProvider([
        service("s1", { type: a }),
        service("s2", { type: b }),
      ]);
      provider.getServiceTypes.resolves([a, b]);
      const el = await renderLoaded(provider);
      await waitUntil(() => typeValues(el).length === 3, "types not listed");

      await change(el, filterSelect(el, "type"), key(b));

      expect(shownIds(el)).to.deep.equal(["s2"]);
    });

    it("offers the types the registry lists", async () => {
      const provider = stubProvider();
      provider.getServiceTypes.resolves([TES, WES, DRS]);
      const el = await renderLoaded(provider);

      // DRS is listed by the registry only, not by any loaded service
      await waitUntil(
        () => typeValues(el).includes(key(DRS)),
        "registry types not offered"
      );
      expect(provider.getServiceTypes.calledOnce).to.equal(true);
      expect(typeValues(el)).to.deep.equal(["", key(TES), key(WES), key(DRS)]);
    });

    it("offers the services' types if the registry lists none", async () => {
      const provider = stubProvider([service("s1"), service("s2")]);
      provider.getServiceTypes.resolves([]);
      const el = await renderLoaded(provider);
      await waitUntil(
        () => provider.getServiceTypes.calledOnce,
        "registry types not requested"
      );
      await el.updateComplete;

      expect(typeValues(el)).to.deep.equal(["", key(TES)]);
    });

    it("filters by organization", async () => {
      const el = await renderLoaded();

      await change(el, filterSelect(el, "organization"), "Org A");

      expect(shownIds(el)).to.deep.equal(["s1", "s3"]);
    });

    it("filters by environment", async () => {
      const el = await renderLoaded();

      await change(el, filterSelect(el, "environment"), "test");

      expect(shownIds(el)).to.deep.equal(["s2", "s3"]);
    });

    it("combines filters and search", async () => {
      const el = await renderLoaded();

      await change(el, filterSelect(el, "environment"), "test");
      await change(el, filterSelect(el, "organization"), "Org A");
      await change(el, searchInput(el), "s1");

      expect(shownIds(el)).to.deep.equal([]);
      expect(root(el).textContent).to.contain("No services found");
    });

    it("hides the environment filter if no service has one", async () => {
      const el = await renderLoaded(
        stubProvider([service("s1"), service("s2")])
      );

      expect(filterSelect(el, "type")).to.not.equal(null);
      expect(filterSelect(el, "environment")).to.equal(null);
    });

    it("renders no filters if filter is off", async () => {
      const el = await renderLoaded();
      el.filter = false;
      await el.updateComplete;

      expect(filterSelect(el, "type")).to.equal(null);
      expect(filterSelect(el, "organization")).to.equal(null);
    });

    it("ignores the selected filters once they are hidden", async () => {
      const el = await renderLoaded();
      await change(el, filterSelect(el, "organization"), "Org B");
      expect(shownIds(el)).to.deep.equal(["s2"]);

      el.filter = false;
      await el.updateComplete;

      expect(shownIds(el)).to.deep.equal(["s1", "s2", "s3"]);
    });

    it("ignores a selected value that is no longer an option", async () => {
      const el = await renderLoaded();
      await change(el, filterSelect(el, "organization"), "Org B");

      // As after a reload from another registry
      setServices(el, [service("s4"), service("s5")]);
      await el.updateComplete;

      expect(shownIds(el)).to.deep.equal(["s4", "s5"]);
    });
  });

  describe("pagination", () => {
    const many = Array.from({ length: 12 }, (_, i) => service(`s${i + 1}`));

    it("shows one page of the size set by page-size", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=5");

      expect(el.pageSize).to.equal(5);
      expect(shownIds(el)).to.deep.equal(["s1", "s2", "s3", "s4", "s5"]);
      expect(
        root(el).querySelector("ecc-utils-design-pagination")
      ).to.not.equal(null);
    });

    it("moves to the next and to a numbered page", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=5");

      find(el, "ecc-utils-design-pagination-next").dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "next" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      expect(shownIds(el)).to.deep.equal(["s6", "s7", "s8", "s9", "s10"]);

      find(el, 'ecc-utils-design-pagination-link[data-page="3"]').dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "link" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      expect(shownIds(el)).to.deep.equal(["s11", "s12"]);
    });

    it("goes back to the first page when the filters change", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=5");

      find(el, 'ecc-utils-design-pagination-link[data-page="3"]').dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "link" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      // Matches all 12 services, more than one page
      await change(el, searchInput(el), "example.org");

      expect(shownIds(el)).to.deep.equal(["s1", "s2", "s3", "s4", "s5"]);
    });

    it("renders no pagination for a single page", async () => {
      const el = await renderLoaded();

      expect(root(el).querySelector("ecc-utils-design-pagination")).to.equal(
        null
      );
    });

    it("shows 10 services per page by default", async () => {
      const el = await renderLoaded(stubProvider(many));

      expect(rows(el)).to.have.length(10);
    });

    it("links the first, last and nearby pages", async () => {
      const lots = Array.from({ length: 50 }, (_, i) => service(`s${i + 1}`));
      const el = await renderLoaded(stubProvider(lots), "page-size=5");
      find(
        el,
        'ecc-utils-design-pagination-link[data-page="10"]'
      ).dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "link" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      const pages = () =>
        Array.from(
          root(el).querySelectorAll<HTMLElement>(
            "ecc-utils-design-pagination-link"
          )
        ).map((link) => link.dataset.page);
      const ellipses = () =>
        root(el).querySelectorAll("ecc-utils-design-pagination-ellipsis")
          .length;

      expect(pages()).to.deep.equal(["1", "9", "10"]);
      expect(ellipses()).to.equal(1);

      find(el, 'ecc-utils-design-pagination-link[data-page="9"]').dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "link" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      find(el, "ecc-utils-design-pagination-previous").dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "previous" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;
      expect(pages()).to.deep.equal(["1", "7", "8", "9", "10"]);
      expect(ellipses()).to.equal(1);
    });

    it("shows the last page if the list shrinks below the page", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=5");
      find(el, 'ecc-utils-design-pagination-link[data-page="3"]').dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: { variant: "link" },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;

      setServices(el, many.slice(0, 7));
      await el.updateComplete;

      expect(shownIds(el)).to.deep.equal(["s6", "s7"]);
    });

    it("rounds a fractional page-size down", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=2.5");

      expect(shownIds(el)).to.deep.equal(["s1", "s2"]);
    });

    it("shows all services if page-size is invalid", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=abc");

      expect(rows(el)).to.have.length(12);
    });

    it("shows all services if page-size is 0", async () => {
      const el = await renderLoaded(stubProvider(many), "page-size=0");

      expect(rows(el)).to.have.length(12);
      expect(root(el).querySelector("ecc-utils-design-pagination")).to.equal(
        null
      );
    });
  });

  describe("rows", () => {
    it("renders the actions that rowActions returns for each row", async () => {
      const el = await renderLoaded();
      const seen: string[] = [];
      el.rowActions = (s: ExternalService) => {
        seen.push(s.id);
        return s.organization.name === "Org A"
          ? litHtml`<button class="edit">Edit ${s.id}</button>`
          : null;
      };
      await el.updateComplete;

      const edits = Array.from(root(el).querySelectorAll("button.edit")).map(
        (button) => button.textContent
      );
      expect(edits).to.deep.equal(["Edit s1", "Edit s3"]);
      expect(seen).to.include.members(["s1", "s2", "s3"]);
    });

    it("accepts DOM nodes from rowActions", async () => {
      const el = await renderLoaded();
      el.rowActions = (s: ExternalService) => {
        const button = document.createElement("button");
        button.className = "delete";
        button.textContent = `Delete ${s.id}`;
        return button;
      };
      await el.updateComplete;

      expect(root(el).querySelectorAll("button.delete")).to.have.length(3);
    });

    it("selects a service when its row is clicked", async () => {
      const el = await renderLoaded();

      const selected = sinon.spy();
      el.addEventListener("ecc-service-selected", selected);

      rows(el)[1].click();

      expect(selected.callCount).to.equal(1);
      expect((selected.firstCall.args[0] as CustomEvent).detail).to.deep.equal({
        serviceId: "s2",
      });
    });

    it("doesn't select a service for clicks on its actions", async () => {
      const el = await renderLoaded();
      el.rowActions = () => litHtml`<button class="edit">Edit</button>`;
      await el.updateComplete;
      const selected = sinon.spy();
      el.addEventListener("ecc-service-selected", selected);

      find(el, "button.edit").click();

      expect(selected.called).to.equal(false);
    });

    it("renders no actions for rows where rowActions returns null", async () => {
      const el = await renderLoaded();
      el.rowActions = () => null;
      await el.updateComplete;

      expect(
        root(el).querySelectorAll(
          'slot[name^="actions-"] ecc-utils-design-button'
        )
      ).to.have.length(0);
    });

    it("renders the rows again with a new rowActions", async () => {
      const el = await renderLoaded();
      el.rowActions = () => litHtml`<button class="edit">Edit</button>`;
      await el.updateComplete;

      el.rowActions = () => litHtml`<button class="delete">Delete</button>`;
      await el.updateComplete;

      expect(root(el).querySelectorAll("button.edit")).to.have.length(0);
      expect(root(el).querySelectorAll("button.delete")).to.have.length(3);
    });

    it("opens the organization link without selecting the row", async () => {
      const el = await renderLoaded();
      const open = sinon.stub(window, "open");
      const selected = sinon.spy();
      el.addEventListener("ecc-service-selected", selected);

      find(
        el,
        '[data-service-id="s1"] ecc-utils-design-button[data-no-select]'
      ).click();

      expect(selected.called).to.equal(false);
      expect(
        open.calledOnceWith(
          "https://a.example.org",
          "_blank",
          "noopener,noreferrer"
        )
      ).to.equal(true);
    });

    it("links only web URLs of organizations", async () => {
      const el = await renderLoaded(
        stubProvider([
          service("s1", {
            // eslint-disable-next-line no-script-url
            organization: { name: "Org X", url: "javascript:alert(1)" },
          }),
          service("s2", {
            organization: { name: "Org Y", url: "www.example.org" },
          }),
        ])
      );

      expect(
        root(el).querySelectorAll("ecc-utils-design-button[data-no-select]")
      ).to.have.length(0);
      expect(rows(el)[0].textContent).to.contain("Org X");
      expect(rows(el)[1].textContent).to.contain("Org Y");
    });

    it("shows the error if the services can't be loaded", async () => {
      const provider = stubProvider();
      provider.getServices.rejects(new Error("registry down"));
      const el = await fixture<El>(
        html`<ecc-client-ga4gh-service-registry-services
          .provider=${provider}
        ></ecc-client-ga4gh-service-registry-services>`
      );
      await waitUntil(
        () => root(el).textContent?.includes("registry down"),
        "error not shown"
      );

      await el.updateComplete;

      expect(rows(el)).to.have.length(0);
      // Loading has ended: no skeleton rows
      expect(
        root(el).querySelectorAll("ecc-utils-design-skeleton")
      ).to.have.length(0);
      expect(root(el).querySelector("ecc-utils-design-pagination")).to.equal(
        null
      );
    });

    it("keeps the actions slot of each row", async () => {
      const el = await renderLoaded();

      expect(root(el).querySelector('slot[name="actions-s1"]')).to.not.equal(
        null
      );
    });
  });
});
