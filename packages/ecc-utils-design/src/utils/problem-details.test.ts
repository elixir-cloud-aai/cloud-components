/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import {
  mapFieldErrors,
  normalizePointer,
  parseProblemDetails,
  readProblemDetails,
} from "./index.js";

// The example of RFC 9457, section 3, with FOCA's `code` members
const RFC_EXAMPLE = {
  type: "https://example.net/validation-error",
  title: "Your request is not valid.",
  status: 400,
  code: "invalid-request",
  errors: [
    {
      detail: "must be a positive integer",
      pointer: "#/age",
      code: "too-small",
    },
    {
      detail: "must be 'green', 'red' or 'blue'",
      pointer: "#/profile/color",
    },
  ],
};

describe("normalizePointer()", () => {
  it("accepts URI fragments and plain pointers", () => {
    expect(normalizePointer("#/organization/url")).to.equal(
      "/organization/url"
    );
    expect(normalizePointer("/organization/url")).to.equal("/organization/url");
    expect(normalizePointer("#")).to.equal("");
    expect(normalizePointer("")).to.equal("");
  });

  it("decodes percent-encoded fragments and keeps RFC 6901 escapes", () => {
    expect(normalizePointer("#/a%20b/c~1d")).to.equal("/a b/c~1d");
  });

  it("rejects what isn't a pointer", () => {
    expect(normalizePointer("organization/url")).to.equal(undefined);
    expect(normalizePointer("#organization")).to.equal(undefined);
    expect(normalizePointer("#/%E0%A4%A")).to.equal(undefined);
  });
});

describe("parseProblemDetails()", () => {
  it("parses the standard members, errors and extensions", () => {
    const problem = parseProblemDetails({
      ...RFC_EXAMPLE,
      detail: "Invalid fields",
      instance: "/requests/1",
    });
    expect(problem).to.deep.include({
      type: RFC_EXAMPLE.type,
      title: RFC_EXAMPLE.title,
      status: 400,
      detail: "Invalid fields",
      instance: "/requests/1",
      extensions: { code: "invalid-request" },
    });
    expect(
      problem?.errors.map(({ detail, pointer, code }) => ({
        detail,
        pointer,
        code,
      }))
    ).to.deep.equal([
      {
        detail: "must be a positive integer",
        pointer: "/age",
        code: "too-small",
      },
      {
        detail: "must be 'green', 'red' or 'blue'",
        pointer: "/profile/color",
        code: undefined,
      },
    ]);
    expect(problem?.errors[0].raw).to.equal(RFC_EXAMPLE.errors[0]);
  });

  it("accepts parameters and plain pointers", () => {
    const problem = parseProblemDetails({
      status: 400,
      errors: [
        { detail: "Must be at most 10.", parameter: "limit" },
        { detail: "Is required.", pointer: "/url" },
      ],
    });
    expect(problem?.errors[0].parameter).to.equal("limit");
    expect(problem?.errors[0].pointer).to.equal(undefined);
    expect(problem?.errors[1].pointer).to.equal("/url");
  });

  it("defaults the type and ignores members of the wrong type", () => {
    const problem = parseProblemDetails({
      title: 1,
      status: "400",
      detail: "Bad",
      errors: "none",
    });
    expect(problem).to.deep.include({
      type: "about:blank",
      title: undefined,
      status: undefined,
      detail: "Bad",
      errors: [],
    });
  });

  it("skips entries without a readable detail", () => {
    const problem = parseProblemDetails({
      errors: [null, "x", { pointer: "#/a" }, { detail: "", pointer: "#/a" }],
    });
    expect(problem?.errors).to.deep.equal([]);
  });

  it("keeps entries with an invalid pointer, without a location", () => {
    const problem = parseProblemDetails({
      errors: [{ detail: "Bad.", pointer: "a" }],
    });
    expect(problem?.errors[0].pointer).to.equal(undefined);
    expect(problem?.errors[0].parameter).to.equal(undefined);
  });

  it("returns undefined for bodies that aren't problem details", () => {
    expect(parseProblemDetails(undefined)).to.equal(undefined);
    expect(parseProblemDetails("Bad Request")).to.equal(undefined);
    expect(parseProblemDetails([RFC_EXAMPLE])).to.equal(undefined);
    expect(parseProblemDetails({ message: "Bad" })).to.equal(undefined);
  });
});

