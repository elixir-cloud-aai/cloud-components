/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

import { expect } from "@open-wc/testing";
import sinon from "sinon";
import createNewFormComponent, { FormComponentType } from "./form.class.js";
import { Field } from "../form.js";
import {
  GenericElement,
  InputField,
  SelectField,
} from "../../../internal/TestComponent.js";

describe("renders correctly", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: "name",
        label: "Name",
      },
    ]);
  });

  it("should return error when field is empty", async () => {
    try {
      await createNewFormComponent([]);
    } catch (formError: any & { message: string }) {
      expect(formError).to.be.an("error");
      expect(formError!.message).equal(
        "Fields is required & should not be empty array"
      );
    }
  });

  it("should work correctly with minimum required fields", async () => {
    // renders correctly
    expect(formComponent.form).is.visible;
    expect(formComponent.getInputField("Name").el).is.visible;
  });

  it("should render error template correctly", async () => {
    formComponent.form.error({ message: "test error" });
    await formComponent.form.updateComplete;

    expect(formComponent.errorTemplate()).is.visible;
    expect(formComponent.errorTemplate()).contain.text("test error");
  });

  it("should render success template correctly", async () => {
    formComponent.form.success({ message: "test success" });
    await formComponent.form.updateComplete;

    expect(formComponent.successTemplate()).is.visible;
    expect(formComponent.successTemplate()).contain.text("test success");
  });
});

describe("input fields", async () => {
  // this tests text, date, number, email, password, tel, url, search, datetime-local and time types as well since they're identical based on the interactions our code performs with them
  let formComponent: FormComponentType;
  let inputField: InputField;

  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      { key: "name", label: "Name" },
    ]);

    inputField = formComponent.getInputField("Name");
  });

  it("should render correctly and in default state", async () => {
    expect(inputField.el.type).equal("text"); // type text by default
    expect(inputField.el).is.visible; // is visible
    expect(inputField.el.value).equal(""); // no content by default
    expect(inputField.el.getAttribute("required")).equal(null); // not required

    const label = inputField.getElement("", "label").el;
    const tooltip = inputField.getElement("", "tooltip");
    expect(tooltip).to.be.null; // no tooltip
    expect(label.textContent?.trim()).equal("Name");
  });

  it("should render input:text when type is set to text", async () => {
    formComponent = await createNewFormComponent([
      { key: "name", label: "Name", type: "text" },
    ]);

    inputField = formComponent.getInputField("Name");
    expect(inputField.el).is.visible;
    expect(inputField.el.type).equal("text");
  });

  // check if the rest render when set

  it("should set content in the form object correctly", async () => {
    const submitSpy = sinon.spy();

    formComponent.form.addEventListener("ecc-utils-submit", submitSpy);
    await inputField.fill("David");
    formComponent.clickSubmitButton();

    sinon.assert.calledOnceWithMatch(
      submitSpy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = submitSpy.getCall(0).args[0];
    expect(detail).deep.equal({
      form: {
        data: {
          name: "David",
        },
      },
    });
  });

  it("should fire change event when change is text is entered", () => {
    const changeSpy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-change", changeSpy);

    inputField.fill();
    sinon.assert.calledOnceWithExactly(
      changeSpy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = changeSpy.getCall(0).args[0];
    expect(detail).deep.equal({ key: "name", value: "test value" });
  });

  describe("fieldOptions", () => {
    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "name",
          label: "Name",
          type: "text",
          fieldOptions: {
            default: "David",
            required: true,
            tooltip: "enter name",
            returnIfEmpty: true,
          },
        },
      ]);

      inputField = formComponent.getInputField("Name");
    });

    it("should set default content in the element and in the form object correctly", async () => {
      const submitSpy = sinon.spy();

      formComponent.form.addEventListener("ecc-utils-submit", submitSpy);

      expect(inputField.el.value).equal("David");

      formComponent.clickSubmitButton();
      sinon.assert.calledOnceWithExactly(
        submitSpy,
        sinon.match.instanceOf(CustomEvent)
      );
      const { detail } = submitSpy.getCall(0).args[0];
      expect(detail).deep.equal({
        form: {
          data: {
            name: "David",
          },
        },
      });
    });

    it("should set required option correctly", async () => {
      expect(inputField.el.getAttribute("required")).not.equal(null);
    });

    it("should set tooltip correctly", async () => {
      const tooltip = inputField.getElement("", "tooltip").el;

      expect(tooltip).to.have.attribute("content", "enter name");
    });

    describe("returnIfEmpty is true", () => {
      beforeEach(async () => {
        formComponent = await createNewFormComponent([
          {
            key: "name",
            label: "Name",
            type: "text",
            fieldOptions: {
              returnIfEmpty: true,
            },
          },
        ]);

        inputField = formComponent.getInputField("Name");
      });

      it("should set the value of the field to null in the form object", () => {
        const spy = sinon.spy();
        formComponent.form.addEventListener("ecc-utils-submit", spy);

        formComponent.clickSubmitButton();
        sinon.assert.calledOnceWithExactly(
          spy,
          sinon.match.instanceOf(CustomEvent)
        );

        const { detail } = spy.getCall(0).args[0];
        expect(detail).deep.equal({
          form: {
            data: {
              name: null,
            },
          },
        });
      });

      it("should set the value of the field to null when the field is set then cleared ", async () => {
        const spy = sinon.spy();
        formComponent.form.addEventListener("ecc-utils-submit", spy);

        await inputField.fill(); // fill the input field
        await inputField.fill(""); // empty the input field
        formComponent.clickSubmitButton();

        const { detail } = spy.getCall(0).args[0];
        expect(detail).deep.equal({
          form: {
            data: {
              name: null,
            },
          },
        });
      });
    });

    describe("returnIfEmpty is not set or false", () => {
      beforeEach(async () => {
        formComponent = await createNewFormComponent([
          { key: "name", label: "Name" },
          {
            key: "comment",
            label: "Comment",
            fieldOptions: { default: "test value" },
          },
        ]);
      });

      it("should not add empty value to the form object", async () => {
        const spy = sinon.spy();

        formComponent.form.addEventListener("ecc-utils-submit", spy);

        formComponent.clickSubmitButton();
        sinon.assert.calledOnceWithExactly(
          spy,
          sinon.match.instanceOf(CustomEvent)
        );
        const { detail } = spy.getCall(0).args[0];
        expect(detail).deep.equal({
          form: { data: { comment: "test value" } },
        });
      });

      it("should remove value from form object if field is set and then cleared", async () => {
        const spy = sinon.spy();

        formComponent.form.addEventListener("ecc-utils-submit", spy);

        const nameInputField = formComponent.getInputField("Name");

        // fill the name field and clear it
        await nameInputField.fill();
        await nameInputField.fill("");
        formComponent.clickSubmitButton();

        sinon.assert.calledOnceWithExactly(
          spy,
          sinon.match.instanceOf(CustomEvent)
        );
        const { detail } = spy.getCall(0).args[0];
        expect(detail).deep.equal({
          form: { data: { comment: "test value" } },
        });
      });
    });
  });
});

