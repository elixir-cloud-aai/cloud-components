/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

// parentElement should not be optional as that is allowing false positive tests
import "../../../../dist/index.js";
import { fixture, html } from "@open-wc/testing";
import EccUtilsDesignForm, { Field } from "../index.js";
import {} from "@web/test-runner";

type methodOptions = {
  retrieveAll?: boolean;
  parentElement?: ParentElement;
  root: boolean;
};

type ParentElement = Document | Element | ShadowRoot;
export type FormComponentType = FormComponent;

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

  private getFieldsThatCouldBeMultiple = (
    id: string,
    parentElement: ParentElement = this.form.shadowRoot!,
    retrieveAll = false
  ) => {
    if (retrieveAll) {
      return parentElement.querySelectorAll(`[data-testid="${id}"]`);
    }
    return parentElement.querySelector(`[data-testid="${id}"]`);
  };

  // The implementation of so many overloads is to make the actual tests much cleaner and improve certainty and readability
  // locators

  // use objects to make sure the an actual element is sent when the correct overload is used
  inputField(): HTMLInputElement;
  inputField(retrieveAll: true): NodeListOf<HTMLInputElement>;
  inputField(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLInputElement;

  inputField(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLInputElement>;

  inputField(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-input",
      parentElement,
      retrieveAll
    );
  }

  inputFileField(): HTMLInputElement;
  inputFileField(retrieveAll: true): NodeListOf<HTMLInputElement>;
  inputFileField(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLInputElement;

  inputFileField(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLInputElement>;

  inputFileField(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-input-file",
      parentElement,
      retrieveAll
    );
  }

  switchField(): HTMLInputElement;
  switchField(retrieveAll: true): NodeListOf<HTMLInputElement>;
  switchField(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLInputElement;

  switchField(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLSelectElement>;

  switchField(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-switch",
      parentElement,
      retrieveAll
    );
  }

  arrayAddButton(): HTMLButtonElement;
  arrayAddButton(retrieveAll: true): NodeListOf<HTMLButtonElement>;
  arrayAddButton(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLButtonElement;

  arrayAddButton(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLButtonElement>;

  arrayAddButton(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-array-add",
      parentElement,
      retrieveAll
    );
  }

  arrayDeleteButton(): HTMLButtonElement;
  arrayDeleteButton(retrieveAll: true): NodeListOf<HTMLButtonElement>;
  arrayDeleteButton(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLButtonElement;

  arrayDeleteButton(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLButtonElement>;

  arrayDeleteButton(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-array-delete",
      parentElement,
      retrieveAll
    );
  }

  arrayItem(): HTMLElement;
  arrayItem(retrieveAll: true): NodeListOf<HTMLElement>;
  arrayItem(retrieveAll: false, parentElement: ParentElement): HTMLElement;
  arrayItem(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  arrayItem(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-array-item",
      parentElement,
      retrieveAll
    );
  }

  arrayTemplate(): HTMLElement;
  arrayTemplate(retrieveAll: true): NodeListOf<HTMLElement>;
  arrayTemplate(retrieveAll: false, parentElement: ParentElement): HTMLElement;
  arrayTemplate(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  arrayTemplate(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-array",
      parentElement,
      retrieveAll
    );
  }

  groupTemplate(): HTMLElement;
  groupTemplate(retrieveAll: true): NodeListOf<HTMLElement>;
  groupTemplate(retrieveAll: false, parentElement: ParentElement): HTMLElement;
  groupTemplate(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  groupTemplate(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-group",
      parentElement,
      retrieveAll
    );
  }

  groupItem(): HTMLElement;
  groupItem(retrieveAll: true): NodeListOf<HTMLElement>;
  groupItem(retrieveAll: false, parentElement: ParentElement): HTMLElement;
  groupItem(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  groupItem(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-group-item",
      parentElement,
      retrieveAll
    );
  }

  collapsibleGroup(): HTMLElement;
  collapsibleGroup(retrieveAll: true): NodeListOf<HTMLElement>;
  collapsibleGroup(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLElement;

  collapsibleGroup(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  collapsibleGroup(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-group-collapsible",
      parentElement,
      retrieveAll
    );
  }

  nonCollapsibleGroup(): HTMLElement;
  nonCollapsibleGroup(retrieveAll: true): NodeListOf<HTMLElement>;
  nonCollapsibleGroup(
    retrieveAll: false,
    parentElement: ParentElement
  ): HTMLElement;

  nonCollapsibleGroup(
    retrieveAll: true,
    parentElement: ParentElement
  ): NodeListOf<HTMLElement>;

  nonCollapsibleGroup(retrieveAll = false, parentElement?: ParentElement) {
    return this.getFieldsThatCouldBeMultiple(
      "form-group-non-collapsible",
      parentElement,
      retrieveAll
    );
  }

  submitButton = (): HTMLButtonElement =>
    this.form.shadowRoot?.querySelector('[data-testid="form-submit"]')!;

  errorTemplate = () =>
    this.form.shadowRoot?.querySelector('[data-testid="form-error"]')!;

  successTemplate = () =>
    this.form.shadowRoot?.querySelector('[data-testid="form-success"]')!;

  innerForm = () =>
    this.form.shadowRoot?.querySelector('[data-testid="form"]')!;

  // actions
  public clickSubmitButton() {
    this.clickButton(this.submitButton());
  }

  public clickButton(button: HTMLButtonElement, numberOfClicks = 1) {
    for (let i = 0; i < numberOfClicks; i++) button.click();
  }

  public fillInputField(
    parentElement: ParentElement,
    value = "test value",
    fieldIndex?: number
  ) {
    if (fieldIndex) {
      const input = this.inputField(true);
      input[fieldIndex].value = value;
    } else {
      const input = this.inputField(false, parentElement);
      input.value = value;
    }
  }
}

export default async function createNewFormComponent(fields: Field[]) {
  const formComponent = new FormComponent();
  // any other call of initializeForm will reinitialize with new fields;
  await formComponent.initializeForm(fields);
  return formComponent;
}
