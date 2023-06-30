import { html } from '@microsoft/fast-element';
import TESCreateRun from './tesCreateRun.js';

const template = html<TESCreateRun>`
  <button @click=${x => x.handleClick()}>Click me</button>
`;

export default template;
