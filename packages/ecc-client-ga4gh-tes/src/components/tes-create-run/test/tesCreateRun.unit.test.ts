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
    expect(ele.taskExecutorsLength).equal(1);
  });

  it('should have a default output length 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.taskOutputLength).equal(1);
  });

  it('should have a default input length 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );
    expect(ele.taskInputLength).equal(1);
  });

  it('should increase the executors fields on clicking add executors button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.taskExecutorsLength).equal(1);

    const addExecutorsButton = ele.shadowRoot?.querySelector(
      '#add-executors'
    ) as HTMLElement;

    addExecutorsButton.click();
    expect(ele.taskExecutorsLength).equal(2);
  });

  it('should increase the output fields on clicking add output button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.taskOutputLength).equal(1);

    const addOutputButton = ele.shadowRoot?.querySelector(
      '#add-output'
    ) as HTMLElement;

    addOutputButton.click();
    expect(ele.taskOutputLength).equal(2);
  });

  it('should increase the input fields on clicking add input button', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    expect(ele.taskInputLength).equal(1);

    const addInputButton = ele.shadowRoot?.querySelector(
      '#add-input'
    ) as HTMLElement;

    addInputButton.click();
    expect(ele.taskInputLength).equal(2);
  });

  it('should decrease the executors fields on clicking delete executors button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addExecutorsButton = ele.shadowRoot?.querySelector(
      '#add-executors'
    ) as HTMLElement;

    expect(ele.taskExecutorsLength).equal(1);

    addExecutorsButton.click();

    await elementUpdated(ele);

    expect(ele.taskExecutorsLength).equal(2);

    const removeExecutorsButton = ele.shadowRoot?.querySelector(
      '#delete-executor'
    ) as HTMLElement;

    removeExecutorsButton.click();
    expect(ele.taskExecutorsLength).equal(1);

    removeExecutorsButton.click();
    expect(ele.taskExecutorsLength).equal(1);
  });

  it('should decrease the input fields on clicking delete input button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addInputButton = ele.shadowRoot?.querySelector(
      '#add-input'
    ) as HTMLElement;

    expect(ele.taskInputLength).equal(1);

    addInputButton.click();

    await elementUpdated(ele);

    expect(ele.taskInputLength).equal(2);

    const removeInputButton = ele.shadowRoot?.querySelector(
      '#delete-input'
    ) as HTMLElement;

    removeInputButton.click();
    expect(ele.taskInputLength).equal(1);

    removeInputButton.click();
    expect(ele.taskInputLength).equal(1);
  });

  it('should decrease the output fields on clicking delete input button but not below 1', async () => {
    const ele = await fixture<TESCreateRun>(
      html`<ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>`
    );

    const addOutputButton = ele.shadowRoot?.querySelector(
      '#add-output'
    ) as HTMLElement;

    expect(ele.taskOutputLength).equal(1);

    addOutputButton.click();

    await elementUpdated(ele);

    expect(ele.taskOutputLength).equal(2);

    const removeOutputButton = ele.shadowRoot?.querySelector(
      '#delete-output'
    ) as HTMLElement;

    removeOutputButton.click();
    expect(ele.taskOutputLength).equal(1);

    removeOutputButton.click();
    expect(ele.taskOutputLength).equal(1);
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

  it('should update the executors image on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="image"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].image).to.equal('');

    // Simulate input field value change
    inputField.value = 'my_image';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].image).to.equal('my_image');
  });

  it('should update the executors stderr on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="stderr"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].stderr).to.equal('');

    // Simulate input field value change
    inputField.value = 'my_stderr';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].stderr).to.equal('my_stderr');
  });

  it('should update the executors stdout on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="stdout"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].stdout).to.equal('');

    // Simulate input field value change
    inputField.value = 'my_stdout';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].stdout).to.equal('my_stdout');
  });

  it('should update the executors stdin on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="stdin"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].stdin).to.equal('');

    // Simulate input field value change
    inputField.value = 'my_stdin';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].stdin).to.equal('my_stdin');
  });

  it('should update the executors working directory on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="workdir"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].workdir).to.equal('');

    // Simulate input field value change
    inputField.value = 'my_working_directory';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].workdir).to.equal('my_working_directory');
  });

  it('should update the executors environment variables on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const addEnvButton = ele.shadowRoot?.querySelector(
      'fast-button[id="add-env"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].env).to.deep.equal({});

    addEnvButton.click();
    await elementUpdated(ele);

    const inputNameField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="env-name"]'
    ) as HTMLInputElement;

    const inputValueField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="env-value"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].env).to.deep.equal({ '': '' });

    // Simulate input field value change
    inputNameField.value = 'key';
    inputNameField.dispatchEvent(new Event('input'));

    inputValueField.value = 'value';
    inputValueField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].env).to.deep.equal({ key: 'value' });
  });

  it('should delete the executors environment variables on clicking delete', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    expect(ele.taskExecutors[0].env).to.deep.equal({});

    const addEnvButton = ele.shadowRoot?.querySelector(
      'fast-button[id="add-env"]'
    ) as HTMLInputElement;

    addEnvButton.click();
    await elementUpdated(ele);

    expect(ele.taskExecutors[0].env).to.deep.equal({ '': '' });

    const inputNameField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="env-name"]'
    ) as HTMLInputElement;

    const inputValueField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="env-value"]'
    ) as HTMLInputElement;

    expect(ele.taskExecutors[0].env).to.deep.equal({ '': '' });

    // Simulate input field value change
    inputNameField.value = 'key';
    inputNameField.dispatchEvent(new Event('input'));

    inputValueField.value = 'value';
    inputValueField.dispatchEvent(new Event('input'));

    expect(ele.taskExecutors[0].env).to.deep.equal({ key: 'value' });

    const deleteEnvButton = ele.shadowRoot?.querySelector(
      'fast-button[id="delete-env"]'
    ) as HTMLInputElement;

    deleteEnvButton.click();
    await elementUpdated(ele);

    expect(ele.taskExecutors[0].env).to.deep.equal({});
  });

  it('should update the input path on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="input-path"]'
    ) as HTMLInputElement;

    expect(ele.taskInput[0].path).to.equal('');

    // Simulate input field value change
    inputField.value = '/new/input/path';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskInput[0].path).to.equal('/new/input/path');
  });

  it('should update the input url on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="input-url"]'
    ) as HTMLInputElement;

    expect(ele.taskInput[0].url).to.equal('');

    // Simulate input field value change
    inputField.value = 'http://example.com/new/input';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskInput[0].url).to.equal('http://example.com/new/input');
  });

  it('should update the output path on output', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="output-path"]'
    ) as HTMLInputElement;

    expect(ele.taskOutput[0].path).to.equal('');

    // Simulate input field value change
    inputField.value = '/new/output/path';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskOutput[0].path).to.equal('/new/output/path');
  });

  it('should update the output url on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="output-url"]'
    ) as HTMLInputElement;

    expect(ele.taskOutput[0].url).to.equal('');

    // Simulate input field value change
    inputField.value = 'http://example.com/new/output';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskOutput[0].url).to.equal('http://example.com/new/output');
  });

  it('should update the output type on input', async () => {
    const ele = await fixture<TESCreateRun>(
      html`
        <ecc-client-ga4gh-tes-create-run
          .taskOutput="${[
            {
              path: '',
              url: '',
              type: '',
            },
          ]}"
        ></ecc-client-ga4gh-tes-create-run>
      `
    );

    const inputField = ele.shadowRoot?.querySelector(
      'fast-text-field[id="output-type"]'
    ) as HTMLInputElement;

    expect(ele.taskOutput[0].type).to.equal('');

    // Simulate input field value change
    inputField.value = 'new_output_type';
    inputField.dispatchEvent(new Event('input'));

    expect(ele.taskOutput[0].type).to.equal('new_output_type');
  });
});
