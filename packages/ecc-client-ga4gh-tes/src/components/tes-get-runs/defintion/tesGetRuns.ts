import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { fetchTasks } from "../../../data/index.js";
import template from "./tesGetRuns.template.js";
import styles from "./tesGetRuns.styles.js";

@customElement({
  name: "ecc-tes-get-runs",
  template,
  styles,
})
export default class TESGetRuns extends FASTElement {
  @attr pageSize = 5;

  @attr nextPageToken = "";

  @observable data: object = {};

  async connectedCallback() {
    const newData = await fetchTasks();
    if (newData) {
      this.data = newData;
    }
  }

  async pageSizeChanged() {
    const newData = await fetchTasks(this.pageSize);
    if (newData) {
      this.data = newData;
    }
  }

  async nextPageTokenChanged() {
    const newData = await fetchTasks(this.pageSize, this.nextPageToken);
    if (newData) {
      this.data = newData;
    }
  }
}
