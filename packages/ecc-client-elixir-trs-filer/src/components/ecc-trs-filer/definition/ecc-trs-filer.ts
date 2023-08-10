import { attr, customElement, FASTElement } from "@microsoft/fast-element";
import { template } from "./ecc-trs-filer.template.js";
import { styles } from "./ecc-trs-filer.styles.js";

@customElement({
  name: "ecc-client-elixir-trs-filer",
  template,
  styles,
})
export class TRSFiler extends FASTElement {
  @attr public baseUrl = "";
  @attr public isOpenModal = false;

  public modalButtonClick = () => {
    this.isOpenModal = true;
    if (this.isOpenModal) {
      const trsFiler = document.querySelector("ecc-client-elixir-trs-filer");
      const trsContainer =
        trsFiler?.shadowRoot?.querySelector(".trs-container");
      const tabPanel = trsContainer?.querySelector("fast-tab-panel");
      setTimeout(() => {
        const modalContainer = tabPanel?.querySelector("fast-dialog");
        const modalDiv = modalContainer?.shadowRoot?.querySelector("div");
        modalDiv?.setAttribute("style", "z-index: 80");
      }, 1);
    }
  };

  public closeModal = () => {
    this.isOpenModal = false;
  };
}
