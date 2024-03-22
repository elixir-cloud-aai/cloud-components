/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

import "../../../dist/components/form/index.js";
import { html, fixture, expect } from "@open-wc/testing";
import sinon from "sinon";
import EccUtilsDesignForm, { Field } from "./index.js";

const getDataTestId = (
  id: string,
  parentElement: Document | Element | ShadowRoot
) => parentElement.querySelector(`[data-testid="${id}"]`);

describe("renders correctly", () => {
  it("returns error when field is empty", async () => {
    try {
      await fixture<EccUtilsDesignForm>(
        html`<ecc-utils-design-form></ecc-utils-design-form>`
      );
    } catch (formError: any & { message: string }) {
      expect(formError).to.be.an("error");
      expect(formError!.message).to.equal(
        "Fields is required & should not be empty array"
      );
    }
  });

  it("works correctly with minimum required fields", async () => {
    const fields: Field[] = [
      {
        key: "name",
        label: "Name",
      },
    ];
    const form = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form .fields="${fields}"></ecc-utils-design-form>`
    );

    // renders correctly
    expect(form).to.be.visible;
    expect(getDataTestId("form-input", form.shadowRoot!)).to.be.visible;

    // throws error when no field is filled
    const formError = sinon.stub(form, "error");
    (
      getDataTestId("form-submit", form.shadowRoot!)! as HTMLButtonElement
    ).click();

    sinon.assert.calledOnceWithExactly(formError, { message: "Form is empty" });
  });

  it("renders error template correctly", async () => {
    const fields: Field[] = [
      {
        key: "name",
        label: "Name",
      },
    ];
    const form = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form .fields="${fields}"></ecc-utils-design-form>`
    );

    form.error({ message: "test error" });
    await form.updateComplete;

    expect(
      getDataTestId("form-error", form.shadowRoot!)
    ).to.be.visible.and.to.contain.text("test error");
  });

  it("renders success template correctly", async () => {
    const fields: Field[] = [
      {
        key: "name",
        label: "Name",
      },
    ];
    const form = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form .fields="${fields}"></ecc-utils-design-form>`
    );

    form.success({ message: "test success" });
    await form.updateComplete;

    expect(
      getDataTestId("form-success", form.shadowRoot!)
    ).to.be.visible.and.to.contain.text("test success");
  });

  // it('renders loading state correctly', async () => {});
});

describe("when loading", () => {
  let form: EccUtilsDesignForm;
  beforeEach(async () => {
    form = await fixture<EccUtilsDesignForm>(
      html`<ecc-utils-design-form
        .fields="${[
          {
            key: "name",
            label: "Name",
          },
        ]}"
      ></ecc-utils-design-form>`
    );

    form.loading();
    await form.updateComplete;
  });

  it("submit button is disabled", async () => {
    expect(getDataTestId("form-submit", form.shadowRoot!)).has.attribute(
      "disabled"
    );
  });
});

describe("when submit button is disabled", () => {
  // beforeEach(async () => {});
  // it("submit action is not triggered on click", async () => {});
});
