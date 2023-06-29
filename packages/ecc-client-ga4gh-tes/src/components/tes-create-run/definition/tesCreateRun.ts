import {
  FASTElement,
  // attr,
  customElement,
  // observable,
} from '@microsoft/fast-element';
import template from './tesCreateRun.template.js';
import styles from './tesCreateRun.styles.js';

@customElement({
  name: 'ecc-client-ga4gh-tes-create-run',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESCreateRun extends FASTElement {}
