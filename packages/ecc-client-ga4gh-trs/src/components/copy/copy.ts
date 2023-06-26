import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./copy.template";
import { styles } from "./copy.styles";

@customElement({
  name: "fast-copy",
  template,
  styles,
})
export class CopyClipboard extends FASTElement {
  @attr value: string;
  @observable text: string;
  @observable copied: boolean = false;

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