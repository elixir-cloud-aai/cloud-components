import { LitElement, TemplateResult, html } from "lit";
import { hostStyles } from "../../styles/host.styles.js";
import collectionStyles from "./collection.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";

export default class EccUtilsDesignCollectionHeader extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    collectionStyles,
  ];

  protected render(): TemplateResult {
    return html` <div class="header">
      <slot></slot>
    </div>`;
  }
}
