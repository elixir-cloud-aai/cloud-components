/* eslint-disable import/no-extraneous-dependencies, no-script-url */
import { expect } from "@open-wc/testing";
import {
  isExternal,
  isSameOrigin,
  mailtoHref,
  safeEmbedSrc,
  safeHref,
} from "../urls.js";

describe("URL checks", () => {
  it("allows only safe links", () => {
    expect(safeHref(" https://example.org/a ")).to.equal(
      "https://example.org/a"
    );
    expect(safeHref("/privacy")).to.equal("/privacy");
    expect(safeHref("mailto:dpo@example.org")).to.equal(
      "mailto:dpo@example.org"
    );
    expect(safeHref("javascript:alert(1)")).to.equal(undefined);
    expect(safeHref("\u0001javascript:alert(1)")).to.equal(undefined);
    expect(safeHref("data:text/html,x")).to.equal(undefined);
    expect(safeHref("")).to.equal(undefined);
    expect(safeHref(42)).to.equal(undefined);
  });

  it("embeds only https, and http on localhost", () => {
    expect(safeEmbedSrc("https://policies.example.org/p")).to.equal(
      "https://policies.example.org/p"
    );
    expect(safeEmbedSrc("http://localhost:8080/p")).to.equal(
      "http://localhost:8080/p"
    );
    expect(safeEmbedSrc("http://example.org/p")).to.equal(undefined);
    expect(safeEmbedSrc("javascript:alert(1)")).to.equal(undefined);
    expect(safeEmbedSrc(undefined)).to.equal(undefined);
  });

  it("builds mailto links only for plain addresses", () => {
    expect(mailtoHref("dpo@example.org", "Data & you")).to.equal(
      "mailto:dpo@example.org?subject=Data%20%26%20you"
    );
    expect(mailtoHref("first.last+tag@sub.example.org")).to.equal(
      "mailto:first.last+tag@sub.example.org"
    );
    expect(mailtoHref("a%0D%0ABcc:evil@example.org")).to.equal(undefined);
    expect(mailtoHref("a@example.org?cc=evil@example.org")).to.equal(undefined);
    expect(mailtoHref("a@example.org,evil@example.org")).to.equal(undefined);
    expect(mailtoHref("not an address")).to.equal(undefined);
  });

  it("tells external and same-origin URLs apart", () => {
    expect(isExternal("https://other.example.org/")).to.equal(true);
    expect(isExternal("/privacy")).to.equal(false);
    expect(isExternal("mailto:dpo@example.org")).to.equal(false);
    expect(isSameOrigin("/legal/privacy")).to.equal(true);
    expect(isSameOrigin("https://other.example.org/")).to.equal(false);
  });
});