describe("switch fields", () => {
  let formComponent: FormComponentType;
  let switchField: InputField;

  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: "consent",
        label: "Consent",
        type: "switch",
      },
    ]);

    switchField = formComponent.getInputField("Consent");
  });

  it("should render correcly and in default state", () => {
    const { el } = switchField;
    expect(el).is.visible; // is visible
    expect(el.getAttribute("required")).to.be.null; // not required
    expect(el.getAttribute("checked")).to.be.null; // not checked by default

    const switchContainer = formComponent.getElement("", "switch-container");
    const tooltip = switchContainer.getElement("", "tooltip");
    const label = switchContainer.getElement("", "label").el;

    expect(label.textContent?.trim()).equal("Consent");
    expect(tooltip).to.be.null; // no tooltip
  });

  it("should set the content as false by default in the form object", () => {
    const spy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-submit", spy);

    formComponent.clickSubmitButton();
    sinon.assert.calledOnceWithExactly(
      spy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = spy.getCall(0).args[0];
    expect(detail).deep.equal({
      form: {
        data: {
          consent: false,
        },
      },
    });
  });

  it("should set content in the form object correctly", async () => {
    const spy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-submit", spy);

    await switchField.toggle();
    await formComponent.clickSubmitButton();
    sinon.assert.calledOnceWithExactly(
      spy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = spy.getCall(0).args[0];
    expect(detail).deep.equal({
      form: {
        data: {
          consent: true,
        },
      },
    });
  });

  it("should fire change event when toggled", async () => {
    const spy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-change", spy);

    await switchField.toggle();

    sinon.assert.calledOnceWithExactly(
      spy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = spy.getCall(0).args[0];
    expect(detail).deep.equal({ key: "consent", value: true });
  });

  describe("field options", () => {
    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "consent",
          label: "Consent",
          type: "switch",
          fieldOptions: {
            default: true,
            required: true,
            tooltip: "Do you agree to our TOC",
          },
        },
      ]);

      switchField = formComponent.getInputField("Consent");
    });

    it("sets switch default content in the element and in the form object correctly", () => {
      const spy = sinon.spy();
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      expect(switchField.el.getAttribute("checked")).not.equal(null);
      formComponent.clickSubmitButton();

      sinon.assert.calledOnceWithExactly(
        spy,
        sinon.match.instanceOf(CustomEvent)
      );
      const { detail } = spy.getCall(0).args[0];
      expect(detail).deep.equal({
        form: {
          data: {
            consent: true,
          },
        },
      });
    });

    it("sets required option correctly", () => {
      expect(switchField.el.getAttribute("required")).not.equal(null);
    });

    it("sets tooltip correctly", () => {
      const tooltip = formComponent
        .getElement("", "switch-container")
        .getElement("", "tooltip").el;

      expect(tooltip).to.have.attribute("content", "Do you agree to our TOC");
    });
  });
});

