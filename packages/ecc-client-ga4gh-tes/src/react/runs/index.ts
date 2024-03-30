import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/runs/runs.js';

const tagName = 'ecc-client-ga4gh-tes-runs';
window.customElements.define('ecc-client-ga4gh-tes-runs', Component);

const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'EccClientGaGhTesRuns',
});

export default reactWrapper;
