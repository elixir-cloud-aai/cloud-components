/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

import { expect } from "@open-wc/testing";
import * as _ from "lodash-es";
import sinon from "sinon";
import createNewFormComponent, {
  FormComponentType,
  testIds,
} from "./form.class.js";
import {
  simpleTestData,
  arrayTestData,
  groupTestData,
  submitTestData,
  fieldOptionsTestData,
  requiredFieldsTestData,
  testDataForFileOptions,
  selectFieldTestData,
} from "./testData.js";

const {
  formInput,
  formInputFile,
  formInputParent,
  formSwitch,
  formSwitchParent,
  formArrayAddButton,
  formArrayDeleteButton,
  formArrayItem,
  formArray,
  formGroup,
  formCollapsibleGroup,
  formNonCollapsibleGroup,
  formTooltip,
  formSelect,
  formSelectOption,
} = testIds;

describe("renders correctly", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(simpleTestData);
  });

  it("returns error when field is empty", async () => {
    try {
      await createNewFormComponent([]);
    } catch (formError: any & { message: string }) {
      expect(formError).to.be.an("error");
      expect(formError!.message).to.equal(
        "Fields is required & should not be empty array"
      );
    }
  });

  it("works correctly with minimum required fields", async () => {
    // renders correctly
    expect(formComponent.form).to.be.visible;
    expect(formComponent.inputField(formInput, "root")).to.be.visible;
  });

  it("renders error template correctly", async () => {
    formComponent.form.error({ message: "test error" });
    await formComponent.form.updateComplete;

    expect(formComponent.errorTemplate()).to.be.visible.and.to.contain.text(
      "test error"
    );
  });

  it("renders success template correctly", async () => {
    formComponent.form.success({ message: "test success" });
    await formComponent.form.updateComplete;

    expect(formComponent.successTemplate()).to.be.visible.and.to.contain.text(
      "test success"
    );
  });
});

describe("handles more complex input fields correctly", () => {
  it("renders the 'select' field correctly", async () => {
    const formComponent = await createNewFormComponent(selectFieldTestData);
    expect(formComponent.inputField(formSelect, "root")).to.be.visible;

    const options = formComponent.element(formSelectOption, "root", true);
    expect(options.length).to.be.equal(5);

    expect(options.item(0).textContent?.trim()).to.be.equal("Male");
    expect(options.item(1).textContent?.trim()).to.be.equal("Female");
    expect(options.item(2).textContent?.trim()).to.be.equal("Non-binary");
    expect(options.item(3).textContent?.trim()).to.be.equal("other");
    expect(options.item(4).textContent?.trim()).to.be.equal(
      "Prefer not to say"
    );
  });

  it("sets the form value for each select option correctly", async () => {
    const formComponent = await createNewFormComponent(selectFieldTestData);

    formComponent.form.addEventListener(
      "ecc-utils-change",
      (e: CustomEvent) => {
        expect(_.isEqual(e.detail, { key: "gender", value: "non-binary" })).to
          .be.true;
      }
    );

    const selectElement = formComponent.inputField(formSelect, "root");

    // calling with the fill input method won't fire the ecc change event
    selectElement.value = "non-binary";
    selectElement.dispatchEvent(new Event("sl-change"));
    selectElement.dispatchEvent(new Event("sl-input"));

    await formComponent.form.updateComplete;
  });
});

describe("when loading", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(simpleTestData);
    formComponent.form.loading();
    await formComponent.form.updateComplete;
  });

  it("should disable the submit button", async () => {
    expect(formComponent.submitButton()).has.attribute("disabled");
  });
});

