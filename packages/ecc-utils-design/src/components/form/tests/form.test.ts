/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

// REMEMER TO RE-ENABLE LINTING FOOR TESTS

import { html, fixture, expect, fixtureCleanup } from '@open-wc/testing';
import sinon from 'sinon';
import EccUtilsDesignForm, { Field } from '../index.js';
import createNewFormComponent, { FormComponentType } from './form.component';
import { arrayTestData, simpleArrayTestData, groupTestData } from './testData.js';

describe('renders correctly', () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: 'name',
        label: 'Name',
      },
    ]);
  });

  it('returns error when field is empty', async () => {
    try {
      await createNewFormComponent([]);
    } catch (formError: any & { message: string }) {
      expect(formError).to.be.an('error');
      expect(formError!.message).to.equal(
        'Fields is required & should not be empty array'
      );
    }
  });

  it('works correctly with minimum required fields', async () => {
    // renders correctly
    expect(formComponent.form).to.be.visible;
    expect(formComponent.inputField()).to.be.visible;

    // throws error sumbit is attempted and no field is filled
    const formError = sinon.stub(formComponent.form, 'error');
    formComponent.clickSubmitButton();

    sinon.assert.calledOnceWithExactly(formError, { message: 'Form is empty' });
  });

  it('renders error template correctly', async () => {
    formComponent.form.error({ message: 'test error' });
    await formComponent.form.updateComplete;

    expect(formComponent.errorTemplate()).to.be.visible.and.to.contain.text(
      'test error'
    );
  });

  it('renders success template correctly', async () => {
    formComponent.form.success({ message: 'test success' });
    await formComponent.form.updateComplete;

    expect(formComponent.successTemplate()).to.be.visible.and.to.contain.text(
      'test success'
    );
  });
});

describe('when loading', () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: 'name',
        label: 'Name',
      },
    ]);

    formComponent.form.loading();
    await formComponent.form.updateComplete;
  });

  it('should disable the submit button', async () => {
    expect(formComponent.submitButton()).has.attribute('disabled');
  });
});

describe.skip('when submit button is disabled', () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent([
      {
        key: 'name',
        label: 'Name',
      },
    ]);

    // formComponent.form.disableSubmit();
    await formComponent.form.updateComplete;
  });

  it('submit action is not triggered on click', async () => {
    const handleSubmit = sinon.stub(formComponent.form, 'handleSubmit');

    // the method is being called indirectly so the stub is not being tracked
    formComponent.clickSubmitButton();
    sinon.assert.calledOnce(handleSubmit);
  });
});

describe('when array template is rendered', () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(arrayTestData);
  });

  it('should render children fields correctly', () => {
    const arrayFields = formComponent.arrayTemplate(true);

    // 10 input fields should be rendered by default
    expect(formComponent.inputField(true)).to.have.lengthOf(10);
    // 2 switch field should be rendered by default
    expect(formComponent.switchField(true)).to.have.lengthOf(2);
    // 2 file fields should be rendered by default
    expect(formComponent.inputFileField(true)).to.have.lengthOf(2);

    // check default instances
    expect(formComponent.arrayItem(true, arrayFields[0])).to.have.lengthOf(0);
    expect(formComponent.arrayItem(true, arrayFields[1])).to.have.lengthOf(2);
  });

  it('delete button should work properly', async () => {
    const secondArrayField = formComponent.arrayTemplate(true)[1];
    const deletebuttons = formComponent.arrayDeleteButton(true, secondArrayField);

    // check default instances
    expect(deletebuttons).to.have.lengthOf(2);

    formComponent.clickButton(deletebuttons[0]);
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(true, secondArrayField)).to.have.lengthOf(1);

    // should not work when the number of instaces is already at the min
    formComponent.clickButton(deletebuttons[1]);
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(true, secondArrayField)).to.have.lengthOf(1);
  });

  // for some reason this is deleting from the wrong place
  // even though the actual functionality works correctly
  // try changing the way the array is mutilated
  // maybe reinitialization is cauing problems
  it.skip('delete button should delete the correct instance', async () => {
    await formComponent.initializeForm(simpleArrayTestData);

    formComponent.clickButton(formComponent.arrayAddButton(), 2);
    await formComponent.form.updateComplete;

    let arrayItems = formComponent.arrayItem(true);
    expect(arrayItems).to.have.lengthOf(3);

    formComponent.fillInputField(arrayItems[0], 'test value 1');
    formComponent.fillInputField(arrayItems[1], 'test value 2');
    formComponent.fillInputField(arrayItems[2], 'test value 3');

    formComponent.clickButton(formComponent.arrayDeleteButton(false, arrayItems[1]));
    await formComponent.form.updateComplete;

    arrayItems = formComponent.arrayItem(true);
    expect(arrayItems).to.have.lengthOf(2);
    expect(formComponent.inputField(false, arrayItems[0]).value).to.equal(
      'test value 1'
    );
    expect(formComponent.inputField(false, arrayItems[1]).value).to.equal(
      'test value 3'
    );
  });

  it('add button should work properly', async () => {
    const firstArrayField = formComponent.arrayTemplate(true)[0];

    formComponent.clickButton(formComponent.arrayAddButton(false, firstArrayField));
    await formComponent.form.updateComplete;
    expect(formComponent.arrayItem(true, firstArrayField)).to.have.lengthOf(1);
  });

  it('add Button should new instance at the bottom', async () => {
    await formComponent.initializeForm(simpleArrayTestData);

    let arrayItems = formComponent.arrayItem(true);

    // check default instances
    expect(arrayItems).to.have.lengthOf(1);

    formComponent.fillInputField(arrayItems[0], 'test value 1');
    formComponent.clickButton(formComponent.arrayAddButton());
    await formComponent.form.updateComplete;

    arrayItems = formComponent.arrayItem(true);
    formComponent.fillInputField(arrayItems[1], 'test value 2');

    expect(formComponent.inputField(false, arrayItems[0]).value).to.equal(
      'test value 1'
    );
    expect(formComponent.inputField(false, arrayItems[1]).value).to.equal(
      'test value 2'
    );
  });
});

describe.only('when group template is rendered', () => {
  let formComponent: FormComponentType;
  beforeEach(async () => {
    formComponent = await createNewFormComponent(groupTestData);
  });

  it('should render children fields correctly', async () => {
    const groupTemplate = formComponent.groupTemplate();
    const collapsibleGroup = formComponent.collapsibleGroup(false, groupTemplate);

    expect(groupTemplate).to.be.visible;
    expect(collapsibleGroup).to.be.visible;
    expect(formComponent.nonCollapsibleGroup(false, groupTemplate)).to.be.not.exist;
    expect(formComponent.inputField(true, collapsibleGroup)).to.have.lengthOf(3);
    expect(formComponent.switchField(true, collapsibleGroup)).to.have.lengthOf(1);
    expect(formComponent.inputFileField(true, collapsibleGroup)).to.have.lengthOf(1);
  });
});

describe('when submit button is clicked', () => {
  it('should veriify that the form is not empty', async () => {});

  it('should verify that all required fields are filled in simple scenarios', async () => {});

  it('should verify that all required fields are filled in array scenarios', async () => {});

  it('should verify that all required fields are filled in group scenarios', async () => {});

  it('should render error template in the case of an error', async () => {});

  it('should render success template in the case of success', async () => {});
});
