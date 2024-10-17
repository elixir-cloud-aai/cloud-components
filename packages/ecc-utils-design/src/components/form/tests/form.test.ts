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
  complexArrayTestData,
  simpleArrayTestData,
  groupTestData,
  submitTestData,
  fieldOptionsTestData,
  requiredFieldsTestData,
  testDataForFileOptions,
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

    // throws error sumbit is attempted and no field is filled
    const formError = sinon.stub(formComponent.form, "error");
    formComponent.clickSubmitButton();

    sinon.assert.calledOnceWithExactly(formError, { message: "Form is empty" });
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
    formComponent = await createNewFormComponent(complexArrayTestData);
  });

  it("should render children fields correctly", () => {
    // 10 input fields should be rendered by default
    expect(formComponent.inputField(formInput, "root", true)).to.have.lengthOf(
      10
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
    await formComponent.initializeForm(simpleArrayTestData);

    await formComponent.clickButton(
      formComponent.buttonElement(formArrayAddButton, "root"),
      2
    );

    let arrayItems = formComponent.element(formArrayItem, "root", true);
    expect(arrayItems).to.have.lengthOf(3);

    const firstInputField = formComponent.inputField(formInput, arrayItems[0]);
    const secondInputField = formComponent.inputField(formInput, arrayItems[1]);
    const thirdInputField = formComponent.inputField(formInput, arrayItems[2]);

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

  it("add Button should new instance at the bottom", async () => {
    await formComponent.initializeForm(simpleArrayTestData);

    let arrayItems = formComponent.element(formArrayItem, "root", true);

    // check default instances
    expect(arrayItems).to.have.lengthOf(1);

    const firstInputField = formComponent.inputField(formInput, arrayItems[0]);
    formComponent.fillInputField(firstInputField, "test value 1");
    await formComponent.clickButton(
      formComponent.buttonElement(formArrayAddButton, "root")
    );

    arrayItems = formComponent.element(formArrayItem, "root", true);
    const secondInputField = formComponent.inputField(formInput, arrayItems[1]);
    formComponent.fillInputField(secondInputField, "test value 2");

    expect(
      formComponent.inputField(formInput, arrayItems[0], false).value
    ).to.equal("test value 1");
    expect(
      formComponent.inputField(formInput, arrayItems[1], false).value
    ).to.equal("test value 2");
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

  it("should verify that all required fields are filled in simple scenarios", async () => {
    const formComponent = await createNewFormComponent(requiredFieldsTestData);

    const inputFields = formComponent.inputField(formInput, "root", true);

    await formComponent.fillInputField(inputFields[0]);
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    await formComponent.fillInputField(inputFields[1], "19");
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
    // note: didn't fill the email field since it is not required
  });

  // ... existing code ...

  it("should verify that all required fields are filled in array scenarios", async () => {
    // revert this to new test ids
    // const formComponent = await createNewFormComponent(complexArrayTestData);
    // expect(formComponent.submitButton()).to.have.attribute("disabled");
    // const arrayTemplates = formComponent.element(formArrayItem, "root", true);
    // // Fill all required fields in the first array
    // const inputFieldsFirstArray = formComponent.inputField(
    //   formInput,
    //   arrayTemplates[0],
    //   true
    // );
    // inputFieldsFirstArray.forEach((field) =>
    //   formComponent.fillInputField(field)
    // );
    // // Fill all required fields in the second array
    // const inputFieldsSecondArray = formComponent.inputField(
    //   formInput,
    //   arrayTemplates[1],
    //   true
    // );
    // const fileFieldsSecondArray = formComponent.inputField(
    //   formInputFile,
    //   arrayTemplates[1],
    //   true
    // );
    // inputFieldsSecondArray.forEach((field) =>
    //   formComponent.fillInputField(field)
    // );
    // fileFieldsSecondArray.forEach((field) =>
    //   formComponent.fillInputFileField(field)
    // );
    // await formComponent.form.updateComplete;
    // expect(formComponent.submitButton()).to.not.have.attribute("disabled");
    // // Add a new instance to the first array
    // await formComponent.clickButton(
    //   formComponent.buttonElement(formArrayAddButton, arrayTemplates[0])
    // );
    // expect(formComponent.submitButton()).to.have.attribute("disabled");
    // // Fill required fields in the new instance
    // const newArrayItem = formComponent.element(
    //   formArrayItem,
    //   arrayTemplates[0],
    //   true
    // )[1];
    // const newInputFields = formComponent.inputField(
    //   formInput,
    //   newArrayItem,
    //   true
    // );
    // newInputFields.forEach((field) => formComponent.fillInputField(field));
    // await formComponent.form.updateComplete;
    // expect(formComponent.submitButton()).to.not.have.attribute("disabled");
    // // Add a new instance to the second array
    // await formComponent.clickButton(
    //   formComponent.buttonElement(formArrayAddButton, arrayTemplates[1])
    // );
    // expect(formComponent.submitButton()).to.have.attribute("disabled");
    // // Fill required fields in the new instance of the second array
    // const newSecondArrayItem = formComponent.element(
    //   formArrayItem,
    //   arrayTemplates[1],
    //   true
    // )[1];
    // const newSecondInputFields = formComponent.inputField(
    //   formInput,
    //   newSecondArrayItem,
    //   true
    // );
    // const newSecondFileFields = formComponent.inputField(
    //   formInputFile,
    //   newSecondArrayItem,
    //   true
    // );
    // newSecondInputFields.forEach((field) =>
    //   formComponent.fillInputField(field)
    // );
    // newSecondFileFields.forEach((field) =>
    //   formComponent.fillInputFileField(field)
    // );
    // await formComponent.form.updateComplete;
    // expect(formComponent.submitButton()).to.not.have.attribute("disabled");
  });

  // ... rest of the existing code ...

  it("should verify that all required fields are filled in group scenarios", async () => {
    const formComponent = await createNewFormComponent(groupTestData);
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    const groupTemplate = formComponent.element(formGroup, "root");
    const collapsibleGroup = formComponent.element(
      formCollapsibleGroup,
      groupTemplate,
      false
    );

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

// use the submit data to test what happens when the form is submitted
// hint: use the demo to print the data to the console
// also test how the error works
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
    // add test for the file field
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
    // this is pretty brittle but the test is simple enough
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
    const passportField = localFormComponent.inputField(
      formInputFile,
      "root",
      true
    )[2];

    expect(idField).to.not.have.attribute("multiple");
    expect(vactionPhotosField).to.have.attribute("multiple");
    expect(passportField).to.not.have.attribute("multiple");
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

// after this consider some error scenarios
// consider using the get fields directly in the tests
