import { FASTElement, attr, customElement } from "@microsoft/fast-element";
import template from "./tesGetRun.template.js";
import styles from "./tesGetRun.styles.js";

@customElement({
  name: "ecc-tes-get-run",
  template,
  styles,
  shadowOptions: { mode: "open" },
})
export default class TESGetRun extends FASTElement {
  @attr id = "";

  @attr state = "";

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  handleClick = () => {
    console.log("Clicked element:", this.id);
    // Todo : extended run tast view
  };
}
