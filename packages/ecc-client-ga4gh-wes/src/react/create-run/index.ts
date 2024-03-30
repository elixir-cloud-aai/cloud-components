import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/create-run/create-run.js';

const tagName = 'ecc-client-ga4gh-wes-create-run';
window.customElements.define('ecc-client-ga4gh-wes-create-run', Component);

/**
 * @summary This component is used to create task runs using WES API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL
 *
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'EccClientGaGhWesCreateRun',
});

export default reactWrapper;
