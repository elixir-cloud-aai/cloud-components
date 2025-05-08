import { expect, fixture } from "@open-wc/testing";
import * as _ from "lodash-es";
import sinon from "sinon";
import { html } from "lit";

import "../../../../dist/components/form/index.js";
import EccUtilsDesignFormInput, { FormItemType } from "../formInput.js";

interface inputOptions {
  label?: string;
  type: FormItemType; // we want to force a type to reduce the risk of false positives
  value?: string;
  key?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string;
  protocol?: "native" | "tus";
  endpoint?: string;
  tooltip?: string;
  placeholder?: string;
  multiple?: boolean;
  accept?: string;
}

const createTestFixture = async (options: inputOptions) => {
  const label = options.label || "Test";

  const template = html`<ecc-d-form-input
    type="${options.type}"
    value="${options.value}"
    label="${label || options.type}"
    key="${options.key || options.type}"
    ?required="${options.required}"
    ?disabled="${options.disabled}"
    options="${options.options}"
    protocol="${options.protocol}"
    endpoint="${options.endpoint}"
    tooltip="${options.tooltip}"
    placeholder="${options.placeholder}"
    ?multiple="${options.multiple}"
    accept="${options.accept}"
  ></ecc-d-form-input>`;

  const inputContainer = await fixture<EccUtilsDesignFormInput>(template);
  const inputEl = inputContainer.shadowRoot!.querySelector(
    '[data-testid="input"]'
  ) as HTMLInputElement;
  const labelEl =
    (inputContainer.shadowRoot!.querySelector(
      '[data-testid="label"]'
    ) as HTMLElement) || inputEl;

  const inputSpy = sinon.spy();
  const clearSpy = sinon.spy();
  const changeSpy = sinon.spy();
  const alertSpy = sinon.spy(inputContainer as any, "handleShowAlert");

  inputContainer.addEventListener("ecc-input", inputSpy);
  inputContainer.addEventListener("ecc-clear", clearSpy);
  inputContainer.addEventListener("ecc-change", changeSpy);

  return {
    inputContainer,
    inputEl,
    labelEl,
    inputSpy,
    clearSpy,
    changeSpy,
    alertSpy,
  };
};

