import { FASTElement, attr, customElement } from '@microsoft/fast-element';
import template from './wesCreateRun.template.js';
import styles from './wesCreateRun.styles.js';

@customElement({
  name: 'ecc-client-ga4gh-wes-create-run',
  template,
  styles,
})
export default class WESCreateRun extends FASTElement {
  // Base URL, provided by app author
  @attr baseURL = '';
}
