import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './wesCreateRun.template.js';
import styles from './wesCreateRun.styles.js';
import { postWorkflow } from '../../../data/Workflow/wesGet.js';

@customElement({
  name: 'ecc-client-ga4gh-wes-create-run',
  template,
  styles,
})
export default class WESCreateRun extends FASTElement {
  // Base URL, provided by app author
  @attr baseURL = '';

  @observable data: FormData = new FormData();

  @observable response: any = {};

  handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const { name } = input;

    // If it's a file input, append each file to the FormData
    if (input.type === 'file') {
      for (const file of input.files as FileList) {
        // Check if the key exists in the FormData, and if so, delete it before appending the updated value
        if (this.data.has(name)) {
          this.data.delete(name);
        }
        this.data.append(name, file);
      }
    } else {
      // Check if the key exists in the FormData, and if so, delete it before appending the updated value
      if (this.data.has(name)) {
        this.data.delete(name);
      }
      this.data.append(name, input.value);
    }
  };

  handleSubmit = async () => {
    const response = await postWorkflow(this.baseURL, this.data);
    this.response = response;
  };
}
