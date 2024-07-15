import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-github.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import _ from "lodash-es";
import codeStyles from "./code.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import { hostStyles } from "../../styles/host.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";

export type Language = "yaml" | "json" | "xml" | "makefile" | "sh";

export default class EccUtilsDesignCode extends LitElement {
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
          new CustomEvent("ecc-utils-change", {
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
