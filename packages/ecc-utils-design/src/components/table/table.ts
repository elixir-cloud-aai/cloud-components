import { LitElement, html, css } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Table Root
export class EccUtilsDesignTable extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div part="base" class="relative w-full overflow-auto">
        <div data-role="table" class=${cn("w-full text-sm")}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Table Header
export class EccUtilsDesignTableHeader extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="header"
        class=${cn("[&>[data-role=row]]:border-b")}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Body
export class EccUtilsDesignTableBody extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="body"
        class=${cn("[&>[data-role=row]:last-child]:border-0")}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Footer
export class EccUtilsDesignTableFooter extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="footer"
        class=${cn(
          "border-t bg-muted/50 font-medium [&>[data-role=row]:last-child]:border-b-0"
        )}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Row
export class EccUtilsDesignTableRow extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) state = "";

  @query("slot") private defaultSlot!: HTMLSlotElement;

  @state() private gridStyles = {};

  firstUpdated() {
    this.defaultSlot.addEventListener("slotchange", this.updateColumnCount);
    this.updateColumnCount();
  }

  disconnectedCallback() {
    this.defaultSlot.removeEventListener("slotchange", this.updateColumnCount);
    super.disconnectedCallback();
  }

  private updateColumnCount = () => {
    const assignedElements = this.defaultSlot
      .assignedElements({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const columnCount = assignedElements.length || 1;

    this.gridStyles = {
      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    };
  };

  render() {
    this.dataset.state = this.state;
    return html`
      <div
        part="base"
        data-role="row"
        class=${cn(
          "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted flex"
        )}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Head Cell
export class EccUtilsDesignTableHead extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="head"
        class=${cn(
          "flex-1 h-10 px-2 text-left flex items-center font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
        )}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Cell
export class EccUtilsDesignTableCell extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="cell"
        class=${cn(
          "p-2 flex gap-2 h-full items-center [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
        )}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Table Caption
export class EccUtilsDesignTableCaption extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div
        part="base"
        data-role="caption"
        class=${cn("mt-4 text-sm text-muted-foreground text-center")}
      >
        <slot></slot>
      </div>
    `;
  }
}

// Export all for index.ts
export default EccUtilsDesignTable;
