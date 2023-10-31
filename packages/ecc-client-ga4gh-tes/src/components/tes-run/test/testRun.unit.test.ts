import { html, fixture, expect } from '@open-wc/testing';
import { DesignSystem } from '@microsoft/fast-foundation';
import TESRun from '../definition/tesRun.js';

DesignSystem.getOrCreate().register(TESRun);

const baseURL = 'https://csc-tesk-noauth.rahtiapp.fi/v1';

describe('TESRun', () => {
  it('should have a default baseURL of an empty string', async () => {
    const ele = await fixture<TESRun>(
      html`<ecc-client-ga4gh-tes-run></ecc-client-ga4gh-tes-run>`
    );
    expect(ele.baseURL).to.equal('');
  });

  it('should set the baseURL correctly', async () => {
    const ele = await fixture<TESRun>(
      html`<ecc-client-ga4gh-tes-run
        baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"
      ></ecc-client-ga4gh-tes-run>`
    );
    expect(ele.getAttribute('baseURL')).to.equal(baseURL);
  });

  it('should set the task id correctly', async () => {
    const ele = await fixture<TESRun>(
      html`<ecc-client-ga4gh-tes-run id="1234"></ecc-client-ga4gh-tes-run>`
    );
    expect(ele.getAttribute('id')).to.equal('1234');
  });

  it('should set the task state correctly', async () => {
    const ele = await fixture<TESRun>(
      html`<ecc-client-ga4gh-tes-run id="DELETE"></ecc-client-ga4gh-tes-run>`
    );
    expect(ele.getAttribute('id')).to.equal('DELETE');
  });

  it('should have isLoading set to true by default', async () => {
    const ele = await fixture<TESRun>(
      html`<ecc-client-ga4gh-tes-run></ecc-client-ga4gh-tes-run>`
    );
    expect(ele.isLoading).to.be.equal(true);
  });
});
