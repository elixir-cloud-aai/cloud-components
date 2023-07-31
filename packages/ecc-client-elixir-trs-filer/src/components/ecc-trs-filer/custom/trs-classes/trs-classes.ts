import {
  attr,
  customElement,
  FASTElement,
  observable,
} from "@microsoft/fast-element";
import { template } from "./trs-classes.template.js";
import { styles } from "./trs-classes.styles.js";
import type { IToolClass } from "./trs-classes.interface.js";

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
  @observable public data: IToolClass[] = [];
  @observable public isModalOpen = false;
  @observable public modalDescription = "";
  @observable public modalName = "";

  public connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/toolClasses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data: IToolClass[] = await response.json();
      this.data = data;
      console.log(this.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  public handleDescriptionChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      this.modalDescription = target.value;
    }
  }

  public handleNameChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      this.modalName = target.value;
    }
  }

  public clearModal(): void {
    this.modalDescription = "";
    this.modalName = "";
  }

  public async createToolClass(
    description: string,
    name: string
  ): Promise<void> {
    console.log(description, name);
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

  public openModal(): void {
    this.isModalOpen = true;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  public async createToolClassFromModal(): Promise<void> {
    await this.createToolClass(this.modalDescription, this.modalName);
    this.closeModal();
  }

  // for editing and deleting a tool class
  public edit(id: string): void {
    const itemIndex = this.data.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const updatedItem = { ...this.data[itemIndex], isEditing: true };
      const updatedData = [...this.data];
      updatedData[itemIndex] = updatedItem;
      this.data = updatedData;
    }
  }

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
      // After deleting, you might want to remove the item from this.data.
      this.data = this.data.filter((item) => item.id !== id);
    } catch (error) {
      console.error(`Failed to delete item with id: ${id}`, error);
    }
  }

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

  public handleInputChange(item: DataItem, e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    item[name] = value;
  }
}
