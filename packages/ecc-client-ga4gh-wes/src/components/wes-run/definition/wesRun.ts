import {
  FASTElement,
  customElement,
  attr,
  observable,
} from '@microsoft/fast-element';
import template from './wesRun.template.js';
import styles from './wesRun.styles.js';
import WorkflowData from './workflowData.js';
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

  @observable data: WorkflowData = {
    run_id: this.id,
    state: this.state,
    request: {
      workflow_params: {},
      workflow_type: '',
      workflow_type_version: '',
      tags: {
        additionalProp1: '',
        additionalProp2: '',
        additionalProp3: '',
      },
      workflow_engine_parameters: {
        additionalProp1: '',
        additionalProp2: '',
        additionalProp3: '',
      },
      workflow_url: '',
    },
    run_log: {
      name: '',
      cmd: [],
      start_time: '',
      end_time: '',
      stdout: '',
      stderr: '',
      exit_code: 0,
    },
    task_logs: [
      {
        name: '',
        cmd: [],
        start_time: '',
        end_time: '',
        stdout: '',
        stderr: '',
        exit_code: 0,
      },
    ],
    outputs: {},
  };

  connectedCallback() {
    super.connectedCallback();
    this.handleFetch();
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
