import {
  FASTElement,
  attr,
  customElement,
  observable,
} from '@microsoft/fast-element';
import template from './tesService.template.js';
import styles from './tesService.styles.js';
import { fetchService } from '../../../data/Task/tesGet.js';

@customElement({
  name: 'ecc-client-ga4gh-tes-service',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESService extends FASTElement {
  @attr baseURL = '';

  @observable data: any = {};

  async connectedCallback() {
    super.connectedCallback();
    this.data = await fetchService(this.baseURL);
    console.log(this.data);
  }
}
