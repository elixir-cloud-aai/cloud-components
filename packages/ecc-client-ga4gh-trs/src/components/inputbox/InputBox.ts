import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import template from "./InputBox.template";
import styles from "./InputBox.styles";
import React from "react";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";

@customElement({
  name: "fast-inputbox",
  template: template,
  styles: styles,
})
export class _Inputbox extends FASTElement {
  @attr
  public search: boolean = false;

  @attr
  public kotik: string = "";

  @attr
  public placeholder: string = "";

  @observable
  public inputValue: string = "";

  public handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.inputValue = target.value;
  }
}

export const InputBox = provideReactWrapper(React).wrap(_Inputbox);
