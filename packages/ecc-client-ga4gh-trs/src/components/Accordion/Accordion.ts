import { FASTElement, attr, customElement, observable } from "@microsoft/fast-element";
import template from "./Accordion.template";
import styles from "./Accordion.styles";
import React from "react";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";

@customElement({
  name: "fast-accordion",
  template: template,
  styles: styles,
})
class _Accordion extends FASTElement {
  @attr
  public title: string = "Accordion";

  @attr
  public content: string = "Content";


  connectedCallback() {
    super.connectedCallback();
    this.toggleAccordion();
  }

  toggleAccordion() {
    const accordionHeaders = this.shadowRoot?.querySelectorAll('.accordion-header');

    accordionHeaders?.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            accordionItem?.classList.toggle('active');
        });
    });
  }
}

export const Accordion = provideReactWrapper(React).wrap(_Accordion);
