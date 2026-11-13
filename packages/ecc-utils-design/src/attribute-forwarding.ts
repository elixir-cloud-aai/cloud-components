import type { ReactiveController, ReactiveControllerHost } from "lit";

type Host = ReactiveControllerHost & HTMLElement;

// ID references can't cross the shadow boundary, so they are resolved separately.
const IDREFS: Record<string, string> = {
  "aria-describedby": "ariaDescribedByElements",
  "aria-labelledby": "ariaLabelledByElements",
};

export class AttrForwardingController implements ReactiveController {
  private host: Host;

  private selector: string;

  private extra: Set<string>;

  private observer?: MutationObserver;

  private refObserver = new MutationObserver(() => this.sync());

  constructor(host: Host, selector: string, attributes: string[] = []) {
    this.host = host;
    this.selector = selector;
    this.extra = new Set(attributes);
    host.addController(this);
  }

  private isForwarded(name: string) {
    return (
      !(name in IDREFS) && (name.startsWith("aria-") || this.extra.has(name))
    );
  }

  hostConnected() {
    this.observer = new MutationObserver(() => this.sync());
    this.observer.observe(this.host, { attributes: true });
  }

  hostDisconnected() {
    this.observer?.disconnect();
    this.refObserver.disconnect();
  }

  hostUpdated() {
    this.sync();
  }

  sync() {
    const target = this.host.shadowRoot?.querySelector(this.selector);
    if (!target) return;
    const wanted = new Map<string, string>();
    // collect and store the attributes
    Array.from(this.host.attributes).forEach((attr) => {
      if (this.isForwarded(attr.name)) wanted.set(attr.name, attr.value);
    });
    // remove stale sttributes
    Array.from(target.attributes).forEach((attr) => {
      if (this.isForwarded(attr.name) && !wanted.has(attr.name)) {
        target.removeAttribute(attr.name);
      }
    });
    // forward stored attributes to the target
    wanted.forEach((value, name) => {
      if (target.getAttribute(name) !== value) target.setAttribute(name, value);
    });
    this.syncReferences(target);
  }

  private syncReferences(target: Element) {
    const root = this.host.getRootNode() as Document | ShadowRoot;
    const shadow = this.host.shadowRoot as ShadowRoot;

    // disconnect stale observers
    this.refObserver.disconnect();

    Object.entries(IDREFS).forEach(([attr, prop]) => {
      const refs = (this.host.getAttribute(attr) ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => root.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (prop in target) {
        Reflect.set(target, prop, refs.length ? refs : null);
        return;
      }

      // Fallback: mirror referenced text into shadow-local nodes.
      const ids = refs.map((ref, i) => {
        const id = `ecc-ref-${attr}-${i}`;
        let node = shadow.getElementById(id);
        if (!node) {
          node = document.createElement("span");
          node.id = id;
          node.hidden = true;
          shadow.append(node);
        }
        node.textContent = ref.textContent;
        this.refObserver.observe(ref, {
          characterData: true,
          childList: true,
          subtree: true,
        });
        return id;
      });
      shadow.querySelectorAll(`[id^="ecc-ref-${attr}-"]`).forEach((n) => {
        if (!ids.includes(n.id)) n.remove();
      });
      if (ids.length) target.setAttribute(attr, ids.join(" "));
      else target.removeAttribute(attr);
    });
  }
}
