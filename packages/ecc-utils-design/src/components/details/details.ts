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
  type: "text" | "long-text" | "url" | "array" | "object";
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
      .container {
        display: flex;
        margin-bottom: 1rem;
      }

      .label {
        // width: 6rem;
        font-weight: bold;
        margin-right: 0.5rem;
      }

      .copy-button {
        margin-left: 0.5rem;
      }

      .large-text {
        height: 6rem;
        overflow: scroll;
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */
      }

      .large-text::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }

      .array-value {
        display: flex;
        gap: 0.2rem;
      }

      .vertical {
        flex-direction: column;
      }

      .container-object {
      }

      .object-value {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
      }

      .object-item {
        display: flex;
        margin-bottom: 0.5rem;
      }

      .key {
        font-weight: bold;
        margin-right: 0.5rem;
      }
    `,
  ];

  @property({ type: Array }) private fields: Array<Field> = [];

  private _renderText(child: Children): TemplateResult {
    this.requestUpdate();
    return html`
      <div class="container">
        <div class="label">${child.label}</div>
        <div class="value">${child.value}</div>
      </div>
    `;
  }

  private _renderUrl(child: Children): TemplateResult {
    this.requestUpdate();
    return html`
      <div class="container">
        <div class="label">${child.label}</div>
        <div id="${child.key}" class="value">${child.value}</div>
        <sl-copy-button class="copy-button" from=${child.key}></sl-copy-button>
      </div>
    `;
  }

  private _renderLongText(child: Children): TemplateResult {
    this.requestUpdate();
    return html`
      <div class="container">
        <div class="label">${child.label}</div>
        <div id="${child.key}" class="value large-text">${child.value}</div>
        <sl-copy-button class="copy-button" from=${child.key}></sl-copy-button>
      </div>
    `;
  }

  private _renderObject(child: Children): TemplateResult {
    this.requestUpdate();
    return html`
      <div class="container-object">
        <div class="label">${child.label}</div>
        <div class="object-value">
          ${Object.entries(child.value).map(
            ([key, value]) => html`
              <div class="object-item">
                <div class="label">${key}:</div>
                <div class="value">${value}</div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private _renderArray(child: Children): TemplateResult {
    this.requestUpdate();
    return html`
      <div class="container">
        <div class="label">${child.label}</div>
        <div
          class="array-value ${child.arrayOptions?.vertical ? "vertical" : ""}"
        >
          ${child.arrayOptions?.pill
            ? html`${(child.value as Array<string>).map(
                (value) => html`<sl-tag size="medium" pill>${value}</sl-tag>`
              )}`
            : html`${(child.value as Array<string>).map(
                (value) => html`<div class="value">${value}</div>`
              )}`}
        </div>
      </div>
    `;
  }

  private _renderField(tabName: string, data: Array<Children>): TemplateResult {
    return html`
      <sl-tab slot="nav" panel="${toLower(tabName)}">${tabName}</sl-tab>
      <sl-tab-panel name="${toLower(tabName)}">
        ${data.map((child) => {
          switch (child.type) {
            case "url":
              return this._renderUrl(child);
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
