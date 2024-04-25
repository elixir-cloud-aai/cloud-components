/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

// REMEMBER TO RE-ENABLE LINTING FOR TESTS

import { expect } from "@open-wc/testing";
import _ from "lodash-es";
import sinon from "sinon";
import createNewFormComponent, {
  FormComponentType,
  clickButton,
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
    expect(formComponent.inputField("root")).to.be.visible;

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

describe("when submit button is disabled", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(simpleTestData);

    // formComponent.form.disableSubmit();
    await formComponent.form.updateComplete;
  });

  it.skip("submit action is not triggered on click", async () => {
    const handleSubmit = sinon.stub(formComponent.form, "handleSubmit");

    // the method is being called indirectly so the stub is not being tracked

    // try to call the method in the form class
    formComponent.clickSubmitButton();
    sinon.assert.calledOnce(handleSubmit);
  });
});

describe("when array template is rendered", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(complexArrayTestData);
  });

  it("should render children fields correctly", () => {
    const arrayFields = formComponent.arrayTemplate("root", true);

    // 10 input fields should be rendered by default
    expect(formComponent.inputField("root", true)).to.have.lengthOf(10);
    // 2 switch field should be rendered by default
    expect(formComponent.switchField("root", true)).to.have.lengthOf(2);
    // 2 file fields should be rendered by default
    expect(formComponent.inputFileField("root", true)).to.have.lengthOf(2);

    // check default instances
    expect(formComponent.arrayItem(arrayFields[0], true)).to.have.lengthOf(0);
    expect(formComponent.arrayItem(arrayFields[1], true)).to.have.lengthOf(2);
  });

  it("delete button should work properly", async () => {
    const secondArrayField = formComponent.arrayTemplate("root", true)[1];
    const deletebuttons = formComponent.arrayDeleteButton(
      secondArrayField,
      true
    );

    // check default instances
    expect(deletebuttons).to.have.lengthOf(2);

    clickButton(deletebuttons[0]);
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(secondArrayField, true)).to.have.lengthOf(1);

    // should not work when the number of instaces is already at the min
    clickButton(deletebuttons[1]);
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(secondArrayField, true)).to.have.lengthOf(1);
  });

  it("delete button should delete the correct instance", async () => {
    await formComponent.initializeForm(simpleArrayTestData);

    clickButton(formComponent.arrayAddButton("root"), 2);
    await formComponent.form.updateComplete;

    let arrayItems = formComponent.arrayItem("root", true);
    expect(arrayItems).to.have.lengthOf(3);

    const firstInputField = formComponent.inputField(arrayItems[0]);
    const secondInputField = formComponent.inputField(arrayItems[1]);
    const thirdInputField = formComponent.inputField(arrayItems[2]);

    formComponent.fillInputField(firstInputField, "test value 1");
    formComponent.fillInputField(secondInputField, "test value 2");
    formComponent.fillInputField(thirdInputField, "test value 3");

    // delete the instance in the middle
    clickButton(formComponent.arrayDeleteButton(arrayItems[1], false));
    await formComponent.form.updateComplete;

    arrayItems = formComponent.arrayItem("root", true);
    expect(arrayItems).to.have.lengthOf(2);
    expect(formComponent.inputField(arrayItems[0], false).value).to.equal(
      "test value 1"
    );
    expect(formComponent.inputField(arrayItems[1], false).value).to.equal(
      "test value 3"
    );
  });

  it("add button should work properly", async () => {
    const firstArrayField = formComponent.arrayTemplate("root", true)[0];

    clickButton(formComponent.arrayAddButton(firstArrayField));
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(firstArrayField, true)).to.have.lengthOf(1);
  });

  it("add Button should new instance at the bottom", async () => {
    await formComponent.initializeForm(simpleArrayTestData);

    let arrayItems = formComponent.arrayItem("root", true);

    // check default instances
    expect(arrayItems).to.have.lengthOf(1);

    const firstInputField = formComponent.inputField(arrayItems[0]);
    formComponent.fillInputField(firstInputField, "test value 1");
    clickButton(formComponent.arrayAddButton("root"));
    await formComponent.form.updateComplete;

    arrayItems = formComponent.arrayItem("root", true);
    const secondInputField = formComponent.inputField(arrayItems[1]);
    formComponent.fillInputField(secondInputField, "test value 2");

    expect(formComponent.inputField(arrayItems[0], false).value).to.equal(
      "test value 1"
    );
    expect(formComponent.inputField(arrayItems[1], false).value).to.equal(
      "test value 2"
    );
  });
});

