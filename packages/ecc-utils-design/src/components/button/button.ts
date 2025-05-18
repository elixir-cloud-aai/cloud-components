import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type Size = "default" | "sm" | "lg" | "icon";

const buttonBase =
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const svgBase = "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline h-fit!",
};

const sizeClasses: Record<Size, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export class EccUtilsDesignButton extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) variant: Variant = "default";
  @property({ type: String }) size: Size = "default";
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    const classes = cn(
      buttonBase,
      svgBase,
      variantClasses[this.variant],
      sizeClasses[this.size]
    );

    return html`
      <button
        part="base"
        class=${classes}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _onClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}

export default EccUtilsDesignButton;
