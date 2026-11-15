import type { ReactiveController, ReactiveControllerHost } from "lit";
import { computeAccessibleName } from "dom-accessibility-api";

type Host = ReactiveControllerHost & HTMLElement;
type ReferenceRoot = Document | ShadowRoot;
type ForwardingController = { sync: () => void };

type RootState = {
  observer: MutationObserver;
  controllers: Set<ForwardingController>;
  references: Map<Element, Set<ForwardingController>>;
  controllerReferences: Map<ForwardingController, Set<Element>>;
};

const rootStates = new WeakMap<ReferenceRoot, RootState>();

function setsEqual<T>(left: Set<T>, right: Set<T>) {
  return (
    left.size === right.size && [...left].every((value) => right.has(value))
  );
}

function observeRoot(state: RootState, root: ReferenceRoot) {
  const pending = state.observer.takeRecords().length > 0;
  state.observer.disconnect();
  state.observer.observe(root, {
    attributes: true,
    attributeFilter: ["id"],
    childList: true,
    subtree: true,
  });
  state.references.forEach((_, reference) => {
    state.observer.observe(reference, {
      attributes: true,
      characterData: true,
      subtree: true,
    });
  });
  if (pending) {
    queueMicrotask(() => {
      state.controllers.forEach((controller) => controller.sync());
    });
  }
}

function registerController(
  root: ReferenceRoot,
  controller: ForwardingController
) {
  let state = rootStates.get(root);
  if (!state) {
    const controllers = new Set<ForwardingController>();
    const references = new Map<Element, Set<ForwardingController>>();
    const controllerReferences = new Map<ForwardingController, Set<Element>>();
    state = {
      observer: new MutationObserver(() => {
        controllers.forEach((currentController) => currentController.sync());
      }),
      controllers,
      references,
      controllerReferences,
    };
    rootStates.set(root, state);
    observeRoot(state, root);
  }
  state.controllers.add(controller);
}

function unregisterController(
  root: ReferenceRoot,
  controller: ForwardingController
) {
  const state = rootStates.get(root);
  if (!state) return;

  state.controllers.delete(controller);
  const references = state.controllerReferences.get(controller);
  references?.forEach((reference) => {
    const controllers = state?.references.get(reference);
    controllers?.delete(controller);
    if (controllers?.size === 0) state?.references.delete(reference);
  });
  state.controllerReferences.delete(controller);

  if (state.controllers.size === 0) {
    state.observer.disconnect();
    rootStates.delete(root);
  } else {
    observeRoot(state, root);
  }
}

function updateControllerReferences(
  root: ReferenceRoot,
  controller: ForwardingController,
  references: Element[]
) {
  const state = rootStates.get(root);
  if (!state) return;

  const previousReferences =
    state.controllerReferences.get(controller) ?? new Set<Element>();
  const nextReferences = new Set(references);
  if (setsEqual(previousReferences, nextReferences)) {
    return;
  }

  // removing all referenced controllers
  previousReferences.forEach((reference) => {
    const controllers = state.references.get(reference);
    controllers?.delete(controller);
    if (controllers?.size === 0) state.references.delete(reference);
  });

  state.controllerReferences.set(controller, nextReferences);

  // add non-stale and new references
  nextReferences.forEach((reference) => {
    let controllers = state.references.get(reference);
    if (!controllers) {
      controllers = new Set();
      state.references.set(reference, controllers);
    }
    controllers.add(controller);
  });
  observeRoot(state, root);
}

// ID references can't cross the shadow boundary, so they are resolved separately.
const IDREFS: Record<string, string> = {
  "aria-activedescendant": "ariaActiveDescendantElement",
  "aria-controls": "ariaControlsElements",
  "aria-describedby": "ariaDescribedByElements",
  "aria-details": "ariaDetailsElements",
  "aria-errormessage": "ariaErrorMessageElements",
  "aria-flowto": "ariaFlowToElements",
  "aria-labelledby": "ariaLabelledByElements",
  "aria-owns": "ariaOwnsElements",
};

const TEXT_IDREFS = new Set([
  "aria-describedby",
  "aria-errormessage",
  "aria-labelledby",
]);

export class AttrForwardingController implements ReactiveController {
  private host: Host;

  private selector: string;

  private extra: Set<string>;

  private observer?: MutationObserver;

  private referenceRoot?: ReferenceRoot;

  private hasSyncedReferences = false;

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
    this.sync();
  }

  hostDisconnected() {
    this.observer?.disconnect();
    if (this.referenceRoot) {
      unregisterController(this.referenceRoot, this);
      this.referenceRoot = undefined;
    }
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
    const root = this.host.getRootNode();

    if (!(root instanceof Document) && !(root instanceof ShadowRoot)) {
      if (this.referenceRoot) {
        unregisterController(this.referenceRoot, this);
        this.referenceRoot = undefined;
      }
      return;
    }

    const shadow = this.host.shadowRoot;
    if (!shadow) return;

    const hasReferences = Object.keys(IDREFS).some((attribute) =>
      this.host.hasAttribute(attribute)
    );
    if (!hasReferences) {
      if (!this.hasSyncedReferences) return;
      if (this.referenceRoot) unregisterController(this.referenceRoot, this);
      this.referenceRoot = undefined;
    }

    if (hasReferences && this.referenceRoot !== root) {
      if (this.referenceRoot) unregisterController(this.referenceRoot, this);
      registerController(root, this);
      this.referenceRoot = root;
    }

    const references: Element[] = [];

    Object.entries(IDREFS).forEach(([attr, prop]) => {
      const refs = (this.host.getAttribute(attr) ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => root.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      references.push(...refs);

      if (prop in target) {
        Reflect.set(
          target,
          prop,
          attr === "aria-activedescendant" ? refs[0] ?? null : refs
        );
        return;
      }

      if (!TEXT_IDREFS.has(attr)) {
        target.removeAttribute(attr);
        return;
      }

      const probe = this.host.ownerDocument.createElement("input");
      Object.defineProperty(probe, "getRootNode", { value: () => root });
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
        probe.setAttribute("aria-labelledby", ref.id);
        node.textContent = computeAccessibleName(probe);
        return id;
      });
      shadow.querySelectorAll(`[id^="ecc-ref-${attr}-"]`).forEach((n) => {
        if (!ids.includes(n.id)) n.remove();
      });
      if (ids.length) target.setAttribute(attr, ids.join(" "));
      else target.removeAttribute(attr);
    });

    this.hasSyncedReferences = hasReferences;
    if (hasReferences) updateControllerReferences(root, this, references);
  }
}
