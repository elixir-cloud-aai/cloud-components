import { FASTElement, customElement } from "@microsoft/fast-element";
import { template } from "./tooltip.template.js";
import { styles } from "./tooltip.styles.js";

/**
 * Represents the CustomTooltip class.
 * @extends FASTElement
 */
@customElement({
  name: "custom-tooltip",
  template,
  styles,
})
export class CustomTooltip extends FASTElement {
  /** Represents the placeholder for the tooltip. */
  placeholder: HTMLElement;

  /** Represents the dropdown for the tooltip. */
  dropdown: HTMLElement;

  /**
   * Executes when the element is first connected to the DOM.
   * @override
   */
  connectedCallback() {
    super.connectedCallback();
    // this.setup();
    this.placeholder = this.shadowRoot?.querySelector(
      "[data-tooltip-placeholder]"
    ) as HTMLElement;
    this.dropdown = this.shadowRoot?.querySelector(
      "[data-tooltip-dropdown]"
    ) as HTMLElement;

    this.placeholder.addEventListener("mouseover", () =>
      this.handleDropdownPosition()
    );
    this.placeholder.addEventListener("touchstart", () => this.toggle());
  }

  /**
   * Handles the position of the dropdown.
   */
  handleDropdownPosition() {
    const screenPadding = 16;

    const placeholderRect = this.placeholder.getBoundingClientRect();
    const dropdownRect = this.dropdown.getBoundingClientRect();

    const dropdownRightX = dropdownRect.x + dropdownRect.width;
    const placeholderRightX = placeholderRect.x + placeholderRect.width;

    if (dropdownRect.x < 0) {
      this.dropdown.style.left = "0";
      this.dropdown.style.right = "auto";
      this.dropdown.style.transform = `translateX(${
        -placeholderRect.x + screenPadding
      }px)`;
    } else if (dropdownRightX > window.outerWidth) {
      this.dropdown.style.left = "auto";
      this.dropdown.style.right = "0";
      this.dropdown.style.transform = `translateX(${
        window.outerWidth - placeholderRightX - screenPadding
      }px)`;
    }
  }

  /**
   * Toggles the tooltip.
   */
  toggle() {
    if (this.classList.contains("tooltip--open")) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Opens the tooltip.
   */
  open() {
    this.classList.add("tooltip--open");
    this.handleDropdownPosition();
  }

  /**
   * Closes the tooltip.
   */
  close() {
    this.classList.remove("tooltip--open");
  }
}
