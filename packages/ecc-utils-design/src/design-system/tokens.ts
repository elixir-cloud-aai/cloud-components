import { DesignToken } from "@microsoft/fast-foundation";

export const color = DesignToken.create<string>("color").withDefault("#000000");
const subscriber = {
  handleChange(record: any) {
    console.log(`DesignToken token changed!`, record);
  },
};
color.subscribe(subscriber);
