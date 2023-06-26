import { html, fixture, expect } from '@open-wc/testing';
import { DesignSystem } from '@microsoft/fast-foundation';
import TESRuns from '../defintion/tesRuns.js';

DesignSystem.getOrCreate().register(TESRuns);

describe('TESGetRuns', () => {
  it('should have a default baseURL of an empty string', async () => {
    const el = await fixture<TESRuns>(
      html`<ecc-client-ga4gh-tes-runs></ecc-client-ga4gh-tes-runs>`,
    );
    expect(el.baseURL).to.equal('');
  });

  it('should have a default pageSize of 5', async () => {
    const el = await fixture<TESRuns>(
      html`<ecc-client-ga4gh-tes-runs></ecc-client-ga4gh-tes-runs>`,
    );
    expect(el.pageSize).to.equal(5);
  });

  it('should initialize with isLoading set to true', async () => {
    const el = await fixture<TESRuns>(
      html`<ecc-client-ga4gh-tes-runs></ecc-client-ga4gh-tes-runs>`,
    );
    expect(el.isLoading).to.equal(true);
  });
});
