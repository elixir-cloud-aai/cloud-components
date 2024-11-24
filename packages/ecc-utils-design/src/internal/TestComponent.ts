// eslint-disable-next-line max-classes-per-file
import { LitElement } from "lit";

type ParentElement = Document | Element | ShadowRoot;
type InstanceType = "litElement" | "element";
type ComponentType = LitElement | null;

export default class Field {
  component: ComponentType = null;
  instance: InstanceType;
  el: ParentElement;

  constructor(el: Element | LitElement, instance: InstanceType = "element") {
    this.instance = instance;

    if (instance === "litElement") {
      this.component = el as LitElement;
      this.el = el.shadowRoot!;
    } else {
      this.el = el;
    }
  }

  _getFields = (label?: string, id?: string, retrieveAll = false) => {
    if (!id && !label) return null;
    if (label && !id) {
      if (retrieveAll) {
        return this.el.querySelectorAll(`[data-label="${label}"]`);
      }
      return this.el.querySelector(`[data-label="${label}"]`);
    }

    if (!label && id) {
      if (retrieveAll) {
        return this.el.querySelectorAll(`[data-testid="${id}"]`);
      }
      return this.el.querySelector(`[data-testid="${id}"]`);
    }

    if (retrieveAll) {
      return this.el.querySelectorAll(
        `[data-testid="${id}"][data-label="${label}"]`
      );
    }
    return this.el.querySelector(
      `[data-testid="${id}"][data-label="${label}"]`
    );
  };

  setEl(el: Element) {
    if (this.instance === "litElement") {
      this.component = el as LitElement;
      this.el = el.shadowRoot!;
    } else {
      this.el = el;
    }
  }

  disable() {
    if (this.instance === "element") {
      (this.el as HTMLElement).setAttribute("disable", "");
    }
  }

  // locators
  getElement(label?: string, testId?: string): GenericElement;
  getElement(label?: string, testId?: string, all?: false): GenericElement;
  getElement(label?: string, testId?: string, all?: true): GenericElement[];
  getElement(label?: string, testId?: string, all = false) {
    const fields = this._getFields(label, testId, all) as
      | HTMLElement
      | NodeListOf<HTMLElement>;

    if (!fields) return null;
    if (fields instanceof NodeList) {
      return Array.from(fields).map((f) => new GenericElement(f));
    }

    return new GenericElement(fields);
  }

  getInputField(label?: string, testId?: string): InputField;
  getInputField(label?: string, testId?: string, all?: false): InputField;
  getInputField(label?: string, testId?: string, all?: true): InputField[];
  getInputField(label?: string, testId?: string, all = false) {
    const fields = this._getFields(label, testId, all) as
      | HTMLInputElement
      | NodeListOf<HTMLInputElement>;

    if (!fields) return null;
    if (fields instanceof NodeList) {
      return Array.from(fields).map((f) => new InputField(f));
    }

    return new InputField(fields);
  }

  getSelectField(label?: string, testId?: string): SelectField;
  getSelectField(label?: string, testId?: string, all?: false): SelectField;
  getSelectField(label?: string, testId?: string, all?: true): SelectField[];
  getSelectField(label?: string, testId?: string, all = false) {
    const fields = this._getFields(label, testId, all) as
      | HTMLSelectElement
      | NodeListOf<HTMLSelectElement>;

    if (!fields) return null;
    if (fields instanceof NodeList) {
      return Array.from(fields).map((f) => new SelectField(f));
    }

    return new SelectField(fields);
  }

  getButtonElement(label?: string, testId?: string): ButtonElement;
  getButtonElement(label?: string, testId?: string, all?: false): ButtonElement;
  getButtonElement(
    label?: string,
    testId?: string,
    all?: true
  ): ButtonElement[];

  getButtonElement(label?: string, testId?: string, all = false) {
    const fields = this._getFields(label, testId, all) as
      | HTMLButtonElement
      | NodeListOf<HTMLButtonElement>;

    if (!fields) return null;
    if (fields instanceof NodeList) {
      return Array.from(fields).map((f) => new ButtonElement(f));
    }

    return new ButtonElement(fields);
  }
}

export class InputField extends Field {
  el: HTMLInputElement;

  constructor(el: HTMLInputElement) {
    super(el);
    this.el = el;
  }

  /**
   * Fills an input file field with an optional specified file text.
   *
   * @param inputField - The input file field element to fill.
   * @param fileText - The text content of the file.
   * @note You do not need to await this method, you can await the form updateComplete as an alternative
   */
  public async fill(text = "test value") {
    if (this.el.getAttribute("disable")) return;

    // eslint-disable-next-line no-param-reassign
    this.el.value = text;
    this.el.dispatchEvent(new Event("sl-input"));

    await this.component?.updateComplete;
  }

  public async upload(dataText = "test value") {
    if (this.el.getAttribute("disable")) return;

    if (this.el.type !== "file") {
      throw new Error("this field is not a valid file element");
    }

    const files = [
      new File([dataText], "test-file.txt", { type: "text/plain" }),
    ];
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // eslint-disable-next-line no-param-reassign
    this.el.files = dataTransfer.files;
    this.el.dispatchEvent(new Event("change"));

    await this.component?.updateComplete;
  }

  public async toggle() {
    if (this.el.getAttribute("disable")) return;

    this.el.click();
    await this.component?.updateComplete;
  }
}

export class SelectField extends Field {
  el: HTMLSelectElement;

  constructor(el: HTMLSelectElement) {
    super(el);
    this.el = el;
  }

  public select = async (label: number | string) => {
    if (this.el.getAttribute("disable")) return;
    let option: HTMLOptionElement | null = null;

    if (typeof label === "string") {
      const children = Array.from(this.el.children);

      const el = children.find(
        (opt) => opt.textContent?.trim() === label
      ) as HTMLOptionElement;

      option = el || null;
    } else if (typeof label === "number") {
      option = this.el.children.item(label) as HTMLOptionElement;
    }

    if (option?.value) {
      this.el.value = option.value;
      this.el.dispatchEvent(new Event("sl-change"));
      this.el.dispatchEvent(new Event("sl-input"));
      await this.component?.updateComplete;
    }
  };
}

export class ButtonElement extends Field {
  el: HTMLButtonElement;

  constructor(el: HTMLButtonElement) {
    super(el);
    this.el = el;
  }

  public click = async (numberOfClicks = 1) => {
    if (this.el.getAttribute("disable")) return;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberOfClicks; i++) this.el.click();
    await this.component?.updateComplete;
  };
}

export class GenericElement extends Field {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    super(el);
    this.el = el;
  }
}

export const elementIsVisible = (element: HTMLElement) => {
  if (!element) return false;
  return element.offsetHeight > 0 && element.offsetWidth > 0;
};
