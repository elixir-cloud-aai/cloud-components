import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import "prismjs";
import "lit-code";

export default class EccUtilsDesignCode extends LitElement {
  static styles = css`{
		#code{
			display: block;
		}
	`;

  @property({ type: String }) code = "";
  @property({ type: String }) language = "YAML";
  @property({ type: Boolean }) lnu = true;

  render() {
    return html`
      <lit-code
        id="code"
        ?linenumbers=${this.lnu}
        noshadow
        language=${this.language}
        code=${this.code}
      >
      </lit-code>
    `;
  }
}
