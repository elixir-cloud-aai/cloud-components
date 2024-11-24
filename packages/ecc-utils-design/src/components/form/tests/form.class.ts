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
    const el = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form
        .fields="${this.fields}"
      ></ecc-utils-design-form>`
    );

    this.setEl(el);

    // need to make the component available as more specific EccUtilsDesign type so we can access its methods for stubbing and spying, while maintaining type safety
    this.form = el as EccUtilsDesignForm;
  };

  formElement = () => this.getElement("", "form").el;

  submitButton = () => this.getButtonElement("", "form-submit");

  errorTemplate = () => this.getElement("", "form-error").el;

  successTemplate = () => this.getElement("", "form-success").el;

  // actions
  public async clickSubmitButton() {
    this.submitButton().click();
    await this.component?.updateComplete;
  }
}

export default async function createNewFormComponent(fields: Field[]) {
  const formComponent = new FormComponent(
    new EccUtilsDesignForm(), // this is just a placeholder
    "litElement"
  );
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
  formFileUploadBar: "form-file-upload-bar",
  formFileUploadPercentage: "form-file-upload-percentage",
};
