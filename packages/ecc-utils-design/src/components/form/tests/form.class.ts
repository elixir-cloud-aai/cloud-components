/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

// parentElement should not be optional as that is allowing false positive tests
import "../../../../dist/index.js";
import { fixture, html } from "@open-wc/testing";
import EccUtilsDesignForm, { Field } from "../index.js";

type ParentElement = Document | Element | ShadowRoot | "root";

class FormComponent {
  form: EccUtilsDesignForm = {} as EccUtilsDesignForm;
  fields: Field[] = [];

  public initializeForm = async (fields: Field[]) => {
    this.fields = fields;
    this.form = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form
        .fields="${this.fields}"
      ></ecc-utils-design-form>`
    );
  };

  private getFields = (
    id: string,
    parentElement: ParentElement,
    retrieveAll = false
  ) => {
    if (parentElement === "root") {
      // eslint-disable-next-line no-param-reassign
      parentElement = this.form.shadowRoot!;
    }
    if (retrieveAll) {
      return parentElement.querySelectorAll(`[data-testid="${id}"]`);
    }
    return parentElement.querySelector(`[data-testid="${id}"]`);
  };

  // The implementation of so many overloads is to make the actual tests much cleaner and improve certainty and readability

  // locators
  inputField(p: ParentElement): HTMLInputElement;
  inputField(p: ParentElement, all: true): NodeListOf<HTMLInputElement>;
  inputField(p: ParentElement, all: false): HTMLInputElement;
  inputField(p: ParentElement, all = false) {
    return this.getFields("form-input", p, all);
  }

  inputFileField(p: ParentElement): HTMLInputElement;
  inputFileField(p: ParentElement, all: true): NodeListOf<HTMLInputElement>;
  inputFileField(p: ParentElement, all: false): HTMLInputElement;
  inputFileField(p: ParentElement, all = false) {
    return this.getFields("form-input-file", p, all);
  }

  inputFileParent(p: ParentElement): HTMLElement;
  inputFileParent(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  inputFileParent(p: ParentElement, all: false): HTMLElement;
  inputFileParent(p: ParentElement, all = false) {
    return this.getFields("form-input-file-parent", p, all);
  }

  switchField(p: ParentElement): HTMLInputElement;
  switchField(p: ParentElement, all: true): NodeListOf<HTMLInputElement>;
  switchField(p: ParentElement, all: false): HTMLInputElement;
  switchField(p: ParentElement, all = false) {
    return this.getFields("form-switch", p, all);
  }

  switchParent(p: ParentElement): HTMLElement;
  switchParent(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  switchParent(p: ParentElement, all: false): HTMLElement;
  switchParent(p: ParentElement, all = false) {
    return this.getFields("form-switch-parent", p, all);
  }

  arrayAddButton(p: ParentElement): HTMLButtonElement;
  arrayAddButton(P: ParentElement, all: true): NodeListOf<HTMLButtonElement>;
  arrayAddButton(p: ParentElement, all: false): HTMLButtonElement;
  arrayAddButton(p: ParentElement, all = false) {
    return this.getFields("form-array-add", p, all);
  }

  arrayDeleteButton(p: ParentElement): HTMLButtonElement;
  arrayDeleteButton(p: ParentElement, all: true): NodeListOf<HTMLButtonElement>;
  arrayDeleteButton(p: ParentElement, all: false): HTMLButtonElement;
  arrayDeleteButton(p: ParentElement, all = false) {
    return this.getFields("form-array-delete", p, all);
  }

  arrayItem(p: ParentElement): HTMLElement;
  arrayItem(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  arrayItem(p: ParentElement, all: false): HTMLElement;
  arrayItem(p: ParentElement, all = false) {
    return this.getFields("form-array-item", p, all);
  }

  arrayTemplate(p: ParentElement): HTMLElement;
  arrayTemplate(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  arrayTemplate(p: ParentElement, all: false): HTMLElement;
  arrayTemplate(p: ParentElement, all = false) {
    return this.getFields("form-array", p, all);
  }

  groupTemplate(p: ParentElement): HTMLElement;
  groupTemplate(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  groupTemplate(p: ParentElement, all: false): HTMLElement;
  groupTemplate(p: ParentElement, all = false) {
    return this.getFields("form-group", p, all);
  }

  groupItem(p: ParentElement): HTMLElement;
  groupItem(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  groupItem(p: ParentElement, all: false): HTMLElement;
  groupItem(p: ParentElement, all = false) {
    return this.getFields("form-group-item", p, all);
  }

  collapsibleGroup(p: ParentElement): HTMLElement;
  collapsibleGroup(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  collapsibleGroup(p: ParentElement, all: false): HTMLElement;
  collapsibleGroup(p: ParentElement, all = false) {
    return this.getFields("form-group-collapsible", p, all);
  }

  nonCollapsibleGroup(p: ParentElement): HTMLElement;
  nonCollapsibleGroup(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  nonCollapsibleGroup(p: ParentElement, all: false): HTMLElement;
  nonCollapsibleGroup(p: ParentElement, all = false) {
    return this.getFields("form-group-non-collapsible", p, all);
  }

  tooltip(p: ParentElement): HTMLElement;
  tooltip(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  tooltip(p: ParentElement, all: false): HTMLElement;
  tooltip(p: ParentElement, all = false) {
    return this.getFields("form-tooltip", p, all);
  }

  label(p: ParentElement): HTMLElement;
  label(p: ParentElement, all: true): NodeListOf<HTMLElement>;
  label(p: ParentElement, all: false): HTMLElement;
  label(p: ParentElement, all = false) {
    return this.getFields("form-label", p, all);
  }

  formElement = () => this.getFields("form", "root") as HTMLFormElement;

  submitButton = () =>
    this.getFields("form-submit", "root") as HTMLButtonElement;

  errorTemplate = () => this.getFields("form-error", "root") as HTMLElement;

  successTemplate = () => this.getFields("form-success", "root") as HTMLElement;

  innerForm = () =>
    this.form.shadowRoot!.querySelector('[data-testid="form"]')!;

  // actions
  public clickSubmitButton() {
    clickButton(this.submitButton());
  }

  public async fillInputField(
    inputField = this.inputField("root"),
    text = "test value"
  ) {
    // eslint-disable-next-line no-param-reassign
    inputField.value = text;
    inputField.dispatchEvent(new Event("sl-input"));
    await this.form.updateComplete;
  }

  /**
   * Fills an input file field with an optional specified file text.
   *
   * @param inputField - The input file field element to fill.
   * @param fileText - The text content of the file.
   * @note You do not need to await this method, you can await the form updateComplete as an alternative
   */

  public async fillInputFileField(
    inputField = this.inputFileField("root"),
    fileText = "test value"
  ) {
    const files = [
      new File([fileText], "test-file.txt", { type: "text/plain" }),
    ];
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // eslint-disable-next-line no-param-reassign
    inputField.files = dataTransfer.files;
    inputField.dispatchEvent(new Event("change"));

    await this.form.updateComplete;
  }

  public async toggleSwitch(switchField = this.switchField("root")) {
    switchField.click();
    await this.form.updateComplete;
  }
}

export default async function createNewFormComponent(fields: Field[]) {
  const formComponent = new FormComponent();
  // any other call of initializeForm will reinitialize with new fields;
  await formComponent.initializeForm(fields);
  return formComponent;
}

export const clickButton = (button: HTMLButtonElement, numberOfClicks = 1) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numberOfClicks; i++) button.click();
};

export type FormComponentType = FormComponent;