describe("select fields", () => {
  let formComponent: FormComponentType;
  let selectField: SelectField;

  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: "format",
        label: "Format",
        type: "select",
        selectOptions: [
          {
            label: "PDF",
            value: "pdf",
          },
          {
            label: "JPEG",
            value: "jpeg",
          },
        ],
      },
    ]);

    selectField = formComponent.getSelectField("Format");
  });

  it("should render correctly and in default state", async () => {
    const { el } = selectField;
    expect(el).to.be.visible; // is visible
    expect(el.getAttribute("required")).to.be.null; // not required
    expect(el.value).equal(""); // not default value

    const selectContainer = formComponent.getElement("", "select-container");

    const label = selectContainer.getElement("", "label");
    const tooltip = selectContainer.getElement("", "tooltip");
    expect(tooltip).to.be.null; // no tooltip
    expect(label.el.textContent?.trim()).equal("Format");

    // renders correct number of options with correct content
    expect(el.children).to.be.length(2);

    const option1 = selectField.getElement("PDF").el as HTMLOptionElement;
    const option2 = selectField.getElement("JPEG").el as HTMLOptionElement;

    expect(option1.value).to.be.equal("pdf");
    expect(option2.value).to.be.equal("jpeg");
  });

  it("should fire change event when new option is selected", async () => {
    const spy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-change", spy);

    await selectField.select("JPEG");
    sinon.assert.calledOnceWithExactly(
      spy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = spy.getCall(0).args[0];
    expect(detail).deep.equal({ key: "format", value: "jpeg" });
  });

  it("should set correct option in the element and form object correctly", async () => {
    const spy = sinon.spy();
    formComponent.form.addEventListener("ecc-utils-submit", spy);

    await selectField.select("JPEG");
    expect(selectField.el.value).to.be.equal("jpeg");
    formComponent.clickSubmitButton();

    sinon.assert.calledOnceWithExactly(
      spy,
      sinon.match.instanceOf(CustomEvent)
    );
    const { detail } = spy.getCall(0).args[0];
    expect(detail).deep.equal({ form: { data: { format: "jpeg" } } });
  });

  describe("fieldOptions", () => {
    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "format",
          label: "Format",
          type: "select",
          selectOptions: [
            {
              label: "PDF",
              value: "pdf",
            },
            {
              label: "JPEG",
              value: "jpeg",
            },
          ],
          fieldOptions: {
            required: true,
            tooltip: "select file format",
          },
        },
      ]);

      selectField = formComponent.getSelectField("Format");
    });

    it("should set required correctly", async () => {
      const label = formComponent
        .getElement("", "select-container")
        .getElement("", "label").el;

      expect(label.textContent?.trim()).equal("Format *");
      expect(selectField.el.getAttribute("required")).to.not.be.equal(null);
    });

    it("should set tooltip correctly", async () => {
      const tooltip = formComponent
        .getElement("", "select-container")
        .getElement("", "tooltip").el;

      expect(tooltip).to.have.attribute("content", "select file format");
    });
  });
});

