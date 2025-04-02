import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-github.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import * as _ from "lodash-es";
import codeStyles from "./code.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import { hostStyles } from "../../styles/host.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";

export type Language = "yaml" | "json" | "xml" | "makefile" | "sh";

/**
 * @element ecc-d-code
 * @summary A code editor component with syntax highlighting and language support.
 * @description
 * The `ecc-d-code` component provides a code editor with syntax highlighting using Ace Editor.
 * It supports multiple programming languages and can be configured as read-only.
 * The component displays a header with a label and language tag above the editor.
 *
 * @property {String} value - The code content to display and edit
 * @property {String} label - The label displayed in the header (defaults to "Code block")
 * @property {Language} language - The programming language for syntax highlighting (defaults to "json")
 * @property {Boolean} disabled - Whether the editor is read-only
 *
 * @state {Object} editor - Reference to the Ace editor instance
 *
 * @method firstUpdated - Lifecycle method called after first update
 * @method updated - Lifecycle method called after the component updates
 *
 * @private {method} initializeAceEditor - Sets up the Ace editor instance
 * @private {method} setEditorLanguage - Sets the language mode for the editor
 *
 * @event ecc-change - Fired when the code content changes. Detail contains: {value}
 *
 * @dependency ace-builds - Uses Ace Editor for code editing and syntax highlighting
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export default class EccDCode extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    codeStyles,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) label = "Code block";
  @property({ type: String }) language: Language = "json";
  @property({ type: Boolean }) disabled = false;

  @state() editor: any;

  firstUpdated() {
    this.initializeAceEditor();
  }

  async initializeAceEditor() {
    const editorElement = this.shadowRoot?.getElementById("editor");
    if (editorElement) {
      const { ace } = window as any;
      ace.config.set(
        "workerPath",
        `https://cdn.jsdelivr.net/npm/ace-builds@${ace.version}/src-min-noconflict`
      );
      this.editor = ace.edit(editorElement);
      this.editor.setTheme("ace/theme/github");
      this.editor.session.setUseWorker(true);
      this.editor.renderer.attachToShadowRoot();
      this.editor.setValue(this.value);

      this.setEditorLanguage(this.language);
      if (this.disabled) this.editor.setReadOnly(true);

      this.editor.on("change", () => {
        this.value = this.editor.getValue();

        this.dispatchEvent(
          new CustomEvent("ecc-change", {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  async setEditorLanguage(language: Language) {
    if (!this.editor) return;
    try {
      await import(`ace-builds/src-noconflict/mode-${language}.js`);
      this.editor.session.setMode(`ace/mode/${language}`);
    } catch (error) {
      console.error(`Failed to load Ace mode for ${language}`, error);
      this.editor.session.setMode("ace/mode/text");
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("language")) {
      this.setEditorLanguage(this.language);
    }
    if (changedProperties.has("disabled") && this.editor) {
      this.editor.setReadOnly(this.disabled);
    }
  }

  render() {
    return html`
      <div class="header">
        <div id="label">${this.label}</div>
        <sl-tag size="small">
        ${_.upperCase(this.language)}</sl-tag></div>
      </div>
      <div id="code">
        <div
          id="editor"
          class="editor ${this.disabled ? "disabled" : ""}"
        ></div>
      </div>
    `;
  }
}

window.customElements.define("ecc-d-code", EccDCode);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-code": EccDCode;
  }
}
