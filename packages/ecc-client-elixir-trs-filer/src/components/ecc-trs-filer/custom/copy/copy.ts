import {
  attr,
  customElement,
  FASTElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./copy.template.js";
import { styles } from "./copy.styles.js";

/**
 * A custom HTML element that allows text to be copied to the clipboard.
 */
@customElement({
  name: "custom-copy",
  template,
  styles,
})
export class CopyClipboard extends FASTElement {
  /** The text value to be copied */
  @attr value: string;

  /** Flag indicating whether text has been successfully copied */
  @observable copied = false;

  /**
   * Copies text value to clipboard and sets copied flag to true temporarily.
   * @async
   */
  async handleCopy(): Promise<void> {
    if (!this.value) {
      console.warn("No text to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(this.value);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
}
