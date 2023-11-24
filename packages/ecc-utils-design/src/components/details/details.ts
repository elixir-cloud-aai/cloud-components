import { html, css, LitElement, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { toLower } from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import { hostStyles } from "../../styles/host.styles.js";

interface Children {
  key: string;
  label: string;
  value: string | number | Array<string> | Record<string, string>;
  type: "text" | "long-text" | "array" | "object";
  textOptions?: {
    copy?: boolean;
  };
  arrayOptions?: {
    vertical?: boolean;
    pill?: boolean;
  };
}

interface Field {
  tabGroup: string;
  children: Array<Children>;
}

export default class Details extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      .details-container {
        display: flex;
        margin-bottom: 1rem;
        align-items: center;
      }

      .details-container-object {
        flex-direction: column;
        align-items: flex-start;
      }

      .column {
        flex-direction: column;
        align-items: flex-start;
      }

      .align {
        align-items: flex-start;
      }

      .label {
        font-weight: bold;
        margin-right: 0.5rem;
      }

      .value-container {
        display: flex;
        align-items: center;
      }

      .value {
      }

      .large-text {
        height: 6rem;
        overflow: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .large-text::-webkit-scrollbar {
        display: none;
      }

      .object-item {
        display: flex;
        margin-bottom: 0.5rem;
      }

      .object-key {
        font-weight: bold;
        margin-right: 0.5rem;
      }

      .object-value-container {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
      }

      .object-value {
      }

      .array-value {
        display: flex;
        gap: 0.2rem;
      }

      .array-item {
        margin-bottom: 0.2rem;
      }

      .vertical {
        flex-direction: column;
        align-items: flex-start;
      }
    `,
  ];

  @property({ type: Array }) private fields: Array<Field> = [];

  // Methods need to have `this` keyword, else eslint
  // will complain, hence it removes that error
  // and shouldn't cause any issues
  private eslintFix() {
    this.requestUpdate();
  }

  private _renderContainer(
    child: Children,
    content: TemplateResult,
    flexDir = false,
    alignItems = false
  ): TemplateResult {
    this.eslintFix();
    return html`
      <div
        class="details-container ${flexDir ? "column" : ""} ${alignItems
          ? "align"
          : ""}"
      >
        <div class="label">${child.label}</div>
        <div class="value-container">
          ${content}
          ${child.textOptions?.copy &&
          html`<sl-copy-button
            class="copy-button"
            from=${child.key}
          ></sl-copy-button>`}
        </div>
      </div>
    `;
  }

  private _renderText(child: Children): TemplateResult {
    const content = html`<div class="value">${child.value}</div>`;
    return this._renderContainer(child, content);
  }

  private _renderLongText(child: Children): TemplateResult {
    const content = html`<div id="${child.key}" class="value large-text">
      ${child.value}
    </div>`;
    return this._renderContainer(child, content, true);
  }

  private _renderObjectItem(
    [key, value]: [string, string],
    child: Children
  ): TemplateResult {
    this.eslintFix();
    return html`
      <div class="object-item">
        <div class="object-key">${key}:</div>
        <div id="${child.key}" class="object-value">${value}</div>
        ${child.textOptions?.copy &&
        html`<sl-copy-button
          class="copy-button"
          from=${child.key}
        ></sl-copy-button>`}
      </div>
    `;
  }

  private _renderObject(child: Children): TemplateResult {
    return html`
      <div class="details-container details-container-object">
        <div class="label">${child.label}</div>
        <div class="object-value-container">
          ${Object.entries(child.value).map((entry) =>
            this._renderObjectItem(entry, child)
          )}
        </div>
      </div>
    `;
  }

  private _renderArrayValue(value: string): TemplateResult {
    this.eslintFix();
    return html`<div class="value">${value}</div>`;
  }

  private _renderArrayPill(value: string): TemplateResult {
    this.eslintFix();
    return html`<sl-tag size="medium" pill>${value}</sl-tag>`;
  }

  private _renderArray(child: Children): TemplateResult {
    const arrayRenderer = child?.arrayOptions?.pill
      ? this._renderArrayPill.bind(this)
      : this._renderArrayValue.bind(this);

    const content = html`
      <div
        class="array-value ${child.arrayOptions?.vertical ? "vertical" : ""}"
      >
        ${(child.value as Array<string>).map(
          (value) => html`<div class="array-item">${arrayRenderer(value)}</div>`
        )}
      </div>
    `;

    return this._renderContainer(child, content, false, true);
  }

  private _renderField(tabName: string, data: Array<Children>): TemplateResult {
    return html`
      <sl-tab slot="nav" panel="${toLower(tabName)}">${tabName}</sl-tab>
      <sl-tab-panel name="${toLower(tabName)}">
        ${data.map((child) => {
          switch (child.type) {
            case "text":
              return this._renderText(child);
            case "long-text":
              return this._renderLongText(child);
            case "array":
              return this._renderArray(child);
            case "object":
              return this._renderObject(child);
            default:
              return html``;
          }
        })}
      </sl-tab-panel>
    `;
  }

  private _renderFields(fields: Array<Field>): TemplateResult {
    if (!fields.length) return html``;
    return html`
      <sl-tab-group class="details">
        ${fields.map((field) =>
          this._renderField(field.tabGroup, field.children)
        )}
      </sl-tab-group>
    `;
  }

  render() {
    return html`${this._renderFields(this.fields)}`;
  }
}
