import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import { fetchTasks } from "../../../data/index.js";
import template from "./tesGetRuns.template.js";
import styles from "./tesGetRuns.styles.js";

interface Task {
  id: string;
  state: string;
}
@customElement({
  name: "ecc-tes-get-runs",
  template,
  styles,
})
export default class TESGetRuns extends FASTElement {
  @attr pageSize = 5;

  @attr nextPageToken = "";

  @observable data: Task[] = [];

  @observable isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    const newData = await fetchTasks();
    if (newData && newData.tasks) {
      this.data = newData.tasks;
    }
    this.isLoading = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
