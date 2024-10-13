import { LitElement } from "lit";

type ParentElement = Document | Element | ShadowRoot | "root";
type ComponentType = LitElement;

export default class TestComponent {
  component: ComponentType;
  constructor(component: ComponentType) {
    this.component = component;
  }

  private getFields = (
    id: string,
    parentElement: ParentElement,
    retrieveAll = false
  ) => {
    if (parentElement === "root") {
      // eslint-disable-next-line no-param-reassign
      parentElement = this.component.shadowRoot!;
    }
    if (retrieveAll) {
      return parentElement.querySelectorAll(`[data-testid="${id}"]`);
    }
    return parentElement.querySelector(`[data-testid="${id}"]`);
  };

  // locators
  element(testId: string, p: ParentElement): HTMLElement;
  element(testId: string, p: ParentElement, all: true): NodeListOf<HTMLElement>;
  element(testId: string, p: ParentElement, all: false): HTMLElement;
  element(testId: string, p: ParentElement, all = false) {
    return this.getFields(testId, p, all);
  }

  inputField(testId: string, p: ParentElement): HTMLInputElement;
  inputField(
    testId: string,
    p: ParentElement,
    all: true
  ): NodeListOf<HTMLInputElement>;

  inputField(testId: string, p: ParentElement, all: false): HTMLInputElement;
  inputField(testId: string, p: ParentElement, all = false) {
    return this.getFields(testId, p, all);
  }

  buttonElement(testId: string, p: ParentElement): HTMLButtonElement;
  buttonElement(
    testId: string,
    P: ParentElement,
    all: true
  ): NodeListOf<HTMLButtonElement>;

  buttonElement(
    testId: string,
    p: ParentElement,
    all: false
  ): HTMLButtonElement;

  buttonElement(testId: string, p: ParentElement, all = false) {
    return this.getFields(testId, p, all);
  }

  // methods

  /**
   * Fills an input file field with an optional specified file text.
   *
   * @param inputField - The input file field element to fill.
   * @param fileText - The text content of the file.
   * @note You do not need to await this method, you can await the form updateComplete as an alternative
   */
  public async fillInputField(
    inputField: HTMLInputElement,
    text = "test value"
  ) {
    // eslint-disable-next-line no-param-reassign
    inputField.value = text;
    inputField.dispatchEvent(new Event("sl-input"));
    await this.component.updateComplete;
  }

  public async fillInputFileField(
    inputField: HTMLInputElement,
    fileText = "test value"
  ) {
    if (inputField.type !== "file") {
      throw new Error("inputField is not a valid file element");
    }

    const files = [
      new File([fileText], "test-file.txt", { type: "text/plain" }),
    ];
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // eslint-disable-next-line no-param-reassign
    inputField.files = dataTransfer.files;
    inputField.dispatchEvent(new Event("change"));

    await this.component.updateComplete;
  }

  public async toggleSwitch(switchField: HTMLInputElement) {
    switchField.click();
    await this.component.updateComplete;
  }

  // actions
  public clickButton = async (
    button: HTMLButtonElement,
    numberOfClicks = 1
  ) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberOfClicks; i++) button.click();
    await this.component.updateComplete;
  };
}
