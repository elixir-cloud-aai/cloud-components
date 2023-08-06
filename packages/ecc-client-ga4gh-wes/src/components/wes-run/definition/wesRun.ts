import {
  FASTElement,
  customElement,
  attr,
  observable,
} from '@microsoft/fast-element';
import template from './wesRun.template.js';
import styles from './wesRun.styles.js';
import { cancelWorkflow, fetchWorkflow } from '../../../data/index.js';

@customElement({
  name: 'ecc-client-ga4gh-wes-run',
  template,
  styles,
})
export default class WESRun extends FASTElement {
  @attr baseURL = '';

  @attr id = '';

  @attr state = '';

  @observable isLoading = true;

  @observable data: any = {};

  connectedCallback() {
    super.connectedCallback();
    // this.handleFetch();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // Handles deletion of this workflow
  handleDelete = async () => {
    // Delete if baseURL is privided
    if (this.baseURL.length !== 0) await cancelWorkflow(this.baseURL, this.id);
  };

  // Fetched the workflow with this ID
  handleFetch = async () => {
    // Only fetch the data if not already fetched and base URL is provided
    if (this.isLoading && this.baseURL.length !== 0) {
      this.data = await fetchWorkflow(this.baseURL, this.id);
      this.isLoading = false;
    }
  };
}
