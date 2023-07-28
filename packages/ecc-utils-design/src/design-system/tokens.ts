import { DesignToken } from "@microsoft/fast-foundation";

export const backgroundColor =
  DesignToken.create<string>("background-color").withDefault("#fff");
export const textColor =
  DesignToken.create<string>("text-color").withDefault("#000");

[backgroundColor, textColor].forEach((token) => {
  token.subscribe({
    handleChange(record: any) {
      console.log(`DesignToken ${token.name} changed:`, record);
    },
  });
});
