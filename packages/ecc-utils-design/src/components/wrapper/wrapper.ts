import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import { setToken } from "../../design-system/index.js";
import allTokens from "../../design-system/tokens.js";

const isObject = (o: unknown) =>
  o instanceof Object && o.constructor === Object;

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export class Wrapper extends FoundationElement {
  // config: handle passing the design system config
  @attr config: any = "";
  @attr name = "";

  handleSlotChange() {
    if (!this.config) return;

    const configJSON = isObject(this.config)
      ? this.config
      : JSON.parse(this.config);
    const childComponents: any[] = Array.from(this.querySelectorAll("*"));
    const componentsNotNamedDefault = childComponents.filter(
      (el) => el._name && el._name !== ""
    );

    Object.keys(configJSON).forEach((i) => {
      if (isObject(configJSON[i])) {
        const customName = camelize(i);
        const componentsWithCustomName = componentsNotNamedDefault.filter(
          (el) => el._name === customName
        );
        componentsWithCustomName.forEach((el) => {
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