describe("when array template is rendered", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(arrayTestData);
  });

  it("should render children fields correctly", () => {
    // 2 input fields should be rendered by default
    expect(formComponent.inputField(formInput, "root", true)).to.have.lengthOf(
      2
    );
    // 2 switch field should be rendered by default
    expect(formComponent.inputField(formSwitch, "root", true)).to.have.lengthOf(
      2
    );
    // 2 file fields should be rendered by default
    expect(
      formComponent.inputField(formInputFile, "root", true)
    ).to.have.lengthOf(2);
  });

  it("add button should work properly", async () => {
    const addButton = formComponent.buttonElement(
      formArrayAddButton,
      "root",
      false
    );

    await formComponent.clickButton(addButton);

    expect(formComponent.element(formArrayItem, "root", true)).to.have.lengthOf(
      3
    );
  });

  it("delete button should work properly", async () => {
    const arrayFields = formComponent.element(formArrayItem, "root", true);
    expect(arrayFields).to.have.lengthOf(2);

    const deleteButtons = formComponent.buttonElement(
      formArrayDeleteButton,
      arrayFields[0],
      false
    );

    await formComponent.clickButton(deleteButtons);
    expect(formComponent.element(formArrayItem, "root", true)).to.have.lengthOf(
      1
    );
  });

  it("delete button should delete the correct instance", async () => {
    await formComponent.clickButton(
      formComponent.buttonElement(formArrayAddButton, "root")
    );

    let arrayItems = formComponent.element(formArrayItem, "root", true);
    expect(arrayItems).to.have.lengthOf(3);

    const firstInputField = formComponent.inputField(formInput, arrayItems[0]);
    const secondInputField = formComponent.inputField(formInput, arrayItems[1]);
    const thirdInputField = formComponent.inputField(formInput, arrayItems[2]);

    // fill each of the input fields
    formComponent.fillInputField(firstInputField, "test value 1");
    formComponent.fillInputField(secondInputField, "test value 2");
    formComponent.fillInputField(thirdInputField, "test value 3");

    // delete the instance in the middle
    await formComponent.clickButton(
      formComponent.buttonElement(formArrayDeleteButton, arrayItems[1], false)
    );

    arrayItems = formComponent.element(formArrayItem, "root", true);
    expect(arrayItems).to.have.lengthOf(2);
    expect(
      formComponent.inputField(formInput, arrayItems[0], false).value
    ).to.equal("test value 1");
    expect(
      formComponent.inputField(formInput, arrayItems[1], false).value
    ).to.equal("test value 3");
  });

  it("add Button should new instance at the bottom", async () => {
    let arrayItems = formComponent.element(formArrayItem, "root", true);

    // check default instances
    expect(arrayItems).to.have.lengthOf(2);

    const secondInputField = formComponent.inputField(formInput, arrayItems[1]);
    formComponent.fillInputField(secondInputField, "test value 2");

    await formComponent.clickButton(
      formComponent.buttonElement(formArrayAddButton, "root")
    );
    arrayItems = formComponent.element(formArrayItem, "root", true);

    const thirdInputField = formComponent.inputField(formInput, arrayItems[2]);
    formComponent.fillInputField(thirdInputField, "test value 3");
    arrayItems = formComponent.element(formArrayItem, "root", true);

    expect(
      formComponent.inputField(formInput, arrayItems[1], false).value
    ).to.equal("test value 2");
    expect(
      formComponent.inputField(formInput, arrayItems[2], false).value
    ).to.equal("test value 3");
  });
});

describe("when group template is rendered", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(groupTestData);
  });

  it("should render children fields correctly", async () => {
    const groupTemplate = formComponent.element(formGroup, "root");
    const collapsibleGroup = formComponent.element(
      formCollapsibleGroup,
      groupTemplate,
      false
    );

    expect(groupTemplate).to.be.visible;
    expect(collapsibleGroup).to.be.visible;
    expect(formComponent.element(formNonCollapsibleGroup, groupTemplate, false))
      .to.be.not.exist;
    expect(
      formComponent.inputField(formInput, collapsibleGroup, true)
    ).to.have.lengthOf(3);
    expect(
      formComponent.inputField(formSwitch, collapsibleGroup, true)
    ).to.have.lengthOf(1);
    expect(
      formComponent.inputField(formInputFile, collapsibleGroup, true)
    ).to.have.lengthOf(1);
  });
});

describe("when submit button is clicked", () => {
  it("should verify that the form is not empty", async () => {
    const formComponent = await createNewFormComponent(simpleTestData);
    const formError = sinon.stub(formComponent.form, "error");
    formComponent.clickSubmitButton();

    sinon.assert.calledOnceWithExactly(formError, { message: "Form is empty" });
  });

  it("should not be disabled if required fields are filled", async () => {
    const formComponent = await createNewFormComponent(requiredFieldsTestData);

    const inputFields = formComponent.inputField(formInput, "root", true);

    inputFields.forEach((field) => {
      if (field.required) formComponent.fillInputField(field);
    });

    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
  });

  it("should be disabled if required fields are not filled", async () => {
    const formComponent = await createNewFormComponent(requiredFieldsTestData);

    const inputFields = formComponent.inputField(formInput, "root", true);

    inputFields.forEach((field) => {
      if (!field.required) formComponent.fillInputField(field);
    });

    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.have.attribute("disabled");
  });

  it("should verify that all required fields are filled in array scenarios", async () => {
    const formComponent = await createNewFormComponent(arrayTestData);
    const arrayItems = formComponent.element(formArrayItem, "root", true);

    // delete second array instance, we do not need it
    formComponent.clickButton(
      formComponent.buttonElement(formArrayDeleteButton, arrayItems[1])
    );

    expect(formComponent.submitButton()).to.have.attribute("disabled");

    // fill required input field
    const inputField = formComponent.inputField(formInput, arrayItems[0]);
    formComponent.fillInputField(inputField);

    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
  });

  it("should be disabled by default when a new array item is added to the array", async () => {
    const formComponent = await createNewFormComponent(arrayTestData);
    const arrayItems = formComponent.element(formArrayItem, "root", true);

    // delete second array instance, we do not need it
    formComponent.clickButton(
      formComponent.buttonElement(formArrayDeleteButton, arrayItems[1])
    );

    // fill required input field
    const inputField = formComponent.inputField(formInput, arrayItems[0]);
    formComponent.fillInputField(inputField);

    formComponent.clickButton(
      formComponent.buttonElement(formArrayAddButton, "root")
    );

    await formComponent.form.updateComplete;

    expect(formComponent.submitButton()).to.have.attribute("disabled");
  });

  it("should verify that all required fields are filled in group scenarios", async () => {
    const formComponent = await createNewFormComponent(groupTestData);
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    const groupTemplate = formComponent.element(formGroup, "root");
    const collapsibleGroup = formComponent.element(
      formCollapsibleGroup,
      groupTemplate,
      false
    );

    // grab all input fields
    const inputFields = formComponent.inputField(
      formInput,
      collapsibleGroup,
      true
    );
    const fileFields = formComponent.inputField(
      formInputFile,
      collapsibleGroup,
      true
    );

    // fill all required fields
    inputFields.forEach((field) => formComponent.fillInputField(field));
    fileFields.forEach((field) => formComponent.fillInputFileField(field));

    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
  });
});

