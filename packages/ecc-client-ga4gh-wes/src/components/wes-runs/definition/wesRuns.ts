import { FASTElement, customElement } from '@microsoft/fast-element';
import template from './wesRuns.template.js';
import styles from './wesRuns.styles.js';

@customElement({
  name: 'ecc-client-ga4gh-wes-runs',
  template,
  styles,
})
export default class WESRuns extends FASTElement {}
