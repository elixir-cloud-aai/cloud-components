import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./copy.template.js";
import { styles } from "./copy.styles.js";

@customElement({
  name: "custom-copy",
  template,
  styles,
})
export class CopyClipboard extends FASTElement {
  @attr value: string;

  @observable text: string;

  @observable copied = false;

  connectedCallback() {
    super.connectedCallback();
    this.text = this.value || "";
  }

  async handleCopy() {
    try {
      await navigator.clipboard.writeText(this.value || this.text);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
}
