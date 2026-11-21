/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import { failureDetail, needsReload, statusOf } from "../failure.js";
import { CloudRegistryError } from "../../../providers/index.js";

describe("needsReload", () => {
  it("reloads after unclear outcomes and conflicts only", () => {
    const cases: [number | undefined, boolean][] = [
      [undefined, true],
      [400, false],
      [403, false],
      [404, false],
      [409, true],
      [499, false],
      [500, true],
      [503, true],
    ];
    cases.forEach(([status, expected]) => {
      expect(needsReload(status), String(status)).to.equal(expected);
    });
  });
});

describe("statusOf", () => {
  it("reads a numeric status only", () => {
    expect(statusOf({ status: 403 })).to.equal(403);
    expect(statusOf({ status: "403" })).to.equal(undefined);
    expect(statusOf(null)).to.equal(undefined);
  });
});

describe("failureDetail", () => {
  it("takes the fields of a registry error", () => {
    const err = new CloudRegistryError("Conflict", 409, {
      status: 409,
      title: "Conflict",
      detail: "The service has another URL.",
      code: "verification-mismatch",
    });

    expect(failureDetail("s1", "verify", err, "Failed")).to.deep.include({
      serviceId: "s1",
      action: "verify",
      error: "Conflict",
      status: 409,
      title: "Conflict",
      detail: "The service has another URL.",
      code: "verification-mismatch",
    });
  });

  it("falls back to the detail, a string error and the fallback", () => {
    expect(
      failureDetail("", "load", { detail: "Gone" }, "Failed").error
    ).to.equal("Gone");
    expect(failureDetail("", "load", "Lost", "Failed").error).to.equal("Lost");
    expect(failureDetail("", "load", new Error(""), "Failed").error).to.equal(
      "Failed"
    );
  });
});
