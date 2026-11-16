/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import * as utils from "./index.js";

// The `./utils` subpath export of the package; test files run in pages of
// their own, so nothing else registers components here
describe("utils entry point", () => {
  it("exports the problem details utilities", () => {
    expect(utils.readProblemDetails).to.be.a("function");
    expect(utils.parseProblemDetails).to.be.a("function");
    expect(utils.mapFieldErrors).to.be.a("function");
    expect(utils.normalizePointer).to.be.a("function");
  });

  it("registers no components", () => {
    ["input", "checkbox", "code", "select"].forEach((name) => {
      expect(customElements.get(`ecc-utils-design-${name}`)).to.equal(
        undefined
      );
    });
  });
});