describe("when form is submitted", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(submitTestData);
  });

  it("should call the submit function with the correct data", async () => {
    formComponent.form.addEventListener(
      "ecc-utils-submit",
      (e: CustomEvent) => {
        expect(
          _.isEqual(e.detail, {
            form: {
              data: {
                isMarried: true,
                address: {
                  street: "test value",
                  phoneNumbers: [
                    {
                      phoneNumber: "test value",
                    },
                    {
                      phoneNumber: "test value",
                    },
                  ],
                  houseNumber: "test value",
                  city: "test value",
                },
                bankAccounts: [
                  {
                    accountBalance: "",
                    isPrimary: false,
                    bankName: "test value",
                    branchCode: "test value",
                    accountNumber: "test value",
                    beneficiaryName: "test value",
                  },
                  {
                    accountBalance: "",
                    isPrimary: false,
                    bankName: "test value",
                    branchCode: "test value",
                    accountNumber: "test value",
                    beneficiaryName: "test value",
                  },
                ],
                name: "test value",
                age: "test value",
              },
            },
          })
        ).to.be.true;
      }
    );

    const inputFields = formComponent.inputField(formInput, "root", true);
    const switchFields = formComponent.inputField(formSwitch, "root", true);
    const fileFields = formComponent.inputField(formInputFile, "root", true);

    // fill all input fields
    inputFields.forEach((field) => {
      // skip the account balance field
      // to test for test the returnIfEmpty flag
      if (!(field.getAttribute("data-label") === "Account Balance")) {
        formComponent.fillInputField(field);
      }
    });
    // fill all file fields
    fileFields.forEach((field) => {
      formComponent.fillInputFileField(field);
    });
    // toggle switch fields
    switchFields.forEach((field) => {
      // toggle the switch field for the married field
      // to test if the switch field sets correctly
      if (field.getAttribute("data-label") === "Married") {
        formComponent.toggleSwitch(field);
      }
    });

    await formComponent.form.updateComplete;

    formComponent.clickSubmitButton();
  });
});

describe("when fieldOptions are set", async () => {
  // test untested field options
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(fieldOptionsTestData);
  });

  it("should render tooltip when set", async () => {
    const inputFields = formComponent.inputField(formInput, "root", true);
    const fileFields = formComponent.element(formInputParent, "root", true);
    const arrayFields = formComponent.element(formArray, "root", true);
    const groupFields = formComponent.element(formGroup, "root", true);
    const switchFields = formComponent.element(formSwitchParent, "root", true);

    [
      ...Array.from(inputFields),
      ...Array.from(fileFields),
      ...Array.from(arrayFields),
      ...Array.from(groupFields),
      ...Array.from(switchFields),
    ].forEach((field) => {
      expect(
        formComponent.element(formTooltip, field)
      ).to.be.visible.and.to.have.attribute("content", "test tooltip");
    });
  });

  it("should set default value correctly", async () => {
    formComponent.form.addEventListener(
      "ecc-utils-submit",
      (e: CustomEvent) => {
        expect(
          _.isEqual(e.detail, {
            form: {
              data: { participants: [{ name: "John Doe", isMarried: true }] },
            },
          })
        ).to.be.true;
      }
    );

    // grab the specific input fields by name
    const inputField = formComponent.form.shadowRoot!.querySelector(
      '[data-label="Name"]'
    );
    const switchField = formComponent.form.shadowRoot!.querySelector(
      '[data-label="Married"]'
    );

    expect(inputField).to.have.attribute("value", "John Doe");
    expect(switchField).to.have.attribute("checked");

    formComponent.clickSubmitButton();
  });

  it("should accept single or multiple files depending on the value set for multiple", async () => {
    const localFormComponent = await createNewFormComponent(
      testDataForFileOptions
    );

    const idField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[0];
    const vactionPhotosField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[1];

    expect(idField).to.not.have.attribute("multiple");
    expect(vactionPhotosField).to.have.attribute("multiple");
  });

  it("should set the accept attribute correctly", async () => {
    const localFormComponent = await createNewFormComponent(
      testDataForFileOptions
    );

    const idField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[0];
    const vactionPhotosField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[1];
    const passportField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[2];

    expect(idField).to.have.attribute("accept", ".pdf .doc .docx");
    expect(vactionPhotosField).to.have.attribute("accept", "image/*");
    expect(passportField).to.have.attribute("accept", "*");
  });
});
