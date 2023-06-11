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
    // this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // this.removeEventListener("click", this.handleClick);
  }

  // handleClick = () => {
  //   console.log("from runs", this.id);
  //   // Todo : extended run tast view
  // };

  // async pageSizeChanged() {
  //   const newData = await fetchTasks(this.pageSize);
  //   if (newData && newData.tasks) {
  //     this.data = newData.tasks;
  //   }
  // }

  // async nextPageTokenChanged() {
  //   const newData = await fetchTasks(this.pageSize, this.nextPageToken);
  //   if (newData && newData.tasks) {
  //     this.data = newData.tasks;
  //   }
  // }
}
