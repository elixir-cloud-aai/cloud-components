// eslint-disable-next-line import/no-extraneous-dependencies
import { fixture, expect } from "@open-wc/testing";
// eslint-disable-next-line import/no-extraneous-dependencies
import { executeServerCommand } from "@web/test-runner-commands";
import "./index.js";
import "../textarea/index.js";

type AxNode = {
  focused?: boolean;
  name?: string;
  description?: string;
  children?: AxNode[];
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
      const host = wrapper.querySelector(tag) as HTMLElement;
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
