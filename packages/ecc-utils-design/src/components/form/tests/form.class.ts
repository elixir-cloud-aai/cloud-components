/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */

// parentElement should not be optional as that is allowing false positive tests
import { fixture, html } from "@open-wc/testing";
import EccUtilsDesignForm, {
  type Field,
} from "../../../../dist/components/form/index.js";
import TestComponent from "../../../internal/TestComponent.js";

class FormComponent extends TestComponent {
  form: EccUtilsDesignForm = {} as EccUtilsDesignForm;
  fields: Field[] = [];

  public initializeForm = async (fields: Field[]) => {
    this.fields = fields;
    this.component = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form
        .fields="${this.fields}"
      ></ecc-utils-design-form>`
    );

    // need to make the component available as more specific EccUtilsDesign type so we can access its methods for stubbing and spying, while maintaining type safety
    this.form = this.component as EccUtilsDesignForm;
  };

  formElement = () => this.element("form", "root");

  submitButton = () => this.buttonElement("form-submit", "root");

  errorTemplate = () => this.element("form-error", "root");

  successTemplate = () => this.element("form-success", "root");

  // actions
  public clickSubmitButton() {
    this.clickButton(this.submitButton());
  }
}

export default async function createNewFormComponent(fields: Field[]) {
  const formComponent = new FormComponent(new EccUtilsDesignForm());
  // any other call of initializeForm will reinitialize with new fields;
  await formComponent.initializeForm(fields);
  return formComponent;
}

export type FormComponentType = FormComponent;
export const testIds = {
  formInput: "form-input",
  formInputFile: "form-input-file",
  formInputParent: "form-input-file-parent",
  formSwitch: "form-switch",
  formSwitchParent: "form-switch-parent",
  formArrayAddButton: "form-array-add",
  formArrayDeleteButton: "form-array-delete",
  formArrayItem: "form-array-item",
  formArray: "form-array",
  formGroup: "form-group",
  formGroupItem: "form-group-item",
  formCollapsibleGroup: "form-group-collapsible",
  formNonCollapsibleGroup: "form-group-non-collapsible",
  formTooltip: "form-tooltip",
  formSelect: "form-select",
  formSelectOption: "form-select-option",
};
