import { html, fixture, expect } from '@open-wc/testing';
import { DesignSystem } from '@microsoft/fast-foundation';
import TESGetRuns from '../defintion/tesGetRuns.js';

DesignSystem.getOrCreate().register(TESGetRuns);

describe('TESGetRuns', () => {
  it('should have a default baseURL of an empty string', async () => {
    const el = await fixture<TESGetRuns>(
      html`<ecc-tes-get-runs></ecc-tes-get-runs>`,
    );
    expect(el.baseURL).to.equal('');
  });

  it('should have a default pageSize of 5', async () => {
    const el = await fixture<TESGetRuns>(
      html`<ecc-tes-get-runs></ecc-tes-get-runs>`,
    );
    expect(el.pageSize).to.equal(5);
  });

  it('should initialize with isLoading set to true', async () => {
    const el = await fixture<TESGetRuns>(
      html`<ecc-tes-get-runs></ecc-tes-get-runs>`,
    );
    expect(el.isLoading).to.equal(true);
  });
});
