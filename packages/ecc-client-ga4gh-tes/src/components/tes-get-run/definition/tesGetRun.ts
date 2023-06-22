import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './tesGetRun.template.js';
import styles from './tesGetRun.styles.js';
import { fetchTask, deleteTask } from '../../../data/index.js';
import TaskData from './TaskData.js';

@customElement({
  name: 'ecc-tes-get-run',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESGetRun extends FASTElement {
  @attr baseURL = '';

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
