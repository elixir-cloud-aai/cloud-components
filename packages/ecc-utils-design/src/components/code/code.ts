import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import jsyaml from "js-yaml";
import { hostStyles } from "../../styles/host.styles.js";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import codeStyles from "./code.styles.js";

type Language = "YAML" | "JSON" | "Text";

export default class EccUtilsDesignCode extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    codeStyles,
  ];

  @property({ type: String }) code = "";
  @property({ type: String }) label = "Code";
  @property({ type: String }) language: Language = "YAML";
  @property({ type: Number }) indentation = 2;
  @property({ type: Number }) blurDelay = 150;
  @property({ type: Boolean }) required = true;
  @property({ type: Boolean }) disabled = false;

  @state() elTextarea: HTMLTextAreaElement | null = null;
  @state() error = false;
  @state() indent = "";
  @state() currentIndentation = "";
  @state() opening = ["(", "{", "[", "'", '"'];
  @state() closing = [")", "}", "]", "'", '"'];
  @state() lastTabPressTime = 0;
  @state() errorLanguage: Language = "Text";

  private cssParts = {};

  private _getTextAreaEle(): HTMLTextAreaElement {
    const slTextarea = this.shadowRoot?.querySelector("sl-textarea");
    const ele = slTextarea?.shadowRoot?.querySelector("textarea");
    if (!ele || !(ele instanceof HTMLTextAreaElement)) {
      throw new Error("Could not find textarea element");
    }
    return ele;
  }

  firstUpdated() {
    const slTextarea = this.shadowRoot?.querySelector("sl-textarea");
    const ele = slTextarea?.shadowRoot?.querySelector("textarea");
    if (ele instanceof HTMLTextAreaElement) {
      ele.value = this.code;
    }
    this.indent = " ".repeat(this.indentation);
    this._updateTextarea();
  }

  public getCode() {
    return this.code;
  }

  private _setCursor(pos: number) {
    this.elTextarea = this._getTextAreaEle();
    this.elTextarea.setSelectionRange(pos, pos);
  }

  private _setSelect(from: number, to: number) {
    this.elTextarea = this._getTextAreaEle();
    this.elTextarea.setSelectionRange(from, to);
  }

  private _getCurrentLineIndent() {
    const slTextarea = this.shadowRoot?.querySelector("sl-textarea");
    const ele = slTextarea?.shadowRoot?.querySelector("textarea");
    if (!ele || !(ele instanceof HTMLTextAreaElement)) {
      throw new Error("Could not find textarea element");
    }
    this.elTextarea = ele;

    const selStart = this.elTextarea.selectionStart;
    const selEnd = this.elTextarea.selectionEnd;

    const indentStart = this.code.lastIndexOf("\n", selStart - 1) + 1;
    const spaces = (() => {
      let pos = indentStart;
      while (this.code[pos] === " " && pos < selEnd) pos += 1;
      return pos - indentStart;
    })();
    return " ".repeat(spaces);
  }

  private _updateTextarea() {
    if (!this.elTextarea) return;
    this.elTextarea.value = this.code;

    this.dispatchEvent(
      new CustomEvent("ecc-utils-change", { detail: this.code })
    );
  }

  private _insertCode(pos: number, text: string, placeCursor = true) {
    this.code = this.code.substring(0, pos) + text + this.code.substring(pos);
    this._updateTextarea();
    if (placeCursor) this._setCursor(pos + text.length);
  }

  private _replaceCode(
    posFrom: number,
    posTo: number,
    text = "",
    placeCursor = true
  ) {
    this.code =
      this.code.substring(0, posFrom) + text + this.code.substring(posTo);
    this._updateTextarea();
    if (placeCursor) this._setCursor(posFrom + text.length);
  }

  private _handleInput(e: InputEvent) {
    this.code = (e.target as HTMLInputElement).value;
    this._validateCode();
    this.dispatchEvent(
      new CustomEvent("ecc-utils-change", { detail: this.code })
    );
  }

  private _handleTabs(e: KeyboardEvent) {
    e.preventDefault();
    const slTextarea = this.shadowRoot?.querySelector("sl-textarea");
    const ele = slTextarea?.shadowRoot?.querySelector("textarea");
    if (!ele || !(ele instanceof HTMLTextAreaElement)) {
      throw new Error("Could not find textarea element");
    }
    this.elTextarea = ele;
    const selStart = this.elTextarea.selectionStart;
    const selEnd = this.elTextarea.selectionEnd;

    if (selStart !== selEnd) {
      // multiline indent
      const selLineStart = Math.max(
        0,
        this.code.lastIndexOf("\n", selStart - 1)
      );
      const selLineEnd = Math.max(this.code.indexOf("\n", selEnd), selEnd);

      let linesInChunk = 0;
      let codeChunk = this.code.substring(selLineStart, selLineEnd);
      let lenShift = this.indent.length;
      if (selLineStart === 0) codeChunk = `\n${codeChunk}`;

      if (e.shiftKey) {
        // Unindent
        lenShift = -lenShift;
        linesInChunk = (
          codeChunk.match(new RegExp(`\n${this.indent}`, "g")) || []
        ).length;
        codeChunk = codeChunk.replaceAll(`\n${this.indent}`, "\n");
      } else {
        // Indent
        linesInChunk = (codeChunk.match(/\n/g) || []).length;
        codeChunk = codeChunk.replaceAll("\n", `\n${this.indent}`);
      }

      if (selLineStart === 0) codeChunk = codeChunk.replace(/^\n/, "");
      this._replaceCode(selLineStart, selLineEnd, codeChunk, false);

      const newStart = Math.max(selLineStart + 1, selStart + lenShift);
      const newEnd = selEnd + linesInChunk * lenShift;
      this._setSelect(newStart, newEnd);
    } else {
      this._insertCode(selStart, this.indent, true);
    }
  }

  private _handleBackspace(e: KeyboardEvent) {
    this.elTextarea = this._getTextAreaEle();
    const selStart = this.elTextarea.selectionStart;
    const selEnd = this.elTextarea.selectionEnd;
    if (e.ctrlKey || selStart !== selEnd) return;

    e.preventDefault();

    const prevSymbol = this.code[selStart - 1];
    const curSymbol = this.code[selStart];
    const isInPairs =
      this.opening.includes(prevSymbol) && this.closing.includes(curSymbol);
    const isPair = this.closing[this.opening.indexOf(prevSymbol)] === curSymbol;

    if (isInPairs && isPair) {
      this._replaceCode(selStart - 1, selStart + 1);
    } else {
      const chunkStart = selStart - this.indent.length;
      const chunkEnd = selStart;
      const chunk = this.code.substring(chunkStart, chunkEnd);

      if (chunk === this.indent) this._replaceCode(chunkStart, chunkEnd);
      else this._replaceCode(selStart - 1, selStart);
    }
  }

  private _handleAutoClose(e: KeyboardEvent) {
    this.elTextarea = this._getTextAreaEle();
    const selStart = this.elTextarea.selectionStart;
    const selEnd = this.elTextarea.selectionEnd;
    if (this.code[selStart] === "'" || this.code[selStart] === '"') {
      this._handleAutoSkip(e);
      return;
    }
    e.preventDefault();

    if (selStart === selEnd) {
      const opening = e.key;
      const closing = this.closing[this.opening.indexOf(opening)];

      if (
        opening === "{" &&
        (this.code[selStart] === "\n" || this.code.length === selStart)
      ) {
        const lineShift = `\n${this._getCurrentLineIndent()}`;
        this._insertCode(
          selStart,
          opening + lineShift + this.indent + lineShift + closing
        );
        this._setCursor(selStart + lineShift.length + this.indent.length + 1);
      } else {
        this._insertCode(selStart, opening + closing);
        this._setCursor(selStart + 1);
      }
    }
  }

  private _handleAutoSkip(e: KeyboardEvent): void {
    this.elTextarea = this._getTextAreaEle();
    const selStart = this.elTextarea.selectionStart;

    if (this.code[selStart] === e.key) {
      e.preventDefault();
      this._setCursor(selStart + 1);
    }
  }

  private _handleNewLine(e: KeyboardEvent) {
    e.preventDefault();
    this.elTextarea = this._getTextAreaEle();
    this._insertCode(
      this.elTextarea.selectionStart,
      `\n${this._getCurrentLineIndent()}`
    );
  }

  private _handleKeys(e: KeyboardEvent) {
    const currentTime = new Date().getTime();
    const timeSinceLastTabPress = currentTime - this.lastTabPressTime;

    switch (e.code) {
      case "Tab":
        if (timeSinceLastTabPress > this.blurDelay) {
          this._handleTabs(e);
        } else {
          this.shadowRoot?.querySelector("sl-textarea")?.blur();
          e.preventDefault();
        }

        this.lastTabPressTime = currentTime;
        break;
      case "Enter":
        this._handleNewLine(e);
        break;
      case "Backspace":
        this._handleBackspace(e);
        break;
      default:
        if (this.opening.includes(e.key)) this._handleAutoClose(e);
        else if (this.closing.includes(e.key)) this._handleAutoSkip(e);
    }
    this._validateCode();
    this.dispatchEvent(
      new CustomEvent("ecc-utils-change", { detail: this.code })
    );
  }

  private _validateCode(): void {
    if (this.code === "") {
      this.error = false;
      return;
    }

    if (this.language === "JSON") {
      try {
        JSON.parse(this.code);
        this.error = false;
      } catch (error) {
        try {
          jsyaml.loadAll(this.code);
          this.errorLanguage = "YAML";
        } catch (err) {
          this.errorLanguage = "Text";
        }
        this.error = true;
      }
    } else if (this.language === "YAML") {
      try {
        jsyaml.loadAll(this.code);
        this.error = false;
      } catch (error) {
        this.error = true;
        this.errorLanguage = "Text";
      }
    } else this.error = false;
  }

  render() {
    return html`
      <sl-textarea
        @keydown=${this._handleKeys}
        @input=${this._handleInput}
        value=${this.code}
        resize="auto"
        ?required=${this.required}
        ?disabled=${this.disabled}
      >
        <div id="label" slot="label">
          ${this.label}
          <sl-badge variant=${this.error ? "danger" : "primary"}
            >${this.language}</sl-badge
          >
          ${this.error
            ? html`<sl-badge variant="neutral">${this.errorLanguage}</sl-badge>`
            : html``}
          <sl-copy-button
            value=${this.code}
            error-label="Nothing to copy"
          ></sl-copy-button>
        </div>
      </sl-textarea>
    `;
  }
}
