import { template } from "./wrapper.template.js";
import { styles } from "./wrapper.styles.js";

export const definition = {
  baseName: "wrapper",
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
};
