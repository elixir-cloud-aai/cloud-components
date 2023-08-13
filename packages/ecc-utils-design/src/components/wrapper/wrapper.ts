import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import { registerDesignTokens, setToken } from "../../design-system/index.js";
import allTokens from "../../design-system/tokens.js";

const isObject = (o: unknown) =>
  o instanceof Object && o.constructor === Object;

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export class Wrapper extends FoundationElement {
  // config: handle passing the design system config
  @attr config: any = "";

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
      (el) => el._name && el._name !== ""
    );

    Object.keys(configJSON).forEach((i) => {
      if (isObject(configJSON[i])) {
        const elementName = camelize(i);
        const componentsWithTokenName = componentsNotNamedDefault.filter(
          (el) => el._name === elementName
        );
        componentsWithTokenName.forEach((el) => {
          Object.keys(configJSON[i]).forEach((j) => {
            const tokenName = camelize(j);
            setToken(el, configJSON[i][j], allTokens[tokenName]);
          });
        });
      } else {
        const tokenName = camelize(i);
        setToken(this, configJSON[i], allTokens[tokenName]);
      }
    });
  }
}
