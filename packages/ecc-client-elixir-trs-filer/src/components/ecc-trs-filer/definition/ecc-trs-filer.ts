import { customElement, FASTElement } from "@microsoft/fast-element";
import { template } from "./ecc-trs-filer.template.js";
import { styles } from "./ecc-trs-filer.styles.js";

@customElement({
  name: "ecc-client-elixir-trs-filer",
  template,
  styles,
})
export class TRS extends FASTElement {}
