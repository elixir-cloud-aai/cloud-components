/* eslint no-param-reassign: 0 */
/* eslint class-methods-use-this: 0 */
/*
To effectively handle the executors, inputs, and outputs sections of the taskData, the mentioned
rules are disabled specifically in this module. The underlying directive utilizes "repeat"
to handle the mentioned data. The approach to address these rules would be to pass the
index value to the respective handler and update the state accordingly.

eg
  ``` html
  ${repeat(x=>x.data,
  html`
  <input @input=${(x,c)=>c.parent.handleDataFieldChange(c.event, c.index)}></input>
  `,
  {positioning : true}
  )}
  ````
  ``` Ts
  handleDataFieldChange = (event: Event, index: number) => {
    this.data[index] = (event.target as HTMLInputElement).value;
  };
  ```
  This would be the ideal way to handle the above mentioned rules, note this way uses
  `this` in the class method and no params are being reassigned.

But as mentioned in the above, the code uses { positioning: true } to get the index value, this as mentioned
in the [FAST documentation](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive:~:text=Some%20context%20properties,template%20from%20above%3A)
can have performance issues, hence these rules are opted out.
*/
import {
  FASTElement,
  attr,
  observable,
  customElement,
} from '@microsoft/fast-element';
import template from './tesCreateRun.template.js';
import styles from './tesCreateRun.styles.js';
import { ExecutorData, InputData, OutputData } from './createTask.js';
import { postTask } from '../../../data/Task/tesGet.js';

const executorTemplate: ExecutorData = {
  command: [''],
  env: {},
  image: '',
  stderr: '',
  stdin: '',
  stdout: '',
  workdir: '',
};

const inputTemplate: InputData = {
  path: '',
  url: '',
};

const outputTemplate: OutputData = {
  path: '',
  url: '',
  type: '',
};
@customElement({
  name: 'ecc-client-ga4gh-tes-create-run',
  template,
  styles,
  shadowOptions: { mode: 'open' },
})
export default class TESCreateRun extends FASTElement {
  @attr baseURL = '';

  @attr name = '';

  @attr description = '';

  @attr taskExecutors: ExecutorData[] = [{ ...executorTemplate }];

  @observable taskExecutorsLength = this.taskExecutors.length;

  @attr taskInput: InputData[] = [{ ...inputTemplate }];

  @observable taskInputLength = this.taskInput.length;

  @attr taskOutput: OutputData[] = [{ ...outputTemplate }];

  @observable taskOutputLength = 1;

  @attr cpu_cores = '';

  @attr disk_gb = '';

  @attr preemptible = false;

  @attr ram_gb = '';

  @attr zones: string[] = [];

  @attr WORKFLOW_ID = '';

  @attr PROJECT_GROUP = '';

  @attr volumes: string[] = [];

  @observable response: any = { id: 'id' };

  @observable taskData: any = {
    name: this.name,
    description: this.description,
    executors: this.taskExecutors,
    inputs: this.taskInput,
    outputs: this.taskOutput,
    resources: {
      cpu_cores: this.cpu_cores,
      disk_gb: this.disk_gb,
      preemptible: this.preemptible,
      ram_gb: this.ram_gb,
      zones: this.zones,
    },
    tags: {
      WORKFLOW_ID: this.WORKFLOW_ID,
      PROJECT_GROUP: this.PROJECT_GROUP,
    },
    volumes: this.volumes,
  };

  @observable responseGot = false;

