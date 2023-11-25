import { html, css, LitElement, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { toLower } from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
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

interface FooterButton {
  key: string;
  isPresent: boolean;
  name: string;
  size: "small" | "medium" | "large";
  variant: "primary" | "success" | "neutral" | "warning" | "danger";
  outline: boolean;
  pill: boolean;
  icon?: {
    name: string;
    viewBox: string;
    path: string;
  };
}

export default class Details extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      .panel-container {
        height: 400px;
        overflow: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .panel-container::-webkit-scrollbar {
        display: none;
      }

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

      [name="footer-container"] {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem;
      }
    `,
  ];

  @property({ type: Array }) private fields: Array<Field> = [];
  @property({ type: Array }) private buttons: Array<FooterButton> = [];

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
        <div class="panel-container">
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
        </div>
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

  private _renderSvg(icon: FooterButton["icon"]): TemplateResult {
    this.eslintFix();
    return html`
      <svg
        slot="prefix"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="${icon?.viewBox}"
      >
        <path d="${icon?.path}" />
      </svg>
    `;
  }

  private _handleClick(event: Event, key: string) {
    this.dispatchEvent(
      new CustomEvent(`button-${key}-click`, {
        detail: {
          buttonKey: key,
          button: event.target,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderFooter(): TemplateResult {
    console.log(this.buttons);
    return html`
      <div name="footer-container">
        <div class="footer-button">
          ${this.buttons.map((button) => {
            const { size, variant, outline, pill, name, icon, key } = button;
            return html`
              <sl-button
                ?pill="${pill}"
                variant="${variant}"
                ?outline="${outline}"
                size="${size}"
                @click="${(event: Event) => this._handleClick(event, key)}"
              >
                ${icon ? this._renderSvg(icon) : ""} ${name}
              </sl-button>
            `;
          })}
        </div>
        <slot name="footer"> </slot>
      </div>
    `;
  }

  render() {
    return html` ${this._renderFields(this.fields)} ${this._renderFooter()} `;
  }
}
