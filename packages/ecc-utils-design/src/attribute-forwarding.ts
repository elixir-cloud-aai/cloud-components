import type { ReactiveController, ReactiveControllerHost } from "lit";

type Host = ReactiveControllerHost & HTMLElement;

export class AttrForwardingController implements ReactiveController {
  private host: Host;

  private selector: string;

  private extra: Set<string>;

  private observer?: MutationObserver;

  constructor(host: Host, selector: string, attributes: string[] = []) {
    this.host = host;
    this.selector = selector;
    this.extra = new Set(attributes);
    host.addController(this);
  }

  private isForwarded(name: string) {
    return name.startsWith("aria-") || this.extra.has(name);
  }

  hostConnected() {
    this.observer = new MutationObserver(() => this.sync());
    this.observer.observe(this.host, { attributes: true });
  }

  hostDisconnected() {
    this.observer?.disconnect();
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
  }
}
