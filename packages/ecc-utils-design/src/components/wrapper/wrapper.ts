import { attr, observable } from "@microsoft/fast-element";
import { FoundationElement, CSSDesignToken } from "@microsoft/fast-foundation";
import {
  defaultComponentName,
  registerDesignTokens,
  setToken,
} from "../../design-system/index.js";
import allTokens from "../../design-system/tokens.js";

const isObject = (o: unknown) =>
  o instanceof Object && o.constructor === Object;

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export class Wrapper extends FoundationElement {
  // config: handle passing the design system config
  @attr config: any = "";
  @observable locallyStoredTokens: Record<string, CSSDesignToken<string>> = {};

  connectedCallback() {
    super.connectedCallback();
    registerDesignTokens(this);
  }

  handleSlotChange() {
    const childComponents: any[] = Array.from(this.children);

    if (!this.config) return;
    let configJSON = this.config;

    if (!isObject(configJSON)) configJSON = JSON.parse(this.config);
    const componentsNotNamedDefault = childComponents.filter(
      (el) => el._name && el._name !== defaultComponentName
    );

    const componentsNamedDefault = childComponents.filter(
      (el) => el.name === defaultComponentName
    );

    Object.keys(configJSON).forEach((i) => {
      if (isObject(configJSON[i]) && i !== defaultComponentName) {
        Object.keys(configJSON[i]).forEach((j) => {
          componentsNotNamedDefault.forEach((el) => {
            const tokenName = camelize(j);

            setToken(el, configJSON[el._name][j], allTokens[tokenName]);
          });
        });
      } else if (i === defaultComponentName) {
        Object.keys(configJSON[i]).forEach((j) => {
          componentsNamedDefault.forEach((el) => {
            const tokenName = camelize(j);

            setToken(el, configJSON.default[j], allTokens[tokenName]);
          });
        });
      } else {
        componentsNamedDefault.forEach((el) => {
          const tokenName = camelize(i);

          setToken(el, configJSON[i], allTokens[tokenName]);
        });
      }
    });
  }
}
