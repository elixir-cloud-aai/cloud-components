import {
  attr,
  customElement,
  FASTElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-classes.template.js";
import { styles } from "./trs-classes.styles.js";
import type { ToolClass } from "./trs-classes.types.js";

type DataItem = {
  id: string;
  name: string;
  description: string;
  isEditing: boolean;
};

@customElement({
  name: "trs-classes",
  template,
  styles,
})
export class TRSClasses extends FASTElement {
  @attr public baseUrl = "";
  @observable public data: ToolClass[] = [];
  @observable public isModalOpen = false;
  @observable public modalDescription = "";
  @observable public modalName = "";

  /**
   * @method
   * @description Load data on element connected.
   * @async
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
  }

  /**
   * @method
   * @description Fetch tool classes from the server.
   * @async
   * @returns {Promise<void>}
   * @private
   */
  private async fetchData(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/toolClasses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data: ToolClass[] = await response.json();
      this.data = data;
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  /**
   * @param e
   * @description Handle description change while creating a new tool class.
   * @returns {void}
   */
  public handleDescriptionChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      this.modalDescription = target.value;
    }
  }

  /**
   * @param e
   * @description Handle name change while creating a new tool class.
   * @returns {void}
   */
  public handleNameChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      this.modalName = target.value;
    }
  }

  /**
   * @description Clear modal inputs.
   * @returns {void}
   */
  public clearModal(): void {
    this.modalDescription = "";
    this.modalName = "";
  }

  /**
   * @param description
   * @param name
   * @description Create a new tool class. This function is then called from the modal.
   * @returns {Promise<void>}
   * @async
   */
  public async createToolClass(
    description: string,
    name: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/toolClasses`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, name }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Tool class created successfully!");
      this.clearModal();
      this.fetchData();
    } catch (error) {
      console.error("Failed to create tool class", error);
    }
  }

  /**
   * @description Open modal for creating a new tool class.
   * @returns {void}
   */
  public openModal(): void {
    this.isModalOpen = true;
  }

  /**
   * @description Close modal for creating a new tool class.
   * @returns {void}
   */
  public closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * @description Create a new tool class from the modal.
   * @returns {Promise<void>}
   * @async
   */
  public async createToolClassFromModal(): Promise<void> {
    await this.createToolClass(this.modalDescription, this.modalName);
    this.closeModal();
  }

  /**
   * @param id
   * @description Edit a tool class.
   * @returns {void}
   */
  public edit(id: string): void {
    const itemIndex = this.data.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const updatedItem = { ...this.data[itemIndex], isEditing: true };
      const updatedData = [...this.data];
      updatedData[itemIndex] = updatedItem;
      this.data = updatedData;
    }
  }

  /**
   * @param id
   * @description Cancel editing a tool class.
   * @returns {void}
   */
  public cancel(id: string): void {
    const itemIndex = this.data.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const updatedItem = { ...this.data[itemIndex], isEditing: false };
      const updatedData = [...this.data];
      updatedData[itemIndex] = updatedItem;
      this.data = updatedData;
    }
  }

  /**
   * @param id
   * @description Delete a tool class.
   * @returns {Promise<void>}
   * @async
   */
  public async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/toolClasses/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = this.data.filter((item) => item.id !== id);
    } catch (error) {
      console.error(`Failed to delete item with id: ${id}`, error);
    }
  }

  /**
   *
   * @param id
   * @returns {Promise<void>}
   * @async
   * @description Save a tool class afetr editing.
   */
  public async save(id: string): Promise<void> {
    const item = this.data.find((item) => item.id === id);
    if (!item) return;

    // without isEditing object;
    const updatedItem = {
      name: item.name,
      description: item.description,
    };

    try {
      const response = await fetch(`${this.baseUrl}/toolClasses/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = this.data.map((item) => {
        if (item.id === id) {
          return { ...item, isEditing: false };
        }
        return item;
      });
      this.data = updatedData;
    } catch (error) {
      console.error(`Failed to save item with id: ${id}`, error);
    }
  }

  /**
   * @param item
   * @param e
   * @description Handle input change while editing a tool class.
   * @returns {void}
   */
  public handleInputChange(item: DataItem, e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    item[name] = value;
  }
}
