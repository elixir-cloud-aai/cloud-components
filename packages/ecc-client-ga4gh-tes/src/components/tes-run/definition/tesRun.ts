import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './tesRun.template.js';
import styles from './tesRun.styles.js';
import { fetchTask, deleteTask } from '../../../data/index.js';
import TaskData from './TaskData.js';

@customElement({
  name: 'ecc-client-ga4gh-tes-run',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESRun extends FASTElement {
  @attr baseURL = '';

  @attr id = '';

  @attr admin = false;

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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // Handles deletion of this task
  handleDelete = async () => {
    // Delete if baseURL is privided
    if (this.baseURL.length !== 0) await deleteTask(this.baseURL, this.id);
  };

  // Fetched the task with this ID
  handleFetch = async () => {
    // Only fetch the data if not already fetched and base URL is provided
    if (this.isLoading && this.baseURL.length !== 0) {
      this.data = await fetchTask(this.baseURL, this.id);
      this.isLoading = false;
    }
  };
}
