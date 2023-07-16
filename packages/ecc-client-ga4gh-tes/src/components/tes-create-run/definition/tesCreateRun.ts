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
import CreateTaskData, {
  ExecutorData,
  InputData,
  OutputData,
} from './createTask.js';
import { postTask } from '../../../data/Task/tesGet.js';

const executorTemplate: ExecutorData = {
  command: [],
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

  @attr state = 'UNKNOWN';

  @attr description = '';

  @attr taskExecutors: ExecutorData[] = [{ ...executorTemplate }];

  @observable taskExecutorsLength = this.taskExecutors.length;

  @attr taskInput: InputData[] = [{ ...inputTemplate }];

  @observable taskInputLength = this.taskInput.length;

  @attr taskOutput: OutputData[] = [{ ...outputTemplate }];

  @observable taskOutputLength = 1;

  @attr cpu_cores = '4';

  @attr disk_gb = '40';

  @attr preemptible = false;

  @attr ram_gb = '8';

  @attr zones: string[] = [];

  @attr WORKFLOW_ID = '';

  @attr PROJECT_GROUP = '';

  @attr volumes: string[] = [];

  @observable response = {};

  @observable taskData: CreateTaskData = {
    name: this.name,
    state: this.state,
    description: this.description,
    executors: this.taskExecutors,
    inputs: this.taskInput,
    outputs: this.taskOutput,
    resources: {
      cpu_cores: parseInt(this.cpu_cores, 10),
      disk_gb: parseInt(this.disk_gb, 10),
      preemptible: this.preemptible,
      ram_gb: parseInt(this.ram_gb, 10),
      zones: this.zones,
    },
    tags: {
      WORKFLOW_ID: this.WORKFLOW_ID,
      PROJECT_GROUP: this.PROJECT_GROUP,
    },
    volumes: this.volumes,
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.taskExecutorsLength = this.taskExecutors.length;
    this.taskInputLength = this.taskInput.length;
    this.taskOutputLength = this.taskOutput.length;
  }

  /**
   * Handles submit button click
   */
  handleSubmit = async () => {
    // Compute all the task information and create the task schema
    // <----------------------------------------------------------------->
    // All the fields input by user are compiled according to task schema

    // Check if all the fields are filled
    if (
      this.baseURL === undefined ||
      this.baseURL === '' ||
      this.name === undefined ||
      this.name === '' ||
      this.state === undefined ||
      this.state === '' ||
      this.description === undefined ||
      this.description === '' ||
      this.taskExecutors === undefined ||
      this.taskExecutors.length === 0 ||
      this.taskInput === undefined ||
      this.taskInput.length === 0 ||
      this.taskOutput === undefined ||
      this.taskOutput.length === 0 ||
      this.cpu_cores === undefined ||
      this.cpu_cores === '' ||
      this.disk_gb === undefined ||
      this.disk_gb === '' ||
      this.preemptible === undefined ||
      this.ram_gb === undefined ||
      this.ram_gb === '' ||
      this.zones === undefined ||
      this.WORKFLOW_ID === undefined ||
      this.WORKFLOW_ID === '' ||
      this.PROJECT_GROUP === undefined ||
      this.PROJECT_GROUP === '' ||
      this.volumes === undefined ||
      this.volumes.length === 0
    ) {
      this.response = { error: 'All the fields are not filled.' };
      return;
    }

    this.taskData.name = this.name;
    this.taskData.state = this.state;
    this.taskData.description = this.description;
    this.taskData.executors = this.taskExecutors;
    this.taskData.inputs = this.taskInput;
    this.taskData.outputs = this.taskOutput;
    this.taskData.resources.cpu_cores = parseInt(this.cpu_cores, 10);
    this.taskData.resources.disk_gb = parseInt(this.disk_gb, 10);
    this.taskData.resources.preemptible = this.preemptible;
    this.taskData.resources.ram_gb = parseInt(this.ram_gb, 10);
    this.taskData.resources.zones = this.zones;
    this.taskData.tags.WORKFLOW_ID = this.WORKFLOW_ID;
    this.taskData.tags.PROJECT_GROUP = this.PROJECT_GROUP;
    this.taskData.volumes = this.volumes;
    // <----------------------------------------------------------------->

    // Call API to create task
    this.response = await postTask(this.baseURL, this.taskData);

    // Handle with response
    console.log(this.response);
  };

  /**
   * Handles the name input for the task
   * - name - The user given identifier of the task
   * @param event - The input event triggered when the name input changes
   */
  handleNameInput = (event: Event) => {
    this.name = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the state input for the task
   * - state - State of the task, Allowed states according to TES schema are :
   * UNKNOWN, QUEUED, INITIALIZING, RUNNING, PAUSED, COMPLETE, EXECUTOR_ERROR,
   * SYSTEM_ERROR, CANCELED
   * @param event - The input event triggered when the state input changes
   */
  handleStateInput = (event: Event) => {
    this.state = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the description input for the task
   * - description - The user given information about the task
   * @param event The input event triggered when the description input change
   */
  handleDescriptionInput = (event: Event) => {
    this.description = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the cpu_cores input for the task
   * - cpu_cores - Requested number of CPUs
   * @param event The input event triggered when the cpu-core input changes
   */
  handleCPUCoresInput = (event: Event) => {
    this.cpu_cores = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the disk_gb input for the task
   * - disk_gb - Requested disk size in gigabytes (GB)
   * @param event The input event triggered when the disk-gb input changes
   */
  handleDiskGBInput = (event: Event) => {
    this.disk_gb = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the ram_gb input for the task
   * - ram_gb - Requested RAM required in gigabytes (GB)
   * @param event The input event triggered when the ram-gb input changes
   */
  handleRAMGBInput = (event: Event) => {
    this.ram_gb = (event.target as HTMLInputElement).value;
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
   * Handles the WORKFLOW_ID input for the task
   * - WORKFLOW_ID - Used to store meta-data and annotations about a task
   * @param event The input event triggered when the workflow-id input changes
   */
  handleWorkflowIDInput = (event: Event) => {
    this.WORKFLOW_ID = (event.target as HTMLInputElement).value;
  };

  /**
   * Handles the PROJECT_GROUP input for the task
   * - PROJECT_GROUP - Used to store meta-data and annotations about a task
   * @param event The input event triggered when the project-group input changes
   */
  handleProjectGroupInput = (event: Event) => {
    this.PROJECT_GROUP = (event.target as HTMLInputElement).value;
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
   * Handles the change of the image input of the executor fields
   * @param event The input event triggered when the image input changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsImageChange = (event: Event, executor: ExecutorData) => {
    const newImage = (event.target as HTMLInputElement).value;
    executor.image = newImage;
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
   * Handles the stderr input for the executor
   * @param event The event triggered when the stderr field of the executor field changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsStderrChange = (event: Event, executor: ExecutorData) => {
    const stderrInput = (event.target as HTMLInputElement).value;
    executor.stderr = stderrInput;
  };

  /**
   * Handles the stdout input for the executor
   * @param event The event triggered when the stdout field of the executor field changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsStdoutChange = (event: Event, executor: ExecutorData) => {
    const stdoutInput = (event.target as HTMLInputElement).value;
    executor.stdout = stdoutInput;
  };

  /**
   * Handles the stdin input for the executor
   * @param event The event triggered when the stdin field of the executor field changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsStdinChange = (event: Event, executor: ExecutorData) => {
    const stdinInput = (event.target as HTMLInputElement).value;
    executor.stdin = stdinInput;
  };

  /**
   * Handles the workdir input for the executor
   * @param event The event triggered when the workdir field of the executor field changes
   * @param executor The specific executor in the taskExecutors that is being changed
   */
  handleExecutorsWorkdirChange = (event: Event, executor: ExecutorData) => {
    const workdirInput = (event.target as HTMLInputElement).value;
    executor.workdir = workdirInput;
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
