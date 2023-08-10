import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";

export const backgroundColor = DesignToken.create<string>(
  "default-background-color"
).withDefault("#fff");
export const textColor =
  DesignToken.create<string>("default-text-color").withDefault("#000");

[backgroundColor, textColor].forEach((token) => {
  token.subscribe({
    handleChange(record: any) {
      console.log(`DesignToken ${token.name} changed:`, record);
    },
  });
});

const allTokens: Record<string, CSSDesignToken<string>> = {
  backgroundColor,
  textColor,
};

export default allTokens;