describe("file fields", () => {
  let formComponent: FormComponentType;
  let fileField: InputField;
  let spy: sinon.SinonSpy;

  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: "id",
        label: "ID",
        type: "file",
      },
    ]);

    fileField = formComponent.getInputField("ID");
    spy = sinon.spy();
  });

  it("should render correctly and in default state", () => {
    const { el } = fileField;
    const fileContainer = formComponent.getElement("", "input-file-container");

    const label = fileContainer.getElement("", "label").el;

    expect(el).is.visible; // is visible
    expect(el.getAttribute("accept")).equal("*"); // accepts all file types
    expect(el.getAttribute("data-type")).equal("native");
    expect(el.getAttribute("multiple")).equal(null);
    expect(el.getAttribute("required")).equal(null);
    expect(label.textContent?.trim()).equal("ID");

    const tooltip = formComponent.getElement("", "tooltip");
    expect(tooltip).to.be.null;
  });

  describe("when protocol is set to tus", () => {
    let uploadStub: sinon.SinonStub;

    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "id",
          label: "ID",
          type: "file",
          fileOptions: {
            protocol: "tus",
            tusOptions: {
              endpoint: "#",
            },
          },
        },
      ]);

      fileField = formComponent.getInputField("ID");
      uploadStub = sinon.stub(formComponent.form, "handleTusFileUpload");
      uploadStub.resolves({
        url: "mockURL",
        file: "mockFile",
        name: "mockName",
      });
    });

    afterEach(() => {
      uploadStub.restore();
    });

    it("should render tus field at default state", () => {
      const { el } = fileField;

      const fileContainer = formComponent.getElement(
        "",
        "input-file-container"
      );
      const label = fileContainer.getElement("", "label").el;

      expect(el).is.visible; // is visible

      expect(label.textContent?.trim()).equal("ID");
      expect(el.getAttribute("accept")).equal("*"); // accepts all file types
      expect(el.getAttribute("data-type")).equal("tus"); // data-type is tus
      expect(el.getAttribute("multiple")).equal(null); // no multiple attribute
      expect(el.getAttribute("required")).equal(null); // not required

      const tooltip = fileContainer.getElement("root", "tooltip");
      expect(tooltip).to.be.null; // no tooltip

      const uploadBar = fileContainer.getElement("", "file-upload-bar").el;
      const uploadPercentage = fileContainer.getElement(
        "",
        "file-upload-percentage"
      ).el;

      expect(uploadBar).is.visible; // progress bar is empty
      expect(uploadPercentage).is.visible;
      expect(uploadPercentage.innerText).equal("0.00%"); // progress percentage is at 0
    });

    it("should not fire change event when tusOptions.endpoint is not added", async () => {
      formComponent = await createNewFormComponent([
        {
          key: "id",
          label: "ID",
          type: "file",
          fileOptions: {
            protocol: "tus",
          },
        },
      ]);

      fileField = formComponent.getInputField("ID");
      formComponent.form.addEventListener("ecc-utils-change", spy);
      await fileField.upload();

      sinon.assert.notCalled(spy);
    });

    it("should call change field with correct data when a file is uploaded", async () => {
      formComponent.form.addEventListener("ecc-utils-change", spy);

      await fileField.upload();
      sinon.assert.calledOnce(spy);

      const { detail } = spy.getCall(0).args[0];
      expect(detail).deep.equal({
        key: "id",
        value: {
          url: "mockURL",
          file: "mockFile",
          name: "mockName",
        },
      });
    });

    it("should set data correctly in the form object when a file is uploaded", async () => {
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      await fileField.upload();
      await formComponent.clickSubmitButton();
      sinon.assert.calledOnce(spy);

      const { detail } = spy.getCall(0).args[0];
      expect(detail).deep.equal({
        form: {
          data: {
            id: {
              url: "mockURL",
              file: "mockFile",
              name: "mockName",
            },
          },
        },
      });
    });

    describe("fieldOptions", () => {
      beforeEach(async () => {
        formComponent = await createNewFormComponent([
          {
            key: "id",
            label: "ID",
            type: "file",
            fieldOptions: {
              required: true,
              multiple: true,
              accept: "image/png",
              tooltip: "your ID document",
            },
            fileOptions: {
              protocol: "tus",
            },
          },
        ]);

        fileField = formComponent.getInputField("ID");
      });

      it("should set multiple property correctly", () => {
        expect(fileField.el.getAttribute("multiple")).to.not.be.null;
      });

      it("should set required property correctly", () => {
        expect(fileField.el.getAttribute("required")).to.not.be.null;
      });

      it("should set tooltip correctly", () => {
        const tooltip = formComponent.getElement("", "tooltip").el;

        expect(tooltip).is.visible;
        expect(tooltip.getAttribute("content")).equal("your ID document");
      });
    });
  });

  describe("when protocol is set to native", () => {
    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "id",
          label: "ID",
          type: "file",
          fileOptions: {
            protocol: "native",
          },
        },
      ]);

      fileField = formComponent.getInputField("ID");
    });

    it("should render native field at default state", () => {
      const { el } = fileField;

      const fileContainer = formComponent.getElement(
        "",
        "input-file-container"
      );

      const label = fileContainer.getElement("", "label").el;

      expect(el).is.visible; // is visible
      expect(label.textContent?.trim()).to.equal("ID");
      expect(el.getAttribute("accept")).equal("*"); // accepts all file types
      expect(el.getAttribute("data-type")).equal("native");
      expect(el.getAttribute("multiple")).equal(null);
      expect(el.getAttribute("required")).equal(null);

      const tooltip = fileContainer.getElement("", "tooltip");
      expect(tooltip).to.be.null;
    });

    it("should call change field with correct data when a file is uploaded", async () => {
      formComponent.form.addEventListener("ecc-utils-change", spy);

      await fileField.upload();
      sinon.assert.calledOnce(spy);

      const { detail } = spy.getCall(0).args[0];

      expect(detail.key).equal("id");
      expect(detail.value).to.be.instanceOf(FileList);
      expect(detail.value.length).equal(1);
      expect(detail.value[0]).instanceOf(File);
      expect(detail.value[0].name).equal("test-file.txt");
    });

    it("should set data correctly in the form object when a file is uploaded", async () => {
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      await fileField.upload();
      await formComponent.clickSubmitButton();
      sinon.assert.calledOnce(spy);

      const { id } = spy.getCall(0).args[0].detail.form.data;

      expect(id).to.be.instanceOf(FileList);
      expect(id.length).equal(1);
      expect(id[0]).instanceOf(File);
      expect(id[0].name).equal("test-file.txt");
    });
  });

  describe("fieldOptions", () => {
    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          key: "id",
          label: "ID",
          type: "file",
          fieldOptions: {
            required: true,
            multiple: true,
            accept: "image/png",
            tooltip: "your ID document",
          },
          fileOptions: {
            protocol: "native",
          },
        },
      ]);

      fileField = formComponent.getInputField("ID");
    });

    it("should set multiple property correctly", () => {
      expect(fileField.el.getAttribute("multiple")).to.not.be.null;
    });

    it("should set required property correctly", () => {
      const fileContainer = formComponent.getElement(
        "",
        "input-file-container"
      );

      const label = fileContainer.getElement("", "label").el;

      expect(label.textContent?.trim()).equal("ID *");
      expect(fileField.el.getAttribute("required")).to.not.be.null;
    });

    it("should set tooltip correctly", () => {
      const fileContainer = formComponent.getElement(
        "",
        "input-file-container"
      );
      const tooltip = fileContainer.getElement("", "tooltip").el;

      expect(tooltip).is.visible;
      expect(tooltip.getAttribute("content")).equal("your ID document");
    });
  });
});