describe("when group template is rendered", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(groupTestData);
  });

  it("should render children fields correctly", async () => {
    const groupTemplate = formComponent.groupTemplate("root");
    const collapsibleGroup = formComponent.collapsibleGroup(
      groupTemplate,
      false
    );

    expect(groupTemplate).to.be.visible;
    expect(collapsibleGroup).to.be.visible;
    expect(formComponent.nonCollapsibleGroup(groupTemplate, false)).to.be.not
      .exist;
    expect(formComponent.inputField(collapsibleGroup, true)).to.have.lengthOf(
      3
    );
    expect(formComponent.switchField(collapsibleGroup, true)).to.have.lengthOf(
      1
    );
    expect(
      formComponent.inputFileField(collapsibleGroup, true)
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

    const inputFields = formComponent.inputField("root", true);

    await formComponent.fillInputField(inputFields[0]);
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    await formComponent.fillInputField(inputFields[1], "19");
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
    // note: didn't fill the email field since it is not required
  });

  it("should verify that all required fields are filled in array scenarios", async () => {
    const formComponent = await createNewFormComponent(complexArrayTestData);
    expect(formComponent.submitButton()).to.have.attribute("disabled");
    const arrayTemplates = formComponent.arrayTemplate("root", true);

    // grab all input fields
    const inputTemplatesForSecondArray = formComponent.inputField(
      arrayTemplates[1],
      true
    );
    const fileFieldsForSecondArray = formComponent.inputFileField(
      arrayTemplates[1],
      true
    );

    // fill all required fields in available default instances
    // fill all but one required fields
    inputTemplatesForSecondArray.forEach((field) =>
      formComponent.fillInputField(field)
    );
    fileFieldsForSecondArray.forEach((field, i) => {
      // I am only filling one instance of the ID field
      if (i === 0) {
        formComponent.fillInputFileField(field);
      }
    });
    await formComponent.form.updateComplete;

    // should be disabled since some 1 required field is not filled
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    // fill all ID fields
    fileFieldsForSecondArray.forEach((field) => {
      formComponent.fillInputFileField(field);
    });
    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");

    // add an instance for the other array template
    clickButton(formComponent.arrayAddButton("root"));
    await formComponent.form.updateComplete;
    // submit button should be disabled since the required fields in the new array instance are not filled
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    // grab all input fields from the new instance
    const inputTemplatesForFirstArray = formComponent.inputField(
      arrayTemplates[0],
      true
    );

    // fill all required fields in the new instance
    inputTemplatesForFirstArray.forEach((field) =>
      formComponent.fillInputField(field)
    );
    await formComponent.form.updateComplete;
    expect(formComponent.submitButton()).to.not.have.attribute("disabled");
  });

  it("should verify that all required fields are filled in group scenarios", async () => {
    const formComponent = await createNewFormComponent(groupTestData);
    expect(formComponent.submitButton()).to.have.attribute("disabled");

    const groupTemplate = formComponent.groupTemplate("root");
    const collapsibleGroup = formComponent.collapsibleGroup(
      groupTemplate,
      false
    );

    const inputFields = formComponent.inputField(collapsibleGroup, true);
    const fileFields = formComponent.inputFileField(collapsibleGroup, true);

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
    formComponent.form.addEventListener("ecc-utils-submit", (e) => {
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
    });

    const inputFields = formComponent.inputField("root", true);
    const switchFields = formComponent.switchField("root", true);
    const fileFields = formComponent.inputFileField("root", true);

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
    const inputFields = formComponent.inputField("root", true);
    const fileFields = formComponent.inputFileParent("root", true);
    const arrayFields = formComponent.arrayTemplate("root", true);
    const groupFields = formComponent.groupTemplate("root", true);
    const switchFields = formComponent.switchParent("root", true);

    [
      ...Array.from(inputFields),
      ...Array.from(fileFields),
      ...Array.from(arrayFields),
      ...Array.from(groupFields),
      ...Array.from(switchFields),
    ].forEach((field) => {
      expect(formComponent.tooltip(field)).to.be.visible.and.to.have.attribute(
        "content",
        "test tooltip"
      );
    });
  });

  it("should set default value correctly", async () => {
    // this is pretty brittle but the test is simple enough
    formComponent.form.addEventListener("ecc-utils-submit", (e) => {
      expect(
        _.isEqual(e.detail, {
          form: {
            data: { participants: [{ name: "John Doe", isMarried: true }] },
          },
        })
      ).to.be.true;
    });
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

    const idField = localFormComponent.inputFileField("root", true)[0];
    const vactionPhotosField = localFormComponent.inputFileField(
      "root",
      true
    )[1];
    const passportField = localFormComponent.inputFileField("root", true)[2];

    expect(idField).to.not.have.attribute("multiple");
    expect(vactionPhotosField).to.have.attribute("multiple");
    expect(passportField).to.not.have.attribute("multiple");
  });

  it("should set the accept attribute correctly", async () => {
    const localFormComponent = await createNewFormComponent(
      testDataForFileOptions
    );

    const idField = localFormComponent.inputFileField("root", true)[0];
    const vactionPhotosField = localFormComponent.inputFileField(
      "root",
      true
    )[1];
    const passportField = localFormComponent.inputFileField("root", true)[2];

    expect(idField).to.have.attribute("accept", ".pdf .doc .docx");
    expect(vactionPhotosField).to.have.attribute("accept", "image/*");
    expect(passportField).to.have.attribute("accept", "*");
  });
});

// after this consider some error scenarios
// consider using the get fields directly in the tests
