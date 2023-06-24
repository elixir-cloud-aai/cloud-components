import { html, fixture, expect } from '@open-wc/testing';
import { DesignSystem } from '@microsoft/fast-foundation';
import TESGetRun from '../tesGetRun.js';

DesignSystem.getOrCreate().register(TESGetRun);

const baseURL = 'https://csc-tesk-noauth.rahtiapp.fi/v1';

describe('TESGetRun', () => {
  it('should have a default baseURL of an empty string', async () => {
    const ele = await fixture<TESGetRun>(html`<ecc-tes-get-run></ecc-tes-get-run>`);
    expect(ele.baseURL).to.equal('');
  });

  it('should set the baseURL correctly', async () => {
    const ele = await fixture<TESGetRun>(html`<ecc-tes-get-run baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"></ecc-tes-get-run>`);
    expect(ele.baseURL).to.equal(baseURL);
  });

  it('should set the task id correctly', async () => {
    const ele = await fixture<TESGetRun>(html`<ecc-tes-get-run id="1234"></ecc-tes-get-run>`);
    expect(ele.id).to.equal('1234');
  });

  it('should set the task state correctly', async () => {
    const ele = await fixture<TESGetRun>(html`<ecc-tes-get-run id="DELETE"></ecc-tes-get-run>`);
    expect(ele.id).to.equal('DELETE');
  });

  it('should have isLoading set to true by default', async () => {
    const ele = await fixture<TESGetRun>(html`<ecc-tes-get-run></ecc-tes-get-run>`);
    expect(ele.isLoading).to.be.equal(true);
  });
});
