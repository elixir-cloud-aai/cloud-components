import { attr, observable } from "@microsoft/fast-element";
import { FoundationElement, CSSDesignToken } from "@microsoft/fast-foundation";
import {
  createToken,
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

  private storeTokensLocallyForTesting(
    registeredTokenName: string,
    registeredTokenValue: CSSDesignToken<string>
  ) {
    this.locallyStoredTokens[registeredTokenName] = registeredTokenValue;
  }

  connectedCallback() {
    super.connectedCallback();
    registerDesignTokens(this);

    if (!this.config) return;
    let configJSON = this.config;

    if (!isObject(configJSON)) configJSON = JSON.parse(this.config);

    Object.keys(configJSON).forEach((i) => {
      // add case to not register when object name is "default"
      if (isObject(configJSON[i])) {
        Object.keys(configJSON[i]).forEach((j) => {
          const newToken = createToken(`${i}-${j}`);
          setToken(this, configJSON[i][j], newToken);

          this.storeTokensLocallyForTesting(newToken.name, configJSON[i][j]);
        });
      } else {
        const tokenName = camelize(i);
        setToken(this, configJSON[i], allTokens[tokenName]);

        this.storeTokensLocallyForTesting(
          allTokens[tokenName].name,
          configJSON[i]
        );
      }
    });
  }
}