describe("array component", () => {
  let defaultData: Field[];

  beforeEach(async () => {
    defaultData = [
      {
        key: "dependents",
        label: "Dependents",
        type: "array",
        children: [
          {
            key: "name",
            label: "Name",
          },
          {
            key: "18+",
            label: "18+",
            type: "switch",
          },
          {
            key: "gender",
            label: "Gender",
            type: "select",
            selectOptions: [
              {
                label: "Non-Binary",
                value: "nonbinary",
              },
              {
                label: "Other",
                value: "other",
              },
            ],
          },
          {
            key: "passportPicture",
            label: "Passport Picture",
            type: "file",
          },
        ],
      },
    ];
  });

  describe("renders correctly", () => {
    it("should not render when children are not set", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], children: [] },
      ]);
      const arrayComponent = formComponent.getElement("Dependents");

      expect(arrayComponent).is.null;
    });

    it("should render correctly and in defualt state when children are set", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: {} },
      ]);
      const arrayComponent = formComponent.getElement("Dependents");
      const label = arrayComponent.getElement("", "label").el;

      expect(arrayComponent.el).is.visible;
      expect(arrayComponent.getElement("", "tooltip")).is.null;
      expect(arrayComponent.getElement("", "array-delete")).is.null;
      expect(label.textContent?.trim()).to.equal("Dependents");

      expect(
        arrayComponent.getElement("", "array-add").el
      ).is.visible.and.not.have.attribute("disabled");
    });

    it("should render correctly and in default state when children and default instances are set", async () => {
      const formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          arrayOptions: {
            defaultInstances: 1,
          },
        },
      ]);
      const arrayComponent = formComponent.getElement("Dependents");
      const label = arrayComponent.getElement("", "label").el;
      const arrayAddButton = arrayComponent.getElement("", "array-add").el;
      const arrayDeleteButton = arrayComponent.getElement(
        "",
        "array-delete"
      ).el;

      expect(label.textContent?.trim()).to.equal("Dependents");
      expect(arrayComponent.getInputField("Name").el).is.visible;
      expect(arrayComponent.getInputField("18+").el).is.visible;
      expect(arrayComponent.getSelectField("Gender").el).is.visible;
      expect(arrayComponent.getInputField("Passport Picture").el).is.visible;
      expect(arrayComponent.getElement("", "array-delete").el).is.visible;

      expect(arrayComponent.getElement("", "tooltip")).is.null;
      expect(arrayAddButton).is.visible.and.not.have.attribute("disabled");
      expect(arrayDeleteButton).is.visible.and.not.have.attribute("disabled");
    });
  });

  describe("array functionality", () => {
    let formComponent: FormComponentType;
    let arrayComponent: GenericElement;

    const getItem = (idx: number) =>
      arrayComponent?.getElement(`Dependents-${idx}`) || null;

    const getNameField = (idx: number) =>
      getItem(idx)?.getInputField("Name") || null;

    const getGenderField = (idx: number) =>
      getItem(idx)?.getSelectField("Gender") || null;

    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          arrayOptions: {
            defaultInstances: 3,
          },
        },
      ]);

      arrayComponent = formComponent.getElement("Dependents");

      await getNameField(0).fill("test string 0");
      await getNameField(1).fill("test string 1");
      await getNameField(2).fill("test string 2");
    });

    it("should add new array item at the botton when add array button is clicked", async () => {
      const addButton = arrayComponent.getButtonElement("", "array-add");

      expect(getNameField(3)).to.be.null;

      await addButton.click();
      const lastInput = getNameField(3);

      expect(lastInput.el.value).equal("");
    });

    it("should remove first item when remove is clicked on the first item", async () => {
      const deleteBtn1 = getItem(0).getButtonElement("", "array-delete");

      await deleteBtn1.click();
      expect(getNameField(0).el.value).equal("test string 1");
      expect(getNameField(2)).to.be.null;
    });

    it("should remove middle item when remove is clicked on the middle item", async () => {
      const deleteBtn2 = getItem(1).getButtonElement("", "array-delete");

      await deleteBtn2.click();
      expect(getNameField(0).el.value).equal("test string 0");
      expect(getNameField(1).el.value).equal("test string 2");
      expect(getNameField(2)).to.be.null;
    });

    it("should remove last item when remove is clicked on the last item", async () => {
      const deleteBtn3 = getItem(2).getButtonElement("", "array-delete");

      await deleteBtn3.click();

      expect(getNameField(0).el.value).equal("test string 0");
      expect(getNameField(1).el.value).equal("test string 1");
      expect(getNameField(2)).to.be.null;
    });

    it("should set the content correctly in the form object", async () => {
      const spy = sinon.spy();
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      // Fill in the array items
      await getNameField(0).fill("John Doe");
      await getNameField(1).fill("Jane Smith");

      await getGenderField(0).select("Non-Binary");
      await getGenderField(1).select("Other");

      // Submit the form
      formComponent.clickSubmitButton();

      // Assert that the spy was called with the correct data
      sinon.assert.calledOnce(spy);
      const { detail } = spy.getCall(0).args[0];
      expect(detail).to.deep.equal({
        form: {
          data: {
            dependents: [
              { name: "John Doe", gender: "nonbinary", "18+": false },
              { name: "Jane Smith", gender: "other", "18+": false },
              { name: "test string 2", "18+": false },
            ],
          },
        },
      });
    });
  });

  describe("array options", () => {
    it("should render the correct number of default instances when set", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: { defaultInstances: 2 } },
      ]);
      const childInstances = formComponent
        .getElement("Dependents")
        .getElement("", "array-item", true);

      expect(childInstances.length).to.equal(2);
    });

    it("array add button should not be disabled when current instances is less than the max", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: { defaultInstances: 1, max: 3 } },
      ]);

      let addButton = formComponent.getButtonElement("", "array-add");
      expect(addButton.el).to.not.have.attribute("disabled");

      await addButton.click();
      addButton = formComponent.getButtonElement("", "array-add");
      expect(addButton.el).to.not.have.attribute("disabled");
    });

    it("array add button should be disabled when current instances is the same as the max when set", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: { defaultInstances: 1, max: 1 } },
      ]);

      const addButton = formComponent.getButtonElement("", "array-add");
      expect(addButton.el).to.have.attribute("disabled", "");
    });

    it("array delete button should not be disabled when current instances is greater than the min", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: { defaultInstances: 3, min: 1 } },
      ]);

      const deleteButton = formComponent.getButtonElement("", "array-delete");
      expect(deleteButton.el).not.to.have.attribute("disabled");

      await deleteButton.click();
      expect(
        formComponent.getButtonElement("", "array-delete").el
      ).not.to.have.attribute("disabled");
    });

    it("array delete button should be disabled when current instances is the same as the min", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], arrayOptions: { defaultInstances: 1, min: 1 } },
      ]);

      const deleteButton = formComponent.getButtonElement("", "array-delete");
      expect(deleteButton.el).to.have.attribute("disabled", "");
    });
  });

  describe("field options", () => {
    let formComponent: FormComponentType;

    beforeEach(async () => {
      formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          fieldOptions: {
            required: true,
            tooltip: "please list all your dependents",
          },
        },
      ]);
    });

    it("should render tooltip correctly when set", () => {
      const tooltip = formComponent
        .getElement("Dependents")
        .getElement("", "tooltip").el;

      expect(tooltip).attribute("content", "please list all your dependents");
    });

    it("should show `*` when required is set", () => {
      const label = formComponent
        .getElement("Dependents")
        .getElement("", "label").el;

      expect(label.textContent?.trim()).to.equal("Dependents *");
    });
  });
});

