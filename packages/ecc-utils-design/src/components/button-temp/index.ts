import { FASTElement, customElement, html, css } from "@microsoft/fast-element";

const template = html`<slot></slot>`;
const styles = css`<style>
  :host[hidden] {
    display: none;
  }
  :host[red] {
    background-color: red;
  }
</style>`;

@customElement({
  name: "button-temp",
  template,
  styles,
  shadowOptions: {
    mode: "closed",
  },
})
export class ButtonTemp extends FASTElement {}
