import { FASTElement, customElement, attr } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import template from "./tesStatusBadge.template.js";
import styles from "./tesStatusBadge.styles.js";

@customElement({
  name: "ecc-tes-status-badge",
  template,
  styles,
})
export default class TESStatusBadge extends FASTElement {
  @attr status = "";

  statusChanged(): void {
    const currElement = this.$fastController.element;
    const specialColor = DesignToken.create<string>("special-color");
    if (this.status === "CANCELLED") {
      specialColor.setValueFor(currElement, "#28a745");
    } else if (this.status === "SYSTEM_ERROR") {
      specialColor.setValueFor(currElement, "#dc3545");
    } else {
      specialColor.setValueFor(currElement, "#007bff");
    }
  }
}