describe("group component", () => {
  let defaultData: Field[];

  beforeEach(async () => {
    defaultData = [
      {
        key: "dependents",
        label: "Dependents",
        type: "group",
        children: [
          {
            key: "name",
            label: "Name",
          },
          {
            key: "18+",
            label: "18+",
            type: "switch",
          },
          {
            key: "gender",
            label: "Gender",
            type: "select",
            selectOptions: [
              {
                label: "Non-Binary",
                value: "nonBinary",
              },
              {
                label: "Other",
                value: "other",
              },
            ],
          },
          {
            key: "passportPicture",
            label: "Passport Picture",
            type: "file",
          },
        ],
      },
    ];
  });

  describe("renders correclty and in default state", () => {
    it("should not render when children are not set", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], children: [] },
      ]);
      const groupComponent = formComponent.getElement("Dependents");

      expect(groupComponent).is.null;
    });

    it("should render correctly and in default state when children are set", async () => {
      const formComponent = await createNewFormComponent(defaultData);
      const groupComponent = formComponent.getElement(
        "",
        "group-non-collapsible"
      );
      const label = groupComponent.getElement("", "label").el;

      expect(groupComponent.el).is.visible;
      expect(groupComponent.getElement("", "tooltip")).is.null;
      expect(label.textContent?.trim()).to.equal("Dependents");

      const groupContainer = formComponent.getElement("", "group-container");
      expect(groupContainer.getInputField("Name").el).is.visible;
      expect(groupContainer.getInputField("18+").el).is.visible;
      expect(groupContainer.getSelectField("Gender").el).is.visible;
    });

    it("should render correctly when collapsible is true", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], groupOptions: { collapsible: true } },
      ]);

      const groupComponent = formComponent.getElement("", "group-collapsible");

      expect(groupComponent.el).is.visible;
      expect(groupComponent.getElement("", "tooltip")).is.null;
      expect(groupComponent.el.getAttribute("summary")?.trim()).equal(
        "Dependents"
      );
    });

    it("should render correctly when collapsible is false", async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], groupOptions: { collapsible: false } },
      ]);
      const groupComponent = formComponent.getElement(
        "",
        "group-non-collapsible"
      );
      const label = groupComponent.getElement("", "label").el;

      expect(groupComponent.el).is.visible;
      expect(groupComponent.getElement("", "tooltip")).is.null;
      expect(label.textContent?.trim()).to.equal("Dependents");
    });
  });

  describe("field options", () => {
    it("should set tooltip correctly on non-collapsible groups", async () => {
      const formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          fieldOptions: { required: true },
          groupOptions: { collapsible: false },
        },
      ]);

      const label = formComponent
        .getElement("Dependents")
        .getElement("", "label").el;

      expect(label.textContent?.trim()).equal("Dependents *");
    });

    it("should set tooltip correctly on collapsible groups", async () => {
      const formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          fieldOptions: { required: true },
          groupOptions: { collapsible: true },
        },
      ]);

      const label = formComponent
        .getElement("Dependents")
        .el.getAttribute("summary");

      expect(label?.trim()).equal("Dependents *");
    });

    it("should set required correctly", async () => {
      const formComponent = await createNewFormComponent([
        {
          ...defaultData[0],
          fieldOptions: { tooltip: "fill dependents data" },
        },
      ]);

      const tooltip = formComponent
        .getElement("Dependents")
        .getElement("", "tooltip").el;

      expect(tooltip).to.have.attribute("content", "fill dependents data");
    });
  });

  describe("group functionality", () => {
    it('should set the content correctly inthe form object when "collapsible" is true', async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], groupOptions: { collapsible: false } },
      ]);

      const groupContainer = formComponent.getElement("", "group-container");

      const spy = sinon.spy();
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      // Fill in the group fields
      await groupContainer.getInputField("Name").fill("John Doe");
      await groupContainer.getSelectField("Gender").select("Non-Binary");
      await groupContainer.getInputField("18+").toggle();

      // Submit the form
      formComponent.clickSubmitButton();

      // Assert that the spy was called with the correct data
      sinon.assert.calledOnce(spy);
      const { detail } = spy.getCall(0).args[0];
      expect(detail).to.deep.equal({
        form: {
          data: {
            dependents: {
              "18+": true,
              name: "John Doe",
              gender: "nonBinary",
            },
          },
        },
      });
    });

    it('should set the content correctly inthe form object when "collapsible" is true', async () => {
      const formComponent = await createNewFormComponent([
        { ...defaultData[0], groupOptions: { collapsible: true } },
      ]);

      const groupContainer = formComponent.getElement("", "group-container");

      const spy = sinon.spy();
      formComponent.form.addEventListener("ecc-utils-submit", spy);

      // Fill in the group fields
      await groupContainer.getInputField("Name").fill("John Doe");
      await groupContainer.getSelectField("Gender").select("Non-Binary");
      await groupContainer.getInputField("18+").toggle();

      // Submit the form
      formComponent.clickSubmitButton();

      // Assert that the spy was called with the correct data
      sinon.assert.calledOnce(spy);
      const { detail } = spy.getCall(0).args[0];
      expect(detail).to.deep.equal({
        form: {
          data: {
            dependents: {
              "18+": true,
              name: "John Doe",
              gender: "nonBinary",
            },
          },
        },
      });
    });
  });
});

