/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from "@open-wc/testing";
import "./index.js";
import type { EccUtilsDesignCode } from "./code.js";
import { ACE_THEME } from "./ace-theme.js";

describe("EccUtilsDesignCode deprecated theme API", () => {
  it("isDarkMode() reports the color scheme set by dark mode", async () => {
    const light = await fixture<EccUtilsDesignCode>(html`
      <ecc-utils-design-code value="{}"></ecc-utils-design-code>
    `);
    const dark = await fixture<EccUtilsDesignCode>(html`
      <ecc-utils-design-code dark value="{}"></ecc-utils-design-code>
    `);
    expect(light.isDarkMode()).to.equal(false);
    expect(dark.isDarkMode()).to.equal(true);
  });

  it("updateEditorTheme() keeps the token-driven theme", async () => {
    const el = await fixture<EccUtilsDesignCode>(html`
      <ecc-utils-design-code dark value="{}"></ecc-utils-design-code>
    `);
    el.editor.setTheme("ace/theme/textmate");
    el.updateEditorTheme();
    expect(el.editor.getTheme()).to.equal(ACE_THEME);
  });

  it("setupThemeObserver() keeps the token-driven theme", async () => {
    const el = await fixture<EccUtilsDesignCode>(html`
      <ecc-utils-design-code value="{}"></ecc-utils-design-code>
    `);
    el.editor.setTheme("ace/theme/textmate");
    el.setupThemeObserver();
    expect(el.editor.getTheme()).to.equal(ACE_THEME);
  });
});
