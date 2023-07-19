import { FASTElement, customElement, html, css } from '@microsoft/fast-element';

const template = html`<div class="container">Hello</div>`;

const styles = css`
  .container {
    background-color: red;
  }
`;

@customElement({
  name: 'ecc-client-ga4gh-wes-runs',
  template,
  styles,
})
export default class WESRuns extends FASTElement {}
