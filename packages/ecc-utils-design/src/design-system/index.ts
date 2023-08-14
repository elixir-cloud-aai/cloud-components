import { DesignToken } from "@microsoft/fast-foundation";

export const createToken = (name: string) => DesignToken.create<string>(name);

export const setToken = (
  element: HTMLElement,
  value: string,
  token: DesignToken<string>
) => token.setValueFor(element, value);

export const getToken = (element: HTMLElement, token: DesignToken<string>) =>
  token.getValueFor(element);

export const registerDesignTokens = (element: HTMLElement) => {
  DesignToken.registerRoot(element);
};
