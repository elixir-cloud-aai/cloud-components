import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { DesignSystem } from '@microsoft/fast-foundation';
import TESCreateRun from '../definition/tesCreateRun.js';

DesignSystem.getOrCreate().register(TESCreateRun);

describe('TESCreateRun', () => {
  it('should have a default baseURL of an empty string', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.baseURL).equal('');
  });

  it('should have a default name of "myTask"', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.name).equal('');
  });

  it('should have a default state of "UNKNOWN"', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.state).equal('UNKNOWN');
  });

  it('should have a default description of "myTask"', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.description).equal('');
  });

  it('should have a default executors array with length 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.executorsLength).equal(1);
  });

  it('should have a default output length 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.outputLength).equal(1);
  });

  it('should have a default input length 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.inputLength).equal(1);
  });

  it('should increase the executors fields on clicking add executors button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.executorsLength).equal(1);

    const addExecutorsButton = ele.shadowRoot?.querySelector(
      '#add-executors'
    ) as HTMLElement;

    addExecutorsButton.click();
    expect(ele.executorsLength).equal(2);
  });

  it('should increase the output fields on clicking add output button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.outputLength).equal(1);

    const addOutputButton = ele.shadowRoot?.querySelector(
      '#add-output'
    ) as HTMLElement;

    addOutputButton.click();
    expect(ele.outputLength).equal(2);
  });

  it('should increase the input fields on clicking add input button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.inputLength).equal(1);

    const addInputButton = ele.shadowRoot?.querySelector(
      '#add-input'
    ) as HTMLElement;

    addInputButton.click();
    expect(ele.inputLength).equal(2);
  });

  it('should decrease the executors fields on clicking delete executors button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addExecutorsButton = ele.shadowRoot?.querySelector(
      '#add-executors'
    ) as HTMLElement;

    expect(ele.executorsLength).equal(1);

    addExecutorsButton.click();

    await elementUpdated(ele);

    expect(ele.executorsLength).equal(2);

    const removeExecutorsButton = ele.shadowRoot?.querySelector(
      '#delete-executor'
    ) as HTMLElement;

    removeExecutorsButton.click();
    expect(ele.executorsLength).equal(1);

    removeExecutorsButton.click();
    expect(ele.executorsLength).equal(1);
  });

  it('should decrease the input fields on clicking delete input button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addInputButton = ele.shadowRoot?.querySelector(
      '#add-input'
    ) as HTMLElement;

    expect(ele.inputLength).equal(1);

    addInputButton.click();

    await elementUpdated(ele);

    expect(ele.inputLength).equal(2);

    const removeInputButton = ele.shadowRoot?.querySelector(
      '#delete-input'
    ) as HTMLElement;

    removeInputButton.click();
    expect(ele.inputLength).equal(1);

    removeInputButton.click();
    expect(ele.inputLength).equal(1);
  });

  it('should decrease the output fields on clicking delete input button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addOutputButton = ele.shadowRoot?.querySelector(
      '#add-output'
    ) as HTMLElement;

    expect(ele.outputLength).equal(1);

    addOutputButton.click();

    await elementUpdated(ele);

    expect(ele.outputLength).equal(2);

    const removeOutputButton = ele.shadowRoot?.querySelector(
      '#delete-output'
    ) as HTMLElement;

    removeOutputButton.click();
    expect(ele.inputLength).equal(1);

    removeOutputButton.click();
    expect(ele.inputLength).equal(1);
  });

  it('should update the name property when the name input changes', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="name"]'
    ) as HTMLInputElement;

    expect(ele.name).to.equal('');

    // Simulate input field value change
    inputField.value = 'New Task';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.name).to.equal('New Task');
  });

  it('should update the description property when the description input changes', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run
        description="This is a description"
      ></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="description"]'
    ) as HTMLInputElement;

    expect(ele.description).to.equal('This is a description');

    // Simulate input field value change
    inputField.value = 'New Description';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.description).to.equal('New Description');
  });

  it('should project-group tag on input changes', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="project-group"]'
    ) as HTMLInputElement;

    expect(ele.PROJECT_GROUP).to.equal('');

    // Simulate input field value change
    inputField.value = 'New Project';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.PROJECT_GROUP).to.equal('New Project');
  });

  it('should workflow-id tag on input changes', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="workflow-id"]'
    ) as HTMLInputElement;

    expect(ele.WORKFLOW_ID).to.equal('');

    // Simulate input field value change
    inputField.value = 'New Project';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.WORKFLOW_ID).to.equal('New Project');
  });

  it('should update the volumes on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="volumes"]'
    ) as HTMLInputElement;

    expect(ele.volumes.length).to.equal(0);

    // Simulate input field value change
    inputField.value = 'hello, world';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.volumes).to.deep.equal(['hello', 'world']);
  });

  it('should update zones on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="zones"]'
    ) as HTMLInputElement;

    expect(ele.zones.length).to.equal(0);

    // Simulate input field value change
    inputField.value = 'hello, world';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.zones).to.deep.equal(['hello', 'world']);
  });

  it('should update the preemptible property based on switch state', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const switchElement = ele.shadowRoot?.querySelector(
      'fast-switch[id="preemptible"]'
    ) as HTMLInputElement;

    expect(ele.preemptible).to.equal(false);

    // Simulate switch state change to checked
    switchElement.checked = true;
    switchElement.dispatchEvent(new Event('change'));

    expect(ele.preemptible).to.equal(true);

    // Simulate switch state change to unchecked
    switchElement.checked = false;
    switchElement.dispatchEvent(new Event('change'));

    expect(ele.preemptible).to.equal(true);
  });

  it('should update the cpu_cores property on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="cpu-cores"]'
    ) as HTMLInputElement;

    expect(ele.cpu_cores).to.equal('4');

    // Simulate input field value change
    inputField.value = '8';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.cpu_cores).to.equal('8');
  });

  it('should update the disk_gb property on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="disk-gb"]'
    ) as HTMLInputElement;

    expect(ele.disk_gb).to.equal('40');

    // Simulate input field value change
    inputField.value = '60';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.disk_gb).to.equal('60');
  });

  it('should update the ram_gb property on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="ram-gb"]'
    ) as HTMLInputElement;

    expect(ele.ram_gb).to.equal('8');

    // Simulate input field value change
    inputField.value = '16';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.ram_gb).to.equal('16');
  });

  it('should update the state property on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="state"]'
    ) as HTMLInputElement;

    expect(ele.state).to.equal('UNKNOWN');

    // Simulate input field value change
    inputField.value = 'RUNNING';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.state).to.equal('RUNNING');
  });
});