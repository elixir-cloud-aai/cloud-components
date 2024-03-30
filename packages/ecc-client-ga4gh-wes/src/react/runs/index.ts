import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/runs/runs.js';

const tagName = 'ecc-client-ga4gh-wes-runs';
window.customElements.define('ecc-client-ga4gh-wes-runs', Component);

/**
 * @summary This component facilitates browsing workflow runs via WES API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL
 * @property {number} pageSize - Number of runs per page
 * @property {array} fields - Configuration based on which data will be rendered in groups
 * @property {boolean} filter - Defines the rendering of the filter-by-state bar.
 *
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'EccClientGaGhWesRuns',
});

export default reactWrapper;
