import { FASTElement, customElement } from "@microsoft/fast-element";
import template from "./tesLoader.template.js";
import styles from "./tesLoader.styles.js";

@customElement({
  name: "ecc-tes-loader",
  template,
  styles,
})
export default class TESLoader extends FASTElement {}
