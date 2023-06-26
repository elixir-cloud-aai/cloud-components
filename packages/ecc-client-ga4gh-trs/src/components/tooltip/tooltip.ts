import { FASTElement, customElement, observable } from "@microsoft/fast-element";
import { template } from "./tooltip.template";
import { styles } from "./tooltip.styles";

@customElement({
  name: "custom-tooltip",
  template,
  styles,
})
export class CustomTooltip extends FASTElement {
    placeholder: HTMLElement;
    dropdown: HTMLElement;
  
    connectedCallback() {
      super.connectedCallback();
      this.setup();
    }
  
    setup() {
      this.placeholder = this.shadowRoot?.querySelector('[data-tooltip-placeholder]') as HTMLElement;
      this.dropdown = this.shadowRoot?.querySelector('[data-tooltip-dropdown]') as HTMLElement;
  
      this.placeholder.addEventListener('mouseover', () => this.handleDropdownPosition());
      this.placeholder.addEventListener('touchstart', () => this.toggle());
    }
  
    handleDropdownPosition() {
      const screenPadding = 16;
  
      const placeholderRect = this.placeholder.getBoundingClientRect();
      const dropdownRect = this.dropdown.getBoundingClientRect();
  
      const dropdownRightX = dropdownRect.x + dropdownRect.width;
      const placeholderRightX = placeholderRect.x + placeholderRect.width;
  
      if (dropdownRect.x < 0) {
        this.dropdown.style.left = '0';
        this.dropdown.style.right = 'auto';
        this.dropdown.style.transform = `translateX(${-placeholderRect.x + screenPadding}px)`;
      } else if (dropdownRightX > window.outerWidth) {
        this.dropdown.style.left = 'auto';
        this.dropdown.style.right = '0';
        this.dropdown.style.transform = `translateX(${(window.outerWidth - placeholderRightX) - screenPadding}px)`;
      }
    }
  
    toggle() {
      if (this.classList.contains('tooltip--open')) {
        this.close();
      } else {
        this.open();
      }
    }
  
    open() {
      this.classList.add('tooltip--open');
      this.handleDropdownPosition();
    }
  
    close() {
      this.classList.remove('tooltip--open');
    }
  }