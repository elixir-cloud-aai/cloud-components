/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
import {
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
  @observable public data: IToolClass[] = [];

  public connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    try {
      const response = await fetch(
        "https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/toolClasses",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data: IToolClass[] = await response.json();
      this.data = data;
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  public edit(id: string): void {
    const item = this.data.find((item) => item.id === id);
    if (item) {
      item.isEditing = true;
    }
    console.log("edit", id);
    console.log("editing mode", item?.isEditing);
  }

  public async delete(id: string): Promise<void> {
    try {
      const response = await fetch(
        `https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/toolClasses/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );
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

    try {
      const response = await fetch(
        `https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/toolClasses/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      item.isEditing = false;
    } catch (error) {
      console.error(`Failed to save item with id: ${id}`, error);
    }
  }
  public handleInput(
    event: Event,
    item: DataItem,
    field: keyof DataItem
  ): void {
    if (field === "id" || field === "name" || field === "description") {
      item[field] = (event.target as HTMLInputElement).value;
    }
  }
}
