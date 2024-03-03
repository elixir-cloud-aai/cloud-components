import { html, css, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { property, state } from "lit/decorators.js";
import _, { toLower } from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import { hostStyles } from "../../styles/host.styles.js";

export interface Field {
  key: string;
  path: string;
  tab?: string;
  label?: string;
  arrayOptions?: {
    labelOptions?: {
      path?: string;
      prefix?: string;
      suffix?: string;
    };
    type?: "detail" | "tag";
  };
  tooltip?: string;
  copy?: boolean;
  parentKey?: string;
}

export interface Action {
  key: string;
  label: string;
  type: "button" | "link";
  buttonOptions?: {
    variant?: "primary" | "success" | "neutral" | "warning" | "danger" | "text";
    loading?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    icon?: {
      url: string;
      position?: "prefix" | "suffix";
    };
  };
  linkOptions?: {
    url: string;
    size?: "small" | "medium" | "large";
  };
  position?: "left" | "right";
}

export default class EccUtilsDesignDetails extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }

      .field {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 0.5rem 0;
      }

      .field .key {
        font-weight: bold;
        margin-right: 0.5rem;
        flex: 1;
      }

      .field .value {
        margin-left: 0.5rem;
        flex: 1;
      }

      .field .value.tags {
        display: flex;
        gap: 0.5rem;
      }

      .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
      }

      .actions .left {
        display: flex;
        gap: 0.5rem;
      }

      .actions .right {
        display: flex;
        gap: 0.5rem;
      }

      .link::part(label) {
        text-decoration: underline;
        padding: 0;
      }

      .icon {
        height: 1.25rem;
        width: 1.25rem;
      }
    `,
  ];

  @property({ type: Object, reflect: true }) data = {};
  @property({ type: Array, reflect: true }) fields: Array<Field> = [];
  @property({ type: Array, reflect: true }) actions: Array<Action> = [];

  @state() private _tabs: Array<string> = [];

  private _getTabs() {
    let tabs = this.fields.map((field) => field.tab);
    tabs = tabs.filter((tab) => tab);
    return _.uniq(tabs);
  }

  private _expandArrayPath(path: string, field: Field) {
    const splitPath = path.split("[*]");
    const remainingPath = splitPath.slice(1).join("[*]");
    const arrayPath = splitPath[0];
    const array = _.get(this.data, arrayPath);
    let arrayFields = array.map((_item: any, index: number) => ({
      ...field,
      key: `${field.key}#${index}`,
      path: `${arrayPath}[${index}]${remainingPath}`,
      tab: field.tab,
    }));
    if (remainingPath.includes("[*]")) {
      for (const arrayField of arrayFields) {
        const expandedFields = this._expandArrayPath(
          arrayField.path,
          arrayField
        );
        arrayFields = arrayFields.filter(
          (f: Field) => f.path !== arrayField.path
        );
        arrayFields.push(...expandedFields);
      }
    }

    return arrayFields;
  }

  private _expandObjectPath(path: string, field: Field) {
    const splitPath = path.split("*");
    const remainingPath = splitPath.slice(1).join("*");
    const objectPath = splitPath[0].slice(0, -1);
    const object = _.get(this.data, objectPath);
    const objectFields = Object.keys(object).map((key) => ({
      ...field,
      key: `${field.key}#${key}`,
      path: `${objectPath}.${key}${remainingPath}`,
      tab: field.tab,
    }));
    if (remainingPath.includes("*")) {
      for (const objectField of objectFields) {
        const expandedFields = this._expandObjectPath(
          objectField.path,
          objectField
        );
        objectFields.filter((f: Field) => f.path !== objectField.path);
        objectFields.push(...expandedFields);
      }
    }
    return objectFields;
  }

  connectedCallback() {
    super.connectedCallback();

    const arrayFields = this.fields.filter((field) =>
      field.path.includes("[*]")
    );

    arrayFields.forEach((field) => {
      const expandedFields = this._expandArrayPath(field.path, field);
      this.fields = this.fields.filter((f) => f.path !== field.path);
      this.fields.push(...expandedFields);
    });

    const objectFields = this.fields.filter((field) =>
      field.path.includes("*")
    );
    objectFields.forEach((field) => {
      const expandedFields = this._expandObjectPath(field.path, field);
      this.fields = this.fields.filter((f) => f.path !== field.path);
      this.fields.push(...expandedFields);
    });

    let { fields } = this;

    for (const field of this.fields) {
      const value = _.get(this.data, field.path);
      if (value === undefined) {
        fields = fields.filter((f) => f.key !== field.key);
      }
    }

    this.fields = fields;

    this._tabs = this._getTabs() as Array<string>;
  }

  private _renderArrayField(field: Field) {
    if (field.arrayOptions?.type === "tag") {
      return html`<div class="field">
        <div class="key">
          <sl-tooltip hoist trigger=${field.tooltip ? "hover" : "manual"}>
            <div slot="content">${field.tooltip}</div>
            ${field.label}
          </sl-tooltip>
          ${field.copy
            ? html`<sl-copy-button
                .value=${_.get(this.data, field.path)}
              ></sl-copy-button>`
            : ""}
        </div>
        <div class="value tags">
          ${_.get(this.data, field.path).map(
            (item: any) => html`<sl-tag type="primary">${item}</sl-tag>`
          )}
        </div>
      </div>`;
    }

    const array = _.get(this.data, field.path);
    return html` <sl-details>
      <sl-tooltip
        slot="summary"
        hoist
        trigger=${field.tooltip ? "hover" : "manual"}
      >
        <div slot="content">${field.tooltip}</div>
        <div>
          ${field.label}
          ${field.copy
            ? html`<sl-copy-button
                .value=${_.get(this.data, field.path)}
              ></sl-copy-button>`
            : ""}
        </div>
      </sl-tooltip>
      ${array.map(
        (item: any, index: number) =>
          html`${this._renderField({
            key: `${field.key}#${index}`,
            path: `${field.path}[${index}]`,
            tab: field.tab,
          })}`
      )}
    </sl-details>`;
  }

  private _renderObjectField = (field: Field): any => {
    const value = _.get(this.data, field.path);
    return html`<sl-details>
      <sl-tooltip
        slot="summary"
        hoist
        trigger=${field.tooltip ? "hover" : "manual"}
      >
        <div slot="content">${field.tooltip}</div>
        <div>
          ${field.label}
          ${field.copy
            ? html`<sl-copy-button
                .value=${_.get(this.data, field.path)}
              ></sl-copy-button>`
            : ""}
        </div>
      </sl-tooltip>
      ${Object.keys(value).map(
        (key) =>
          html`${this._renderField({
            key: `${field.key}#${key}`,
            path: `${field.path}.${key}`,
            tab: field.tab,
          })}`
      )}
    </sl-details>`;
  };

  private _renderField(field: Field) {
    const key = field.key.split("#")[0];
    const { path } = field;
    const matchingFields = _.filter(this.fields, (f) => f.path === field.path);
    let fieldwithProps = field;
    matchingFields.forEach((matchingField) => {
      if (key === matchingField?.parentKey) {
        const omitedField = _.omit(matchingField, "parentKey");
        fieldwithProps = _.merge(field, omitedField);
      } else if (!matchingField?.parentKey) {
        fieldwithProps = _.merge(field, matchingField);
      }
    });
    fieldwithProps.key = key;
    fieldwithProps.path = path;

    const value = _.get(this.data, fieldwithProps.path);

    let label =
      fieldwithProps.label ||
      _.startCase(toLower(fieldwithProps.path.split(".").pop()));

    if (fieldwithProps.arrayOptions?.labelOptions?.path) {
      label = _.get(
        this.data,
        `${fieldwithProps.path}${fieldwithProps.arrayOptions?.labelOptions?.path}`
      );
    }

    if (fieldwithProps.arrayOptions?.labelOptions?.prefix) {
      label = `${fieldwithProps.arrayOptions?.labelOptions?.prefix}${label}`;
    }

    if (fieldwithProps.arrayOptions?.labelOptions?.suffix) {
      label = `${label}${fieldwithProps.arrayOptions?.labelOptions?.suffix}`;
    }

    fieldwithProps.label = label;

    if (Array.isArray(value)) {
      return html`${this._renderArrayField(fieldwithProps)}`;
    }
    if (value && typeof value === "object") {
      return html`${this._renderObjectField(fieldwithProps)}`;
    }
    return html`<div class="field">
      <div class="key">
        <sl-tooltip
          hoist
          trigger=${fieldwithProps.tooltip ? "hover" : "manual"}
        >
          <div slot="content">${fieldwithProps.tooltip}</div>
          ${fieldwithProps.label}
        </sl-tooltip>
        ${fieldwithProps.copy
          ? html`<sl-copy-button
              .value=${_.get(this.data, fieldwithProps.path)}
            ></sl-copy-button>`
          : ""}
      </div>
      <div class="value">${value}</div>
    </div>`;
  }

  private _renderPanel(tab: string) {
    const fields = this.fields.filter((field) => field.tab === tab);
    return fields.map((field) => this._renderField(field));
  }

  private _renderTabs() {
    return this._tabs.map(
      (tab) => html`<sl-tab slot="nav" panel=${tab}>${tab}</sl-tab>
        <sl-tab-panel name=${tab}> ${this._renderPanel(tab)} </sl-tab-panel> `
    );
  }

  private _renderAction(action: Action) {
    if (action.type === "link") {
      return html`<sl-button
        class="link"
        variant="text"
        size=${ifDefined(action.linkOptions?.size)}
        @click=${() => window.open(action.linkOptions?.url, "_blank")}
      >
        ${action.label}
      </sl-button>`;
    }
    return html`<sl-button
      @click=${() =>
        this.dispatchEvent(
          new CustomEvent("ecc-utils-button-click", {
            detail: {
              key: action.key,
            },
          })
        )}
      ?loading=${action.buttonOptions?.loading}
      ?disabled=${action.buttonOptions?.disabled}
      variant=${ifDefined(action.buttonOptions?.variant)}
      size=${ifDefined(action.buttonOptions?.size)}
    >
      ${action?.buttonOptions?.icon &&
      action?.buttonOptions?.icon?.position === "prefix"
        ? html`<img
            src=${action.buttonOptions?.icon?.url}
            slot="prefix"
            class="icon"
            alt=${action.label}
          />`
        : ""}
      ${action.label}
      ${action?.buttonOptions?.icon &&
      action?.buttonOptions?.icon?.position !== "prefix"
        ? html`<img
            src=${action.buttonOptions?.icon?.url}
            slot="suffix"
            class="icon"
            alt=${action.label}
          />`
        : ""}
    </sl-button>`;
  }

  private _renderActions() {
    this.actions = this.actions.map((action) => {
      const positionedAction = action;
      if (!positionedAction.position) {
        positionedAction.position = "right";
      }
      return positionedAction;
    });

    return html`
      <div class="actions">
        <div class="left">
          ${this.actions
            .filter((action) => action.position === "left")
            .map((action) => this._renderAction(action))}
        </div>
        <div class="right">
          ${this.actions
            .filter((action) => action.position === "right")
            .map((action) => this._renderAction(action))}
        </div>
      </div>
    `;
  }

  private _renderFields(data: any) {
    return Object.keys(data).map((key) =>
      this._renderField({
        key,
        path: key,
        tab: "",
      })
    );
  }

  render() {
    return html`<div>
      ${this._tabs.length > 0
        ? html`<sl-tab-group> ${this._renderTabs()} </sl-tab-group>`
        : this._renderFields(this.data)}
      ${this._renderActions()}
    </div>`;
  }
}
