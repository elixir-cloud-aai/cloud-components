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
const pendingSyncs = new Set<ForwardingController>();
let syncScheduled = false;

function scheduleSync(controller: ForwardingController) {
  pendingSyncs.add(controller);
  if (syncScheduled) return;
  syncScheduled = true;
  queueMicrotask(() => {
    syncScheduled = false;
    const controllers = [...pendingSyncs];
    controllers.forEach((currentController) => {
      if (pendingSyncs.delete(currentController)) currentController.sync();
    });
  });
}

function setsEqual<T>(left: Set<T>, right: Set<T>) {
  return (
    left.size === right.size && [...left].every((value) => right.has(value))
  );
}

function getAccessibleNameDependencies(references: Element[]) {
  const dependencies = new Set<Element>();
  const visited = new Set<Element>();

  function visit(reference: Element) {
    if (visited.has(reference)) return;
    visited.add(reference);

    const root = reference.getRootNode();
    if (!(root instanceof Document) && !(root instanceof ShadowRoot)) return;

    (reference.getAttribute("aria-labelledby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((id) => {
        const dependency = root.getElementById(id);
        if (!dependency) return;
        dependencies.add(dependency);
        visit(dependency);
      });
  }

  references.forEach(visit);
  return [...dependencies];
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
    state.controllers.forEach(scheduleSync);
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
        controllers.forEach(scheduleSync);
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

  private ariaDefaults = new Map<string, string | null>();

  private ariaTarget?: Element;

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
    this.observer = new MutationObserver(() => scheduleSync(this));
    this.observer.observe(this.host, { attributes: true });
    this.sync();
  }

  hostDisconnected() {
    this.observer?.disconnect();
    pendingSyncs.delete(this);
    if (this.referenceRoot) {
      unregisterController(this.referenceRoot, this);
      this.referenceRoot = undefined;
    }
  }

  hostUpdate() {
    const target = this.ariaTarget;
    if (!target) return;
    this.ariaDefaults.forEach((value, name) => {
      if (value === null) target.removeAttribute(name);
      else target.setAttribute(name, value);
    });
    this.ariaDefaults.clear();
  }

  hostUpdated() {
    this.sync();
  }

  sync() {
    pendingSyncs.delete(this);
    const target = this.host.shadowRoot?.querySelector(this.selector);
    if (!target) return;
    if (this.ariaTarget !== target) {
      this.ariaDefaults.clear();
      this.ariaTarget = target;
    }
    this.ariaDefaults.forEach((value, name) => {
      if (this.host.hasAttribute(name)) return;
      if (value === null) target.removeAttribute(name);
      else target.setAttribute(name, value);
      this.ariaDefaults.delete(name);
    });
    const wanted = new Map<string, string>();
    Array.from(this.host.attributes).forEach((attr) => {
      if (attr.name.startsWith("aria-") && !this.ariaDefaults.has(attr.name)) {
        this.ariaDefaults.set(attr.name, target.getAttribute(attr.name));
      }
      if (this.isForwarded(attr.name)) {
        const isInvalid =
          attr.name === "aria-invalid" &&
          (attr.value === "true" ||
            this.ariaDefaults.get("aria-invalid") === "true");
        wanted.set(attr.name, isInvalid ? "true" : attr.value);
      }
    });
    // remove stale attributes
    Array.from(target.attributes).forEach((attr) => {
      if (
        !attr.name.startsWith("aria-") &&
        this.isForwarded(attr.name) &&
        !wanted.has(attr.name)
      ) {
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
      const value = this.host.getAttribute(attr);
      if (value === null) {
        if (prop in target) {
          const defaultValue = target.getAttribute(attr);
          const defaultRefs = (defaultValue ?? "")
            .split(/\s+/)
            .filter(Boolean)
            .map((id) => shadow.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);
          Reflect.set(
            target,
            prop,
            attr === "aria-activedescendant"
              ? defaultRefs[0] ?? null
              : defaultRefs
          );
          if (defaultValue !== null) target.setAttribute(attr, defaultValue);
        }
        shadow.querySelectorAll(`[id^="ecc-ref-${attr}-"]`).forEach((node) => {
          node.remove();
        });
        return;
      }
      const defaultIds =
        attr === "aria-describedby"
          ? (this.ariaDefaults.get(attr) ?? "").split(/\s+/).filter(Boolean)
          : [];
      const defaultRefs = defaultIds
        .map((id) => shadow.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      const hostRefs = value
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => root.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      const refs = [...new Set([...defaultRefs, ...hostRefs])];
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

      references.push(...getAccessibleNameDependencies(refs));

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
        const probe = this.host.ownerDocument.createElement("input");
        const referenceRoot = ref.getRootNode();
        Object.defineProperty(probe, "getRootNode", {
          value: () => referenceRoot,
        });
        probe.setAttribute("aria-labelledby", ref.id);
        node.textContent = computeAccessibleName(
          ref.hasAttribute("aria-labelledby") ? ref : probe
        );
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
