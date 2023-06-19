import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './tesGetRun.template.js';
import styles from './tesGetRun.styles.js';
import { fetchTask } from '../../../data/index.js';
import { deleteTask } from '../../../data/Post/tesPost.js';

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
  name: 'ecc-tes-get-run',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESGetRun extends FASTElement {
  @attr id = '';

  @attr state = '';

  @observable isLoading = true;

  @observable data: TaskData = {
    id: this.id,
    state: this.state,
    name: '',
    description: '',
    creation_time: '',
    executors: [],
    logs: [],
  };

  connectedCallback() {
    super.connectedCallback();
    // Add event listener to handle accordion open event
    this.addEventListener('change', this.handleFetch);
    const delButton = this.shadowRoot?.querySelector('fast-button');
    if (!this.isLoading && delButton) {
      // delButton.addEventListener("click", this.handleDelete);
      delButton.addEventListener('click', this.handleDelete.bind(this));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.handleFetch);
    const delButton = this.shadowRoot?.querySelector('fast-button');
    if (!this.isLoading && delButton) {
      delButton.addEventListener('click', this.handleDelete.bind(this));
    }
  }

  // Handles deletion of this task
  handleDelete = async () => {
    await deleteTask(this.id);
  };

  // Fetched the task with this ID
  handleFetch = async () => {
    // Only fetch the data if not already fetched
    if (this.isLoading) {
      this.data = await fetchTask(this.id);
      this.isLoading = false;
    }
  };
}
