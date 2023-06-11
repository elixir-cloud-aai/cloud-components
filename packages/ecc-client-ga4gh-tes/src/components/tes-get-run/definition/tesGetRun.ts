import {
  FASTElement,
  attr,
  customElement,
  observable,
} from "@microsoft/fast-element";
import template from "./tesGetRun.template.js";
import styles from "./tesGetRun.styles.js";
import { fetchTask } from "../../../data/index.js";

interface TaskData {
  id: string;
  state: string;
  name: string;
  description: string;
  executors: Executor[];
  logs: Log[];
  creation_time: string;
}

interface Executor {
  image: string;
  command: string[];
}

interface Log {
  logs: LogEntry[];
  metadata: {
    USER_ID: string;
  };
  start_time: string;
  end_time: string;
}

interface LogEntry {
  start_time: string;
  end_time: string;
  stdout: string;
  exit_code: number;
}

@customElement({
  name: "ecc-tes-get-run",
  template,
  styles,
  shadowOptions: { mode: "open" },
})
export default class TESGetRun extends FASTElement {
  @attr id = "";

  @attr state = "";

  @observable expanded = false;

  @observable isLoading = true;

  @observable data: TaskData = {
    id: this.id,
    state: this.state,
    name: "",
    description: "",
    creation_time: "",
    executors: [],
    logs: [],
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  handleClick = async () => {
    this.expanded = !this.expanded;
    this.data = await fetchTask(this.id);
    this.isLoading = false;
  };
}