describe("form input", async () => {
  afterEach(() => {
    sinon.restore();
    sinon.resetHistory();
  });

  it("should render correctly in default state", async () => {
    const warnSpy = sinon.spy(console, "warn");
    const inputContainer = await fixture<EccUtilsDesignFormInput>(html`
      <ecc-d-form-input label="Name"></ecc-d-form-input>
    `);
    const inputEl = inputContainer.shadowRoot!.querySelector(
      '[data-testid="input"]'
    ) as HTMLInputElement;
    const tooltip = inputContainer.shadowRoot!.querySelector(
      '[data-testid="tooltip"]'
    );

    sinon.assert.calledOnceWithExactly(
      warnSpy,
      "ecc-d-form-input: Key attribute is required. We will auto generate a key from label but cannot guarantee uniqness. To ensure optimal functionality Please add a key for this field: Name"
    );

    expect(tooltip).to.not.exist;
    expect(inputContainer.disabled).to.equal(false);
    expect(inputContainer.placeholder).to.equal("");
    expect(inputContainer.label).to.equal("Name");
    expect(inputContainer.key).to.equal("name");
    expect(inputContainer.type).to.equal("text");

    expect(inputEl).to.be.visible;
    expect(inputEl.value).equal("");
    expect(inputEl.required).equal(false);
    expect(inputEl.tagName).equal("SL-INPUT");
  });

  describe("input type", () => {
    interface TypeTestCase {
      type: string;
      tagName: string;
    }

    const typeTestCases: TypeTestCase[] = [
      { type: "text", tagName: "SL-INPUT" },
      { type: "switch", tagName: "SL-SWITCH" },
      { type: "date", tagName: "SL-INPUT" },
      { type: "number", tagName: "SL-INPUT" },
      { type: "email", tagName: "SL-INPUT" },
      { type: "password", tagName: "SL-INPUT" },
      { type: "tel", tagName: "SL-INPUT" },
      { type: "url", tagName: "SL-INPUT" },
      { type: "search", tagName: "SL-INPUT" },
      { type: "datetime-local", tagName: "SL-INPUT" },
      { type: "time", tagName: "SL-INPUT" },
      { type: "file", tagName: "INPUT" },
      { type: "select", tagName: "SL-SELECT" },
    ];

    typeTestCases.forEach(({ type, tagName }) => {
      it(`should render correct HTML for type="${type}"`, async () => {
        const label = _.capitalize(type);
        const { inputContainer } = await createTestFixture({
          label,
          type: type as FormItemType,
          options: '["option 1", "option 2"]',
        });

        const inputEl = inputContainer.shadowRoot!.querySelector(
          '[data-testid="input"]'
        ) as HTMLInputElement;
        const tooltip = inputContainer.shadowRoot!.querySelector(
          '[data-testid="tooltip"]'
        );

        expect(tooltip).to.not.exist;
        expect(inputEl).to.be.visible;
        expect(inputEl.required).equal(false);
        expect(inputEl.tagName).to.equal(tagName);

        expect(inputContainer.label).to.equal(label);
        expect(inputContainer.key).to.equal(type);
        expect(inputContainer.type).to.equal(type);
        expect(inputContainer.disabled).to.equal(false);
        expect(inputContainer.placeholder).to.equal("");

        if (type === "file") {
          expect(inputContainer.protocol).to.equal("native");
          expect(inputEl.getAttribute("data-type")).to.equal("native");
        }

        if (type === "switch") {
          expect(inputEl.getAttribute("value")).to.be.null;
        } else if (type === "select") {
          expect(inputEl.value).to.equal("");
        } else {
          expect((inputEl as HTMLInputElement).type).to.equal(type);
          expect(inputEl.value).to.equal("");
        }
      });
    });

    it('should render correct options for type="select"', async () => {
      const { inputContainer } = await createTestFixture({
        type: "select",
        key: "gender",
        label: "Gender",
        options: '["Female", "Male", "Do not want to Disclose-none"]',
      });

      const options = inputContainer.shadowRoot!.querySelectorAll(
        '[data-testid="option"]'
      );

      const expectedOptions = [
        { value: "female", label: "Female" },
        { value: "male", label: "Male" },
        { value: "none", label: "Do not want to Disclose" },
      ];

      expectedOptions.forEach((expected, index) => {
        const option = options.item(index) as HTMLElement;
        expect(option.tagName).to.equal("SL-OPTION");
        expect(option.getAttribute("value")).to.equal(expected.value);
        expect(option.textContent?.trim()).to.equal(expected.label);
      });
    });
  });

  describe("input attributes", () => {
    interface AttributeTestCase {
      name: string;
      type: FormItemType;
      label: string;
      key: string;
    }

    const attributeTestCases: AttributeTestCase[] = [
      {
        name: "text type",
        type: "text",
        label: "Name",
        key: "name",
      },
      { name: "date type", type: "date", label: "Birthday", key: "birthday" },
      { name: "number type", type: "number", label: "Age", key: "age" },
      { name: "email type", type: "email", label: "Email", key: "email" },
      {
        name: "password type",
        type: "password",
        label: "Password",
        key: "password",
      },
      {
        name: "tel type",
        type: "tel",
        label: "Phone",
        key: "phone",
      },
      {
        name: "url type",
        type: "url",
        label: "URL",
        key: "url",
      },
      {
        name: "search type",
        type: "search",
        label: "Search",
        key: "search",
      },
      {
        name: "datetime-local type",
        type: "datetime-local",
        label: "Date and Time",
        key: "datetime",
      },
      {
        name: "time type",
        type: "time",
        label: "Time",
        key: "time",
      },
      {
        name: "switch type",
        type: "switch",
        label: "18+",
        key: "18+",
      },
      {
        name: "file input type",
        type: "file",
        label: "ID",
        key: "ID",
      },
      {
        name: "select type",
        type: "select",
        label: "Gender",
        key: "gender",
      },
    ];

    attributeTestCases.forEach(({ name, type, label, key }) => {
      it(`should set attributes correctly for ${name}`, async () => {
        const { inputContainer, inputEl, labelEl } = await createTestFixture({
          label,
          key,
          type,
          disabled: true,
          tooltip: name,
          required: true,
          options: '["option 1", "option 2"]',
        });

        const tooltip = inputContainer.shadowRoot!.querySelector(
          '[data-testid="tooltip"]'
        );

        expect(tooltip?.getAttribute("content")).to.equal(name);
        expect(labelEl.textContent?.trim().replace(" *", "")).to.equal(label);

        expect(inputContainer.key).to.equal(key);
        expect(inputEl.disabled).to.equal(true);
        expect(inputEl.required).to.equal(true);
      });
    });

    interface ValuePlaceholderTestCase {
      type: FormItemType;
      value: string;
      placeholder: string;
    }

    const valueAndPlaceholderTestCases: ValuePlaceholderTestCase[] = [
      { type: "text", value: "David", placeholder: "Enter your name" },
      { type: "date", value: "1990-01-01", placeholder: "Select a date" },
      { type: "number", value: "25", placeholder: "Enter your Age" },
      {
        type: "email",
        value: "test@gmail.com",
        placeholder: "Enter a valid email",
      },
      {
        type: "password",
        value: "my-old-password",
        placeholder: "Enter a strong password",
      },
      {
        type: "tel",
        value: "+1-541-754-3010",
        placeholder: "Enter a valid phone number",
      },
      {
        type: "url",
        value: "www.website.com",
        placeholder: "Enter a valid url",
      },
      {
        type: "search",
        value: "a random search",
        placeholder: "what are you looking for?",
      },
      {
        type: "time",
        value: "00:00:00",
        placeholder: "enter a time in the following format: 00:00:00",
      },
    ];

    valueAndPlaceholderTestCases.forEach(({ type, value, placeholder }) => {
      it(`should set value and placeholder correctly for ${type} input`, async () => {
        const { inputEl } = await createTestFixture({
          label: _.capitalize(type),
          key: type,
          type,
          value,
          placeholder,
        });

        expect(inputEl.value).to.equal(value);
        expect(inputEl.placeholder).to.equal(placeholder);
      });
    });

    it("should set switch checked attribute correctly", async () => {
      const { inputEl } = await createTestFixture({
        type: "switch",
        label: "18+",
        key: "18+",
        value: "true",
      });

      expect(inputEl).to.have.attribute("Checked");
    });

    it("should set file input attributes correctly", async () => {
      const { inputEl, inputContainer } = await createTestFixture({
        type: "file",
        label: "File Input",
        key: "fileInput",
        multiple: true,
        accept: ".png,.jpg,.jpeg",
        protocol: "tus",
      });

      expect(inputEl).to.have.attribute("multiple");
      expect(inputEl.accept).to.equal(".png,.jpg,.jpeg");
      expect(inputEl.getAttribute("data-type")).to.equal("tus");

      expect(inputContainer.protocol).to.equal("tus");
    });
  });

  describe("input methods", async () => {
    interface alertTestCase {
      text?: string;
      type?: string;
    }

    const standardInputs = [
      { type: "text", invalid: "", value: "David" },
      { type: "email", invalid: "invalid", value: "test@example.com" },
      { type: "password", invalid: "", value: "password123" },
      { type: "search", invalid: "", value: "search term" },
      { type: "tel", invalid: "", value: "123-456-7890" },
      { type: "url", invalid: "invalid", value: "https://example.com" },
      { type: "number", invalid: "invalid", value: "42" },
    ];

    const dateTimeInputs = [
      { type: "date", invalid: "invalid", value: "2023-05-15" },
      {
        type: "datetime-local",
        invalid: "invalid",
        value: "2023-05-15T14:30",
      },
      { type: "time", invalid: "invalid", value: "14:30" },
    ];

    const alertTestCases: alertTestCase[] = [
      {}, // default state
      { type: "error", text: "some error" },
      { type: "info", text: "some info" },
      { type: "success", text: "some success" },
      { type: "warning", text: "some warning" },
    ];

    alertTestCases.forEach(({ type, text }) => {
      it("handleShowAlert", async () => {
        const { inputContainer } = (await createTestFixture({
          type: "text",
        })) as any;

        inputContainer.handleShowAlert(type, text);
        await inputContainer.updateComplete;

        const alert = inputContainer.shadowRoot!.querySelector(
          '[data-testid="alert"]'
        );

        if (!type && !text) {
          expect(inputContainer.alertType).to.equal("info");
          expect(alert.textContent.trim()).to.equal("Something went wrong");
        } else {
          expect(inputContainer.alertType).to.equal(type);
          expect(alert.textContent.trim()).to.equal(text);
        }

        expect(inputContainer.showAlert).to.equal(true);
        expect(alert).to.have.attribute("open");
      });

      it("handleDismissAlert", async () => {
        const { inputContainer } = (await createTestFixture({
          type: "text",
        })) as any;

        inputContainer.handleShowAlert(type, text);
        await inputContainer.updateComplete;

        const alert = inputContainer.shadowRoot!.querySelector(
          '[data-testid="alert"]'
        );
        alert.click();
        await inputContainer.updateComplete;

        expect(alert).not.to.have.attribute("open");
        expect(inputContainer.showAlert).to.equal(false);
      });
    });

    it("handle clear", async () => {
      const { inputContainer, inputEl, inputSpy, clearSpy, changeSpy } =
        await createTestFixture({ label: "Name", key: "name", type: "text" });

      inputEl.value = "new value";
      (inputContainer as any).handleClear();

      [inputSpy, clearSpy, changeSpy].forEach((spy) => {
        sinon.assert.calledOnce(spy);

        const eventDetail = spy.args[0][0].detail;
        expect(eventDetail).to.deep.equal({
          key: "name",
          value: "",
          path: "name",
          target: inputContainer,
        });
      });
    });

    describe("input validity methods", () => {
      // for these tests we don't really care what the value of the validity method is, we can assume that it is working correctly since the underlying element is a native element
      // we just want to make sure that whenever something can affect the validity, our validtiy methods always match the underlying native element
      const assertValidity = (inputContainer: any, inputEl: any) => {
        ["checkValidity", "reportValidity"].forEach((method) => {
          expect(inputContainer[method]()).to.equal(inputEl[method]());
        });
      };

      standardInputs.forEach(({ type, invalid, value }) => {
        it(`${type} input: component validity should match input element validity`, async () => {
          // Create component with required attribute
          const { inputContainer } = await createTestFixture({
            type: type as FormItemType,
            required: true,
          });

          const inputEl = inputContainer.shadowRoot!.querySelector(
            '[data-testid="input"]'
          ) as HTMLInputElement;

          // Test empty state (should be invalid when required)
          assertValidity(inputContainer, inputEl);

          // Test with invalid value
          inputContainer.value = invalid;
          await inputContainer.updateComplete;
          assertValidity(inputContainer, inputEl);

          // Test with valid value
          inputContainer.value = value;
          await inputContainer.updateComplete;
          assertValidity(inputContainer, inputEl);
        });
      });

      dateTimeInputs.forEach(({ type, invalid, value }) => {
        it(`${type} input: component validity should match input element validity`, async () => {
          const { inputContainer, inputEl } = await createTestFixture({
            type: type as FormItemType,
            required: true,
          });

          // Test empty state
          assertValidity(inputContainer, inputEl);

          // Test with invalid value
          inputContainer.value = invalid;
          await inputContainer.updateComplete;
          assertValidity(inputContainer, inputEl);

          // Test with valid value
          inputContainer.value = value;
          await inputContainer.updateComplete;
          assertValidity(inputContainer, inputEl);
        });
      });

      // Group 3: Special inputs that need custom handling
      it("switch input: component validity should match input element validity", async () => {
        const { inputContainer, inputEl } = await createTestFixture({
          type: "switch",
        });

        assertValidity(inputContainer, inputEl);

        // Test checked state
        inputContainer.value = true;
        await inputContainer.updateComplete;
        assertValidity(inputContainer, inputEl);
      });

      it("select input: component validity should match input element validity", async () => {
        const { inputContainer, inputEl } = await createTestFixture({
          type: "select",
          options: '["Option 1", "Option 2"]',
        });

        // Test empty selection
        assertValidity(inputContainer, inputEl);

        // Test with selection
        inputContainer.value = "option1";
        await inputContainer.updateComplete;
        assertValidity(inputContainer, inputEl);
      });

      it("file input: component validity should match input element validity", async () => {
        const { inputContainer, inputEl } = await createTestFixture({
          type: "file",
        });

        // Test with no file selected
        assertValidity(inputContainer, inputEl);

        const file = new File(["dummy content"], "dummy.txt", {
          type: "text/plain",
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputEl.files = dataTransfer.files;
        await inputContainer.updateComplete;

        // Test with file selected
        assertValidity(inputContainer, inputEl);
      });
    });

    describe("handleValueUpdate", () => {
      const inputs = [
        ...standardInputs,
        ...dateTimeInputs,
        { type: "switch", value: true },
        { type: "select", value: "option1" },
      ];

      inputs.forEach(({ type, value }) => {
        it(`it should call handleValueUpdate correctly for input type: ${type}`, async () => {
          const inputSpy = sinon.spy();

          const { inputContainer, inputEl } = await createTestFixture({
            type: type as FormItemType,
            options: '["Option 1", "Option 2"]',
          });

          inputContainer.addEventListener("ecc-input", inputSpy);
          if (type === "switch") {
            inputEl.checked = value as boolean;
          } else {
            inputEl.value = value as string;
          }
          inputEl.dispatchEvent(new CustomEvent("sl-input"));
          await inputContainer.updateComplete;

          const eventDetail = inputSpy.args[0][0].detail;
          sinon.assert.calledOnce(inputSpy);
          expect(inputContainer.value).to.equal(value);
          expect(eventDetail).to.deep.equal({
            key: type,
            value: value,
            path: type,
            target: inputContainer,
          });
        });
      });
    });

    describe("handleFileUpload", () => {
      const uploadDummyFile = async (
        inputContainer: EccUtilsDesignFormInput,
        opt = {
          empty: false,
        }
      ) => {
        const inputEl = inputContainer.shadowRoot!.querySelector(
          '[data-testid="input"]'
        ) as HTMLInputElement;

        if (opt.empty) {
          inputEl.files = null;
        } else {
          const file = new File(["dummy content"], "dummy.txt", {
            type: "text/plain",
          });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputEl.files = dataTransfer.files;
        }

        inputEl.dispatchEvent(new CustomEvent("change"));
        await inputContainer.updateComplete;

        return inputEl.files;
      };

      describe("native file upload", async () => {
        afterEach(() => {
          sinon.restore();
          sinon.resetHistory();
        });

        it("should show error alert if no file is selected", async () => {
          const { inputContainer, alertSpy, inputSpy } =
            await createTestFixture({ type: "file", protocol: "native" });
          await uploadDummyFile(inputContainer, { empty: true });

          sinon.assert.calledOnceWithExactly(
            alertSpy,
            "error",
            "No file selected for upload."
          );
          sinon.assert.notCalled(inputSpy);
        });

        it("should handle native file upload correctly", async () => {
          const { inputContainer, inputSpy } = await createTestFixture({
            type: "file",
            protocol: "native",
          });

          const files = await uploadDummyFile(inputContainer);
          const eventDetail = inputSpy.args[0][0].detail;

          sinon.assert.calledOnce(inputSpy);
          expect(inputContainer.value[0]).to.deep.equal(files?.[0]);
          expect(eventDetail).to.deep.equal({
            key: "file",
            value: files,
            path: "file",
            target: inputContainer,
          });
        });
      });

      describe("tus file upload", async () => {
        const createFakeUploadClass = (opt: { resolve: boolean }) => {
          return class FakeUpload {
            file: File;
            start: sinon.SinonStub;
            resumeFromPreviousUpload: sinon.SinonStub;
            findPreviousUploads: sinon.SinonStub;

            constructor(file: File, options: any) {
              this.file = file;
              this.start = sinon.stub().callsFake(() => {
                opt.resolve
                  ? options.onSuccess()
                  : options.onError({ message: "a dummy error" });
              });
              this.resumeFromPreviousUpload = sinon.stub();
              this.findPreviousUploads = sinon.stub().resolves([]);
            }
          };
        };

        afterEach(() => {
          sinon.restore();
          sinon.resetHistory();
        });

        it("should show error alert if no file is selected", async () => {
          const { inputContainer, inputSpy, alertSpy } =
            await createTestFixture({
              type: "file",
              protocol: "tus",
              endpoint: "https://url.com",
            });
          await uploadDummyFile(inputContainer, { empty: true });

          sinon.assert.calledOnceWithExactly(
            alertSpy,
            "error",
            "No file selected for upload."
          );
          sinon.assert.notCalled(inputSpy);
        });

        it("should show error alert when there is no tus endpoint", async () => {
          const { inputContainer, inputSpy, alertSpy } =
            await createTestFixture({ type: "file", protocol: "tus" });

          await uploadDummyFile(inputContainer);
          sinon.assert.calledOnceWithExactly(
            alertSpy,
            "error",
            "No tus endpoint provided for tus uploads"
          );
          sinon.assert.notCalled(inputSpy);
        });

        it("should upload correctly when there is a tus enpoint and no errors", async () => {
          const { inputContainer, inputSpy } = await createTestFixture({
            type: "file",
            protocol: "tus",
            endpoint: "https://url.com",
          });

          sinon.stub(inputContainer as any, "importClient").resolves({
            Upload: createFakeUploadClass({ resolve: true }),
          });

          const files = await uploadDummyFile(inputContainer);
          sinon.assert.calledOnce(inputSpy);
          expect(inputContainer.value).to.deep.equal([files?.[0]]);
        });

        it("should show an error alert when the upload fails", async () => {
          const { inputContainer, inputSpy, alertSpy } =
            await createTestFixture({
              type: "file",
              protocol: "tus",
              endpoint: "https://url.com",
            });

          sinon.stub(inputContainer as any, "importClient").resolves({
            Upload: createFakeUploadClass({ resolve: false }),
          });

          await uploadDummyFile(inputContainer);
          sinon.assert.notCalled(inputSpy);
          sinon.assert.calledWithExactly(
            alertSpy,
            "error",
            `Upload failed: a dummy error`
          );
        });
      });
    });
  });
});
