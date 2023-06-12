import { FASTElement, attr, customElement, observable } from "@microsoft/fast-element";
import template from "./search.template";
import styles from "./search.styles";
import React from "react";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";

@customElement({
  name: "search",
  template: template,
  styles: styles,
})
class _Search extends FASTElement {
  @attr
  public title: string = "Search";

  @attr
  public content: string = "Content";


}

export const Accordion = provideReactWrapper(React).wrap(_Search);
