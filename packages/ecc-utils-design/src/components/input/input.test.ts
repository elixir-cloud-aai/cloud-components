// eslint-disable-next-line import/no-extraneous-dependencies
import { fixture, expect, html } from "@open-wc/testing";
// eslint-disable-next-line import/no-extraneous-dependencies
import { executeServerCommand } from "@web/test-runner-commands";
import { LitElement } from "lit";
import { AttrForwardingController } from "../../attribute-forwarding.js";
import "./index.js";
import "../textarea/index.js";

type AxNode = {
  focused?: boolean;
  name?: string;
  description?: string;
  children?: AxNode[];
};

type ReferenceTarget = {
  ariaDescribedByElements?: readonly Element[] | null;
  ariaErrorMessageElements?: readonly Element[] | null;
};

const findFocused = (node: AxNode): AxNode | undefined =>
  node.focused ? node : node.children?.map(findFocused).find(Boolean);

const components = [
  {
    tag: "ecc-utils-design-input",
    inner: "input",
    native: { name: "title", maxlength: "10", pattern: "[a-z]+" },
  },
  {
    tag: "ecc-utils-design-textarea",
    inner: "textarea",
    native: { name: "title", maxlength: "10", minlength: "2" },
  },
];

const tick = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

class AriaDefaultsTestElement extends LitElement {
  static properties = {
    defaultLabel: { type: String },
    defaultDescription: { type: String },
    defaultReference: { type: String },
  };

  declare defaultLabel: string;

  declare defaultDescription: string;

  declare defaultReference: string;

  readonly forwarding = new AttrForwardingController(this, "input");

  constructor() {
    super();
    this.defaultLabel = "Default label";
    this.defaultDescription = "Default description";
    this.defaultReference = "local-label";
  }

  render() {
    return html`
      <input
        aria-label=${this.defaultLabel}
        aria-description=${this.defaultDescription}
        aria-labelledby=${this.defaultReference}
      />
      <span id="local-label">Local label</span>
      <span id="updated-local-label">Updated local label</span>
    `;
  }
}

customElements.define("aria-defaults-test", AriaDefaultsTestElement);

describe("component ARIA defaults", () => {
  const create = async () => {
    const wrapper = await fixture<HTMLElement>(html`
      <div>
        <aria-defaults-test></aria-defaults-test>
        <span id="external-label">External label</span>
      </div>
    `);
    const host = wrapper.querySelector(
      "aria-defaults-test"
    ) as AriaDefaultsTestElement;
    await host.updateComplete;
    const target = host.shadowRoot?.querySelector("input") as HTMLInputElement;
    return { wrapper, host, target };
  };

  it("batches host and root mutations into one controller sync", async () => {
    const { host, target } = await create();
    host.setAttribute("aria-labelledby", "external-label");
    await tick();
    let syncs = 0;
    const originalSync = host.forwarding.sync.bind(host.forwarding);
    host.forwarding.sync = () => {
      syncs += 1;
      originalSync();
    };

    host.setAttribute("aria-label", "First label");
    host.setAttribute("aria-label", "Final label");
    host.parentElement?.append(document.createElement("span"));
    await tick();

    expect(syncs).to.equal(1);
    expect(target.getAttribute("aria-label")).to.equal("Final label");
  });

  it("cancels queued observer syncs when disconnected", async () => {
    const { host } = await create();
    await tick();
    let syncs = 0;
    const originalSync = host.forwarding.sync.bind(host.forwarding);
    host.forwarding.sync = () => {
      syncs += 1;
      originalSync();
    };

    host.setAttribute("aria-label", "Queued label");
    queueMicrotask(() => host.remove());
    await tick();

    expect(syncs).to.equal(0);
  });

  it("restores updated defaults when host overrides are removed", async () => {
    const { wrapper, host, target } = await create();
    expect(target.getAttribute("aria-label")).to.equal("Default label");
    expect(target.getAttribute("aria-description")).to.equal(
      "Default description"
    );
    expect(target.getAttribute("aria-labelledby")).to.equal("local-label");

    host.setAttribute("aria-label", "Host label");
    host.setAttribute("aria-description", "Host description");
    host.setAttribute("aria-labelledby", "external-label");
    await tick();
    expect(target.getAttribute("aria-label")).to.equal("Host label");
    expect(target.getAttribute("aria-description")).to.equal(
      "Host description"
    );
    if ("ariaLabelledByElements" in target) {
      expect(target.ariaLabelledByElements).to.deep.equal([
        wrapper.querySelector("#external-label"),
      ]);
    } else {
      expect(
        host.shadowRoot?.getElementById("ecc-ref-aria-labelledby-0")
          ?.textContent
      ).to.equal("External label");
    }
    host.defaultLabel = "Updated label";
    host.defaultDescription = "Updated description";
    host.defaultReference = "updated-local-label";
    await host.updateComplete;
    expect(target.getAttribute("aria-label")).to.equal("Host label");
    expect(target.getAttribute("aria-description")).to.equal(
      "Host description"
    );
    expect(target.getAttribute("aria-labelledby")).to.not.equal(
      "updated-local-label"
    );

    host.removeAttribute("aria-labelledby");
    await tick();
    expect(target.getAttribute("aria-labelledby")).to.equal(
      "updated-local-label"
    );
    expect(target.getAttribute("aria-label")).to.equal("Host label");
    host.removeAttribute("aria-label");
    host.removeAttribute("aria-description");
    await tick();
    expect(target.getAttribute("aria-label")).to.equal("Updated label");
    expect(target.getAttribute("aria-description")).to.equal(
      "Updated description"
    );
    expect(target.getAttribute("aria-labelledby")).to.equal(
      "updated-local-label"
    );
  });
});