  @observable isLoading = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.taskExecutorsLength = this.taskExecutors.length;
    this.taskInputLength = this.taskInput.length;
    this.taskOutputLength = this.taskOutput.length;
  }

  removeEmptyFields = (obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      // If the key is array
      if (Array.isArray(value)) {
        // If the array is empty remove this key value pair
        if (value.length === 0) {
          delete obj[key];
        } else {
          // Clean out all the objects to remove empty fields
          value.forEach((element) => {
            if (typeof element === 'object' && element !== null) {
              this.removeEmptyFields(element);
            }
          });

          // Check if this object became empty, if so remove this too.
          value.forEach((element, index) => {
            if (
              typeof element === 'object' &&
              Object.entries(element).length === 0
            ) {
              value.splice(index, 1);
            }
          });
          if (value.length === 0) {
            delete obj[key];
          }
        }
      } else if (value && typeof value === 'object') {
        // if this object is empty remove it
        if (Object.entries(value).length === 0) {
          delete obj[key];
        } else {
          // Else remove all the empty fields from the objects
          this.removeEmptyFields(value);

          // Check if this made current objects empty, if so remove it
          if (Object.entries(value).length === 0) {
            delete obj[key];
          }
        }
      }
      // remove all the empty empty values
      else if (value === null || value === undefined || value === '') {
        delete obj[key];
      }
    });
    return obj;
  };

  /**
   * Checks is the reponse of the sumbmission has a specified key
   * @param key The key to be checked in response
   * @returns true is the response has the said key
   */
  reponseHas = (key: string) => {
    if (Object.prototype.hasOwnProperty.call(this.response, key)) {
      return true;
    }
    return false;
  };

  /**
   * Handles submit button click
   */
  handleSubmit = async () => {
    this.responseGot = false;
    this.isLoading = true;

    // Set the form to the value filled but user in respective attr
    this.setFormDataToDefault();

    this.checkRequiredFields();
    if (Object.prototype.hasOwnProperty.call(this.response, 'error')) {
      this.isLoading = false;
      this.responseGot = true;
      this.clearForm();
      return;
    }

    // Remove empty fields
    this.removeEmptyFields(this.taskData);

    const isValid = this.isJSONValid(this.taskData);
    if (!isValid) {
      this.response = {
        error: 'Invalid JSON form the form data.',
      };
      this.responseGot = true;
      this.isLoading = false;
    }

    // Call API to create task
    this.response = await postTask(this.baseURL, this.taskData);
    this.isLoading = false;
    this.responseGot = true;

    // Handle with response
    console.log(this.response);

    // Clear form
    this.clearForm();
  };

  /**
   * Clears all the fields and sets the value to empty
   */
  clearForm = () => {
    /* Reconstruct the taskData because it might have been emptied due
    to removeEmptyField fucn. */
    this.taskData = {
      name: this.name,
      description: this.description,
      executors: this.taskExecutors,
      inputs: this.taskInput,
      outputs: this.taskOutput,
      resources: {
        cpu_cores: this.cpu_cores,
        disk_gb: this.disk_gb,
        preemptible: this.preemptible,
        ram_gb: this.ram_gb,
        zones: this.zones,
      },
      tags: {
        WORKFLOW_ID: this.WORKFLOW_ID,
        PROJECT_GROUP: this.PROJECT_GROUP,
      },
      volumes: this.volumes,
    };

    // Clear the form
    this.baseURL = '';
    this.name = '';
    this.description = '';
    this.taskExecutors = [{ ...executorTemplate }];
    this.taskInput = [{ ...inputTemplate }];
    this.taskOutput = [{ ...outputTemplate }];
    this.cpu_cores = '';
    this.disk_gb = '';
    this.preemptible = false;
    this.ram_gb = '';
    this.zones = [];
    this.WORKFLOW_ID = '';
    this.PROJECT_GROUP = '';
    this.volumes = [];

    this.setFormDataToDefault();
  };

  /**
   * Set all the form fields to the value of the attr in current state
   */
  setFormDataToDefault = () => {
    this.taskData.name = this.name;
    this.taskData.description = this.description;
    this.taskData.executors = this.taskExecutors;
    this.taskData.inputs = this.taskInput;
    this.taskData.outputs = this.taskOutput;
    this.taskData.resources.cpu_cores = this.cpu_cores;
    this.taskData.resources.disk_gb = this.disk_gb;
    this.taskData.resources.preemptible = this.preemptible;
    this.taskData.resources.ram_gb = this.ram_gb;
    this.taskData.resources.zones = this.zones;
    this.taskData.tags.WORKFLOW_ID = this.WORKFLOW_ID;
    this.taskData.tags.PROJECT_GROUP = this.PROJECT_GROUP;
    this.taskData.volumes = this.volumes;
  };

  /**
   * Checks if all the required fields ie command, image, and workdir is filled
   * @returns break and sets response to error message is required fields aren't filled
   */
  checkRequiredFields = () => {
    // Perform checks for required fields
    const requiredFields = ['image', 'workdir'];
    for (const executor of this.taskData.executors) {
      for (const field of requiredFields) {
        if (
          !executor[field] ||
          (Array.isArray(executor[field]) && executor[field].length === 0)
        ) {
          this.response = {
            error: `${field} cannot be left empty`,
            breakpoint: 'handleSubmit',
          };
          return;
        }
      }
    }
  };

  /**
   * Checks if an obj is a valid JSON
   * @param obj Takes in an object to be checked
   * @returns boolean, true if obj is valid JSON and vice versa
   */
  isJSONValid(obj: any): boolean {
    try {
      const jsonString = JSON.stringify(obj); // Serialize to JSON
      JSON.parse(jsonString); // Deserialize JSON back to an object
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handles the input for the data thats non-dynamic, ie only of is present.
   * @param event The input event triggered when the disk-gb input changes
   */
  handleDataChange = (event: Event) => {
    const { name } = event.target as HTMLInputElement;
    const { value } = event.target as HTMLInputElement;
    switch (name) {
      case 'name':
        this.name = value;
        break;
      case 'description':
        this.description = value;
        break;
      case 'cpu_cores':
        this.cpu_cores = value;
        break;
      case 'disk_gb':
        this.disk_gb = value;
        break;
      case 'ram_gb':
        this.ram_gb = value;
        break;
      case 'workflow_id':
        this.WORKFLOW_ID = value;
        break;
      case 'project_group':
        this.PROJECT_GROUP = value;
        break;
      default:
        break;
    }
  };

  fillFormAgain = () => {
    this.responseGot = false;

    // Clear the prev form data
    this.clearForm();

    // Clear prev response
    this.response = {};
  };

  /**
   * Handles the zones input for the task
   * - zones - Request that the task be run in these compute zones
   * @param event The input event triggered when the zones input changes
   */
  handleZonesInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    // Separate the input by ',' and remove the white spaces
    this.zones = inputElement.value.split(',').map((volume) => volume.trim());
  };

  /**
   * Handles the preemptible input for the task
   * - preemptible - Define if the task is allowed to run on
   *  preemptible compute instances, for example, AWS Spot
   * @param event The input event triggered when the preemptible input changes
   */
  handlePreemptibleInput = (event: Event) => {
    if (
      (event.target as HTMLInputElement).getAttribute('aria-checked') === 'true'
    ) {
      this.preemptible = true;
    } else {
      (event.target as HTMLInputElement).setAttribute('aria-checked', 'true');
      this.preemptible = false;
    }
  };

  /**
   * Handles the volumes input for the task
   * - volumes - Volumes are directories which may be used to share data between Executors
   * @param event The input event triggered when the volumes input changes
   */
  handleVolumesInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    // Separate the input by ',' and remove the white spaces
    this.volumes = inputElement.value.split(',').map((volume) => volume.trim());
  };

  /**
   * Handles the change of the command input in the executor fields
   * @param event The input event triggered when the command input changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsCommandChange = (event: Event, executor: ExecutorData) => {
    const newCommands = (event.target as HTMLInputElement).value;

    // Split the string with the separator "," and remove white space
    executor.command = newCommands.split(',').map((c) => c.trim());
  };

  /**
   * Handles the change of the name field of env of the executor field
   * @param event The event triggered when the name field of env from any executor changes
   * @param executor The specific executor in the taskExecutors that is being changed
   * @param index The index of the env being changes if considered as an array
   */
  handleEnvNameChange = (
    event: Event,
    executor: ExecutorData,
    index: number
  ) => {
    const newEnvName = (event.target as HTMLInputElement).value;
    const entries = Object.entries(executor.env);
    entries[index][0] = newEnvName;
    executor.env = Object.fromEntries(entries);
  };

  /**
   * Handles the change of the value field of env of the executor field
   * @param event The event triggered when the value field of env from any executor changes
   * @param executor The specific executor in the taskExecutors that is being changed
   * @param index The index of the env being changes if considered as an array
   */
  handleEnvValueChange = (
    event: Event,
    executor: ExecutorData,
    index: number
  ) => {
    const newEnvValue = (event.target as HTMLInputElement).value;
    const entries = Object.entries(executor.env);
    entries[index][1] = newEnvValue;
    executor.env = Object.fromEntries(entries);
  };

  /**
   * This function handles input changes of stderr, stdout, stdin, workdir, image
   * @param event The event triggered when the value field changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsDataChange = (event: Event, executor: ExecutorData) => {
    const key: string = (event.target as HTMLInputElement).name;
    const data: any = (event.target as HTMLInputElement).value;
    executor[key as keyof ExecutorData] = data;
  };

  /**
   * Populate more executor fields
   */
  addExecutor = () => {
    this.taskExecutors.push({ ...executorTemplate });
    this.taskExecutorsLength += 1;
  };

  // Custom comparison function for executors
  areExecutorsEqual = (executor1: ExecutorData, executor2: ExecutorData) => {
    // Define the criteria for equality based on specific properties
    const check =
      executor1.image === executor2.image &&
      executor1.stderr === executor2.stderr &&
      executor1.stdin === executor2.stdin &&
      executor1.stdout === executor2.stdout &&
      executor1.workdir === executor2.workdir &&
      JSON.stringify(executor1.command) === JSON.stringify(executor2.command);

    const keys1 = Object.keys(executor1.env);
    const keys2 = Object.keys(executor2.env);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check if each key-value pair in executor1 exists in executor2
    for (const key of keys1) {
      if (executor1.env[key] !== executor2.env[key]) {
        return false;
      }
    }

    return check;
  };

  addEnv = (executor: ExecutorData) => {
    const updatedExecutors = this.taskExecutors.map((ex) => {
      if (this.areExecutorsEqual(ex, executor)) {
        // Create a new object with the updated env field
        const updatedEnv = { ...ex.env, '': '' };

        // Return a new executor object with the updated env field
        return { ...ex, env: updatedEnv };
      }
      // Return the original executor object if it doesn't match the provided executor
      return ex;
    });
    this.taskExecutors = updatedExecutors;
  };

  deleteEnv = (executor: ExecutorData) => {
    const updatedExecutors = this.taskExecutors.map((ex) => {
      if (this.areExecutorsEqual(ex, executor)) {
        // Create a new object with the updated env field
        const entries = Object.entries(ex.env);
        entries.pop();
        const updatedEnv = Object.fromEntries(entries);

        // Return a new executor object with the updated env field
        return { ...ex, env: updatedEnv };
      }
      return ex; // Return the original executor object if it doesn't match the provided executor
    });
    this.taskExecutors = updatedExecutors;
  };

  /**
   * Remove one executors field
   */
  deleteExecutor = () => {
    // only remove if more than one present
    if (this.taskExecutors.length > 1) {
      this.taskExecutors.pop();
      this.taskExecutorsLength -= 1;
    }
  };

  /**
   * Popuate more Input fields
   */
  addInput = () => {
    this.taskInput.push({ ...inputTemplate });
    this.taskInputLength += 1;
  };

  /**
   * Handles the path input for the Input fields
   * @param event The event triggered when the path field of the Input section changes
   * @param input The specific input of the taskInput that is being changed
   */
  handleInputPathChange = (event: Event, input: InputData) => {
    const inputPathInput = (event.target as HTMLInputElement).value;
    input.path = inputPathInput;
  };

  /**
   * Handles the url input for the Input fields
   * @param event The event triggered when the url field of the Input section changes
   * @param input The specific input of the taskInput that is being changed
   */
  handleInputUrlChange = (event: Event, input: InputData) => {
    const inputUrlInput = (event.target as HTMLInputElement).value;
    input.url = inputUrlInput;
  };

  /**
   * Remove one input field
   */
  deleteInput = () => {
    // Only if more than one exist
    if (this.taskInput.length > 1) {
      this.taskInput.pop();
      this.taskInputLength -= 1;
    }
  };

  /**
   * Populate more Output fields
   */
  addOutput = () => {
    this.taskOutput.push({ ...outputTemplate });
    this.taskOutputLength += 1;
  };

  /**
   * Handles the path input for the Output fields
   * @param event The event triggered when the path field of the output section changes
   * @param output The specific output of the taskInput that is being changed
   */
  handleOutputPathChange = (event: Event, output: OutputData) => {
    const outputPathInput = (event.target as HTMLInputElement).value;
    output.path = outputPathInput;
  };

  /**
   * Handles the url input for the Output fields
   * @param event The event triggered when the url field of the output section changes
   * @param output The specific output of the taskInput that is being changed
   */
  handleOutputUrlChange = (event: Event, output: OutputData) => {
    const outputUrlInput = (event.target as HTMLInputElement).value;
    output.url = outputUrlInput;
  };

  /**
   * Handles the type input for the Output fields
   * @param event The event triggered when the type field of the output section changes
   * @param output The specific output of the taskInput that is being changed
   */
  handleOutputTypeChange = (event: Event, output: OutputData) => {
    const outputTypeInput = (event.target as HTMLInputElement).value;
    output.type = outputTypeInput;
  };

  /**
   * Remove one output field
   */
  deleteOutput = () => {
    // Only if more than one exist
    if (this.taskOutput.length > 1) {
      this.taskOutput.pop();
      this.taskOutputLength -= 1;
    }
  };
}