describe("when loading", () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        label: "Name",
        key: "name",
      },
    ]);

    formComponent.form.loading();
    await formComponent.form.updateComplete;
  });

  it("should disable the submit button", async () => {
    expect(formComponent.submitButton().el).has.attribute("disabled");
  });
});

describe("submit button", () => {
  let defaultData: Field[];

  beforeEach(() => {
    defaultData = [
      {
        label: "First Name",
        key: "firstname",
        fieldOptions: {
          required: true,
        },
      },
      {
        label: "Last Name",
        key: "lastname",
      },
      {
        label: "Age",
        key: "age",
        type: "number",
        fieldOptions: {
          required: true,
        },
      },
    ];
  });

  describe("when submit button is clicked", async () => {
    it("should throw an error if the form is empty", async () => {
      const formComponent = await createNewFormComponent([
        {
          label: "Name",
          key: "name",
        },
      ]);

      const formError = sinon.stub(formComponent.form, "error");
      formComponent.clickSubmitButton();

      sinon.assert.calledOnceWithExactly(formError, {
        message: "Form is empty",
      });
    });
  });

  describe("when there are required fields", () => {
    it("should not be disabled if required fields are filled", async () => {
      const formComponent = await createNewFormComponent(defaultData);

      // only filling required fields
      await formComponent.getInputField("First Name").fill();
      await formComponent.getInputField("Age").fill("45");

      expect(formComponent.submitButton().el).to.not.have.attribute("disabled");
    });

    it("should be disabled if even 1 required field is not filled", async () => {
      const formComponent = await createNewFormComponent(defaultData);

      // only filling required fields
      await formComponent.getInputField("Last Name").fill();
      await formComponent.getInputField("Age").fill("45");

      expect(formComponent.submitButton().el).to.have.attribute("disabled");
    });

    it("should be disabled if a required field is filled then cleared", async () => {
      const formComponent = await createNewFormComponent(defaultData);

      // only filling required fields
      await formComponent.getInputField("First Name").fill();
      await formComponent.getInputField("Age").fill("45");
      await formComponent.getInputField("First Name").fill("");

      expect(formComponent.submitButton().el).to.have.attribute("disabled");
    });

    describe("when there is an array", () => {
      let formComponent: FormComponentType;

      beforeEach(async () => {
        formComponent = await createNewFormComponent([
          ...defaultData,
          {
            label: "Other Sinatoriaries",
            key: "signatories",
            type: "array",
            children: defaultData,
            arrayOptions: {
              defaultInstances: 1,
            },
          },
        ]);
      });

      it("should be disabled if required fields are filled and then a new array is added", async () => {
        const inputFields = formComponent.getInputField("", "input", true);

        inputFields.forEach((field) => {
          if (field.el.required) field.fill();
        });

        await formComponent.form.updateComplete;
        expect(formComponent.submitButton().el).not.to.have.attribute(
          "disabled"
        );

        // Adding new array instance
        await formComponent.getButtonElement("", "array-add").click();
        expect(formComponent.submitButton().el).to.have.attribute("disabled");
      });
    });

    // describe('when there is a coll')
  });
});

describe("when form is submitted", () => {
  let defaultData: Field[];

  beforeEach(async () => {
    defaultData = [
      {
        label: "Name",
        key: "name",
      },
    ];
  });

  it("should call the submit function with the correct data", async () => {
    const spy = sinon.spy();
    const formComponent = await createNewFormComponent(defaultData);
    formComponent.form.addEventListener("ecc-utils-submit", spy);

    formComponent.getInputField("Name").fill("David");
    await formComponent.clickSubmitButton();

    // Assert that the spy was called with the correct data
    sinon.assert.calledOnce(spy);
    const { detail } = spy.getCall(0).args[0];
    expect(detail).to.deep.equal({
      form: {
        data: {
          name: "David",
        },
      },
    });
  });
});