describe("readProblemDetails()", () => {
  const response = (body: string, contentType: string) =>
    new Response(body, {
      status: 400,
      headers: { "Content-Type": contentType },
    });

  it("reads problem+json and JSON bodies", async () => {
    const body = JSON.stringify(RFC_EXAMPLE);
    const problem = await readProblemDetails(
      response(body, "application/problem+json; charset=utf-8")
    );
    expect(problem?.errors).to.have.length(2);
    expect(
      await readProblemDetails(response(body, "application/json"))
    ).to.not.equal(undefined);
  });

  it("returns undefined for other bodies", async () => {
    expect(
      await readProblemDetails(response("Bad Request", "text/plain"))
    ).to.equal(undefined);
    expect(
      await readProblemDetails(response("{not json", "application/json"))
    ).to.equal(undefined);
  });
});

describe("mapFieldErrors()", () => {
  const fields = {
    age: "#/age",
    color: "/profile/color",
    tags: "/tags",
    limit: { parameter: "limit" },
    url: { pointer: "#/url" },
  };

  it("maps errors to fields by pointer", () => {
    const mapped = mapFieldErrors(RFC_EXAMPLE, fields);
    expect(mapped.fieldErrors).to.deep.equal({
      age: "must be a positive integer",
      color: "must be 'green', 'red' or 'blue'",
    });
    expect(mapped.unmatched).to.deep.equal([]);
    expect(mapped.generalError).to.equal(undefined);
    expect(mapped.problem?.extensions.code).to.equal("invalid-request");
  });

  it("maps parameters, object locations and contained fields", () => {
    const mapped = mapFieldErrors(
      {
        errors: [
          { detail: "Too large.", parameter: "limit" },
          { detail: "Is required.", pointer: "#/url" },
          { detail: "Too long.", pointer: "#/tags/0" },
          { detail: "Duplicate.", pointer: "#/tags/1" },
        ],
      },
      fields
    );
    expect(mapped.fieldErrors).to.deep.equal({
      limit: "Too large.",
      url: "Is required.",
      tags: "Too long. Duplicate.",
    });
    expect(mapped.generalError).to.equal(undefined);
  });

  it("prefers the closest containing field", () => {
    const mapped = mapFieldErrors(
      { errors: [{ detail: "Bad.", pointer: "#/a/b/c" }] },
      { a: "/a", ab: "/a/b", abc2: "/a/bc" }
    );
    expect(mapped.fieldErrors).to.deep.equal({ ab: "Bad." });
  });

  it("reports unknown pointers and parameters as a general error", () => {
    const mapped = mapFieldErrors(
      {
        detail: "Invalid fields",
        errors: [
          { detail: "Is required.", pointer: "#/age" },
          { detail: "Unknown.", pointer: "#/organization/url" },
          { detail: "Unknown parameter.", parameter: "page" },
          { detail: "Not an object.", pointer: "#" },
          { detail: "Somewhere.", pointer: "nowhere" },
        ],
      },
      fields
    );
    expect(mapped.fieldErrors).to.deep.equal({ age: "Is required." });
    expect(mapped.unmatched).to.have.length(4);
    expect(mapped.generalError).to.equal(
      "organization/url: Unknown. page: Unknown parameter. Not an object. Somewhere."
    );
  });

  it("doesn't map body errors to parameters or vice versa", () => {
    const mapped = mapFieldErrors(
      {
        errors: [
          { detail: "A.", pointer: "#/limit" },
          { detail: "B.", parameter: "age" },
        ],
      },
      fields
    );
    expect(mapped.fieldErrors).to.deep.equal({});
    expect(mapped.unmatched).to.have.length(2);
  });

  it("ignores fields with invalid locations", () => {
    const mapped = mapFieldErrors(
      { errors: [{ detail: "A.", pointer: "#/age" }] },
      { age: "age", other: { pointer: "x" } }
    );
    expect(mapped.fieldErrors).to.deep.equal({});
    expect(mapped.generalError).to.equal("age: A.");
  });

  it("falls back to detail, title or the fallback without errors", () => {
    expect(
      mapFieldErrors({ title: "Bad Request", detail: "No." }, fields)
        .generalError
    ).to.equal("No.");
    expect(
      mapFieldErrors({ title: "Bad Request", errors: [] }, fields).generalError
    ).to.equal("Bad Request");
    expect(mapFieldErrors({ status: 500 }, fields).generalError).to.equal(
      "The request failed."
    );
    const notProblem = mapFieldErrors("Internal Server Error", fields, "Oops.");
    expect(notProblem.problem).to.equal(undefined);
    expect(notProblem.generalError).to.equal("Oops.");
    expect(mapFieldErrors(undefined, fields).generalError).to.equal(
      "The request failed."
    );
  });

  it("accepts problem details parsed already", () => {
    const problem = parseProblemDetails(RFC_EXAMPLE);
    const mapped = mapFieldErrors(problem, fields);
    expect(mapped.problem).to.equal(problem);
    expect(mapped.fieldErrors.age).to.equal("must be a positive integer");
  });
});