const referencedText = (
  target: Element,
  attribute: string,
  property: keyof ReferenceTarget
) => {
  const directReferences = (target as ReferenceTarget)[property];
  if (directReferences) {
    return directReferences.map((element) => element.textContent).join(" ");
  }

  const root = target.getRootNode();
  if (!(root instanceof ShadowRoot)) return "";
  return (target.getAttribute(attribute) ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => root.getElementById(id)?.textContent ?? "")
    .join(" ");
};

components.forEach(({ tag, inner, native }) => {
  describe(`${tag} attribute forwarding`, () => {
    const create = async (attrs = "") => {
      const el = await fixture<HTMLElement>(`<${tag} ${attrs}></${tag}>`);
      return { el, target: el.shadowRoot?.querySelector(inner) as Element };
    };

    it("forwards aria-* attributes to the inner control", async () => {
      const { target } = await create(
        'aria-invalid="true" aria-label="Name" aria-required="true"'
      );
      expect(target.getAttribute("aria-invalid")).to.equal("true");
      expect(target.getAttribute("aria-label")).to.equal("Name");
      expect(target.getAttribute("aria-required")).to.equal("true");
    });

    it("combines the consumer description with the built-in error reference", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag} aria-describedby="consumer-description"></${tag}>
          <p id="consumer-description">Extra details</p>
        </div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement;
      host.error = "Invalid value";
      await host.updateComplete;
      const target = host.shadowRoot?.querySelector(inner) as Element;
      const error = host.shadowRoot?.getElementById("error");
      const description = wrapper.querySelector("#consumer-description");

      if ("ariaDescribedByElements" in target) {
        expect(Reflect.get(target, "ariaDescribedByElements")).to.deep.equal([
          error,
          description,
        ]);
      }
      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.include("Invalid value");
      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.include("Extra details");
    });

    it("treats aria-invalid, invalid, and error as additive signals", async () => {
      const { el, target } = await create('aria-invalid="false"');
      const host = el as HTMLElement & {
        invalid: boolean;
        error: string;
        updateComplete: Promise<unknown>;
      };

      host.invalid = true;
      await host.updateComplete;
      expect(target.getAttribute("aria-invalid")).to.equal("true");

      host.invalid = false;
      host.error = "Invalid value";
      await host.updateComplete;
      expect(target.getAttribute("aria-invalid")).to.equal("true");

      host.error = "";
      await host.updateComplete;
      expect(target.getAttribute("aria-invalid")).to.equal("false");

      host.invalid = true;
      host.setAttribute("aria-invalid", "false");
      await host.updateComplete;
      expect(target.getAttribute("aria-invalid")).to.equal("true");
    });

    it("exposes external elements as accessible label and description", async function check() {
      // Accessibility snapshots only reflect the real tree in Chromium.
      if (!navigator.userAgent.includes("Chrome")) this.skip();
      const wrapper = await fixture<HTMLElement>(
        `<div>
           <span id="lbl">Full name</span>
           <${tag} aria-labelledby="lbl" aria-describedby="err"></${tag}>
           <p id="err">Name is required</p>
         </div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement & {
        error: string;
        updateComplete: Promise<unknown>;
      };
      (host.shadowRoot?.querySelector(inner) as HTMLElement).focus();

      const snapshot = await executeServerCommand<
        AxNode,
        { selector?: string }
      >("a11y-snapshot", {});
      const node = findFocused(snapshot);
      expect(node?.name).to.equal("Full name");
      expect(node?.description).to.equal("Name is required");
    });

    it("updates and removes forwarded attributes", async () => {
      const { el, target } = await create('aria-invalid="true"');
      el.setAttribute("aria-invalid", "false");
      await tick();
      expect(target.getAttribute("aria-invalid")).to.equal("false");
      el.removeAttribute("aria-invalid");
      await tick();
      expect(target.hasAttribute("aria-invalid")).to.equal(false);
    });

    it("syncs attributes changed while detached after reconnecting", async () => {
      const { el, target } = await create(
        'aria-invalid="true" name="before-detach"'
      );
      el.remove();
      el.setAttribute("aria-invalid", "false");
      el.setAttribute("name", "after-detach");
      document.body.append(el);
      await (el as HTMLElement & { updateComplete: Promise<unknown> })
        .updateComplete;

      expect(target.getAttribute("aria-invalid")).to.equal("false");
      expect(target.getAttribute("name")).to.equal("after-detach");
    });

    it("clears references removed while detached after reconnecting", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag} aria-describedby="detached-hint"></${tag}>
          <p id="detached-hint">Original hint</p>
        </div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement;
      const target = host.shadowRoot?.querySelector(inner) as Element;

      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("Original hint");
      host.remove();
      host.removeAttribute("aria-describedby");
      wrapper.append(host);
      await tick();

      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("");
    });

    it("resolves references inserted and replaced after rendering", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div><${tag} aria-describedby="error"></${tag}></div>`
      );
      const el = wrapper.querySelector(tag) as HTMLElement;
      const target = el.shadowRoot?.querySelector(inner) as Element;
      const initialError = document.createElement("p");
      initialError.id = "error";
      initialError.textContent = "Initial error";
      wrapper.append(initialError);
      await tick();
      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("Initial error");

      const replacementError = document.createElement("p");
      replacementError.id = "error";
      replacementError.textContent = "Replacement error";
      initialError.replaceWith(replacementError);
      await tick();
      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("Replacement error");
    });

    it("keeps pending reference changes when another control disconnects", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag} aria-describedby="first-hint"></${tag}>
          <${tag} aria-describedby="second-hint"></${tag}>
          <p id="first-hint">First hint</p>
        </div>`
      );
      const hosts = wrapper.querySelectorAll(tag);
      const target = hosts[1].shadowRoot?.querySelector(inner) as Element;
      await tick();
      const secondHint = document.createElement("p");
      secondHint.id = "second-hint";
      secondHint.textContent = "Second hint";
      wrapper.append(secondHint);
      hosts[0].remove();
      await tick();

      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("Second hint");
    });

    it("resolves aria-errormessage as an element reference", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag} aria-errormessage="error"></${tag}>
          <p id="error">Name is required</p>
        </div>`
      );
      const el = wrapper.querySelector(tag) as HTMLElement;
      const target = el.shadowRoot?.querySelector(inner) as Element;

      expect(
        referencedText(target, "aria-errormessage", "ariaErrorMessageElements")
      ).to.equal("Name is required");
      expect(target.getAttribute("aria-errormessage")).to.not.equal("error");
    });

    it.only("mirrors accessible text from non-text sources in the fallback", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag}></${tag}>
          <span id="fallback-label" aria-label="Account name"></span>
          <span id="fallback-description"><img alt="Required field"></span>
        </div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement & {
        error: string;
        updateComplete: Promise<unknown>;
      };
      const target = host.shadowRoot?.querySelector(inner) as Element;
      const properties = ["ariaLabelledByElements", "ariaDescribedByElements"];
      const descriptors = properties.map((property) => {
        let prototype = Object.getPrototypeOf(target);
        while (
          prototype &&
          !Object.prototype.hasOwnProperty.call(prototype, property)
        ) {
          prototype = Object.getPrototypeOf(prototype);
        }
        const descriptor =
          prototype && Object.getOwnPropertyDescriptor(prototype, property);
        if (descriptor) Reflect.deleteProperty(prototype, property);
        return { prototype, property, descriptor };
      });

      try {
        host.error = "Built-in error";
        await host.updateComplete;
        host.setAttribute("aria-labelledby", "fallback-label");
        host.setAttribute("aria-describedby", "fallback-description");
        await tick();
        const label = host.shadowRoot?.querySelector(
          '[id^="ecc-ref-aria-labelledby-"]'
        );
        const descriptions = host.shadowRoot?.querySelectorAll(
          '[id^="ecc-ref-aria-describedby-"]'
        );
        expect(label?.textContent).to.equal("Account name");
        expect(
          Array.from(descriptions ?? [])
            .map((node) => node.textContent)
            .join(" ")
        ).to.equal("Built-in error Required field");

        if (navigator.userAgent.includes("Chrome")) {
          (target as HTMLElement).focus();
          const snapshot = await executeServerCommand<
            AxNode,
            { selector?: string }
          >("a11y-snapshot", {});
          const node = findFocused(snapshot);
          expect(node?.name).to.equal("Account name");
          expect(node?.description).to.equal("Built-in error Required field");
        }

        wrapper
          .querySelector("#fallback-label")
          ?.setAttribute("aria-label", "Username");
        wrapper.querySelector("img")?.setAttribute("alt", "Mandatory");
        await tick();
        expect(label?.textContent).to.equal("Username");
        expect(
          Array.from(descriptions ?? [])
            .map((node) => node.textContent)
            .join(" ")
        ).to.equal("Built-in error Mandatory");

        host.removeAttribute("aria-describedby");
        await tick();
        expect(target.getAttribute("aria-describedby")).to.equal("error");
        expect(
          referencedText(
            target,
            "aria-describedby",
            "ariaDescribedByElements"
          ).trim()
        ).to.equal("Built-in error");
        expect(
          Array.from(descriptions ?? []).every((node) => !node.isConnected)
        ).to.equal(true);

        host.error = "";
        await host.updateComplete;

        host.remove();
        host.removeAttribute("aria-labelledby");
        host.removeAttribute("aria-describedby");
        wrapper.append(host);
        await tick();
        expect(target.hasAttribute("aria-labelledby")).to.equal(false);
        expect(target.hasAttribute("aria-describedby")).to.equal(false);
        expect(label?.isConnected).to.equal(false);
        expect(
          Array.from(descriptions ?? []).every((node) => !node.isConnected)
        ).to.equal(true);
      } finally {
        descriptors.forEach(({ prototype, property, descriptor }) => {
          if (descriptor)
            Object.defineProperty(prototype, property, descriptor);
        });
      }
    });

    it("does not forward unresolved ARIA relationships across the shadow root", async () => {
      // we only want to forward text based references
      const relationships = [
        ["aria-activedescendant", "ariaActiveDescendantElement", false],
        ["aria-controls", "ariaControlsElements", true],
        ["aria-details", "ariaDetailsElements", true],
        ["aria-flowto", "ariaFlowToElements", true],
        ["aria-owns", "ariaOwnsElements", true],
      ] as const;
      const attributes = relationships
        .map(([attribute]) => `${attribute}="related"`)
        .join(" ");
      const wrapper = await fixture<HTMLElement>(
        `<div><${tag} ${attributes}></${tag}></div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement;
      const target = host.shadowRoot?.querySelector(inner) as Element;
      const related = document.createElement("div");
      related.id = "related";
      wrapper.append(related);
      await tick();

      relationships.forEach(([attribute, property, multiple]) => {
        expect(target.getAttribute(attribute), attribute).to.not.equal(
          "related"
        );
        if (property in target) {
          const value = Reflect.get(target, property);
          expect(
            multiple ? Array.from(value as readonly Element[]) : value,
            property
          ).to.deep.equal(multiple ? [related] : related);
        } else {
          expect(target.hasAttribute(attribute), attribute).to.equal(false);
        }
      });

      related.remove();
      await tick();
      relationships.forEach(([attribute, property, multiple]) => {
        expect(target.getAttribute(attribute), attribute).to.not.equal(
          "related"
        );
        if (property in target) {
          const value = Reflect.get(target, property);
          expect(
            multiple ? Array.from(value as readonly Element[]) : value,
            property
          ).to.deep.equal(multiple ? [] : null);
        }
      });
    });

    it("clears native description references while other references remain", async () => {
      const wrapper = await fixture<HTMLElement>(
        `<div>
          <${tag} aria-describedby="hint" aria-labelledby="name"></${tag}>
          <p id="hint">Helpful text</p>
          <span id="name">Field name</span>
        </div>`
      );
      const host = wrapper.querySelector(tag) as HTMLElement;
      const target = host.shadowRoot?.querySelector(inner) as Element;

      if ("ariaDescribedByElements" in target) {
        expect(Reflect.get(target, "ariaDescribedByElements")).to.deep.equal([
          wrapper.querySelector("#hint"),
        ]);
      }
      host.removeAttribute("aria-describedby");
      await tick();

      if ("ariaDescribedByElements" in target) {
        expect(
          Reflect.get(target, "ariaDescribedByElements") ?? []
        ).to.deep.equal([]);
      }
      expect(
        referencedText(target, "aria-describedby", "ariaDescribedByElements")
      ).to.equal("");
      expect(host.getAttribute("aria-labelledby")).to.equal("name");
    });

    it("forwards allow-listed native attributes but not others", async () => {
      const attrs = Object.entries(native)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      const { target } = await create(
        `${attrs} required id="host-id" class="host-only"`
      );
      Object.entries(native).forEach(([k, v]) => {
        expect(target.getAttribute(k)).to.equal(v);
      });
      expect(target.hasAttribute("required")).to.equal(true);
      expect(target.hasAttribute("id")).to.equal(false);
      expect(target.className).to.not.contain("host-only");
    });
  });
});
