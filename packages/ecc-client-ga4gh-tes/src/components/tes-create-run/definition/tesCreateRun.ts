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
    this.data[index] = (event.target! as HTMLInputElement).value;
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

  @attr taskExecutors: ExecutorData[] = [executorTemplate];

  @observable taskExecutorsLength = this.taskExecutors.length;

  @attr taskInput: InputData[] = [inputTemplate];

  @observable taskInputLength = this.taskInput.length;

  @observable taskOutput: OutputData[] = [outputTemplate];

  @observable taskOutputLength = 1;

  @attr cpu_cores = '4';

  @attr disk_gb = '40';

  @attr preemptible = false;

  @attr ram_gb = '8';

  @observable zones: string[] = [];

  @attr WORKFLOW_ID = '';

  @attr PROJECT_GROUP = '';

  @observable volumes: string[] = [];

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

  /**
   * Handles submit button click
   */
  handleSubmit = async () => {
    // Compute all the task information and create the task schema
    // <----------------------------------------------------------------->

    // All the fields input by user are compiled according to task schema
    // <----------------------------------------------------------------->

    // Call API to create task
    const createTask = await postTask(this.baseURL, this.taskData);

    // Handle with response
    console.log(createTask);
  };

  /**
   * Handles the name input for the task
   * - name - The user given identifier of the task
   * @param event - The input event triggered when the name input changes
   */
  handleNameInput = (event: Event) => {
    this.name = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the state input for the task
   * - state - State of the task, Allowed states according to TES schema are :
   * UNKNOWN, QUEUED, INITIALIZING, RUNNING, PAUSED, COMPLETE, EXECUTOR_ERROR,
   * SYSTEM_ERROR, CANCELED
   * @param event - The input event triggered when the state input changes
   */
  handleStateInput = (event: Event) => {
    this.state = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the description input for the task
   * - description - The user given information about the task
   * @param event The input event triggered when the description input change
   */
  handleDescriptionInput = (event: Event) => {
    this.description = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the cpu_cores input for the task
   * - cpu_cores - Requested number of CPUs
   * @param event The input event triggered when the cpu-core input changes
   */
  handleCPUCoresInput = (event: Event) => {
    this.cpu_cores = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the disk_gb input for the task
   * - disk_gb - Requested disk size in gigabytes (GB)
   * @param event The input event triggered when the disk-gb input changes
   */
  handleDiskGBInput = (event: Event) => {
    this.disk_gb = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the ram_gb input for the task
   * - ram_gb - Requested RAM required in gigabytes (GB)
   * @param event The input event triggered when the ram-gb input changes
   */
  handleRAMGBInput = (event: Event) => {
    this.ram_gb = (event.target! as HTMLInputElement).value;
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
    this.WORKFLOW_ID = (event.target! as HTMLInputElement).value;
  };

  /**
   * Handles the PROJECT_GROUP input for the task
   * - PROJECT_GROUP - Used to store meta-data and annotations about a task
   * @param event The input event triggered when the project-group input changes
   */
  handleProjectGroupInput = (event: Event) => {
    this.PROJECT_GROUP = (event.target! as HTMLInputElement).value;
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

  handleExecutorsCommandChange = (event: Event, executor: ExecutorData) => {
    const newCommands = (event.target as HTMLInputElement).value;
    // this.taskExecutors[index].command = newCommands.split(",");
    executor.command = newCommands.split(',');
    console.log(this.taskExecutors);
  };

  handleExecutorsImageChange = (event: Event, executor: ExecutorData) => {
    const newImage = (event.target as HTMLInputElement).value;
    executor.image = newImage;
  };

  handleEnvNameChange = (
    event: Event,
    executor: ExecutorData,
    index: number
  ) => {
    const newEnvName = (event.target as HTMLInputElement).value;
    const entries = Object.entries(executor.env);
    entries[index][0] = newEnvName;
    executor.env = Object.fromEntries(entries);
    console.log(this.taskExecutors);
  };

  handleEnvValueChange = (
    event: Event,
    executor: ExecutorData,
    index: number
  ) => {
    const newEnvValue = (event.target as HTMLInputElement).value;
    const entries = Object.entries(executor.env);
    entries[index][1] = newEnvValue;
    executor.env = Object.fromEntries(entries);
    console.log(this.taskExecutors);
  };

  handleExecutorsStderrChange = (event: Event, executor: ExecutorData) => {
    const stderrInput = (event.target as HTMLInputElement).value;
    executor.stderr = stderrInput;
  };

  handleExecutorsStdoutChange = (event: Event, executor: ExecutorData) => {
    const stdoutInput = (event.target as HTMLInputElement).value;
    executor.stdout = stdoutInput;
  };

  handleExecutorsStdinChange = (event: Event, executor: ExecutorData) => {
    const stdinInput = (event.target as HTMLInputElement).value;
    executor.stdin = stdinInput;
  };

  handleExecutorsWorkdirChange = (event: Event, executor: ExecutorData) => {
    const workdirInput = (event.target as HTMLInputElement).value;
    executor.workdir = workdirInput;
  };

  /**
   * Handles change in value of all the input input values and creates input array
   * This array is further transformed into appropriate data type (`InputData[]`) to
   * further create `taskData` to send request to the API
   * @param value Value of the input field being changed
   * @param index index of the input in the input array, Since there can be
   *  multiple inputs, this stores which input's value is being changed
   * @param label The label of the input being changed
   */
  handleInputChange = (value: string, index: number, label: string) => {
    // @ts-expect-error: should not be using type string to index data
    this.input[index].data[label] = value;
  };

  /**
   * Handles change in value of all the output values and creates outpu array
   * This array is further transformed into appropriate data type (`OutputData[]`) to
   * further create `taskData` to send request to the API
   * @param value Value of the input field being changed
   * @param index index of the input in the input array, Since there can be
   *  multiple inputs, this stores which input's value is being changed
   * @param label The label of the input being changed
   */
  handleOutputChange = (value: string, index: number, label: string) => {
    // @ts-expect-error: should not be using type string to index data
    this.output[index].data[label] = value;
  };

  /**
   * Populate more executors field
   */
  addExecutor = () => {
    this.taskExecutors.push(executorTemplate);
    this.taskExecutorsLength += 1;
  };

  addEnv = (executor: ExecutorData) => {
    const updatedExecutors = this.taskExecutors.map((ex) => {
      if (ex === executor) {
        const updatedEnv = { ...ex.env, '': '' }; // Create a new object with the updated env field
        this.taskExecutorsLength += 1;
        return { ...ex, env: updatedEnv }; // Return a new executor object with the updated env field
      }
      return ex; // Return the original executor object if it doesn't match the provided executor
    });
    this.taskExecutors = updatedExecutors;
  };

  deleteEnv = (executor: ExecutorData) => {
    const updatedExecutors = this.taskExecutors.map((ex) => {
      if (ex === executor) {
        const entries = Object.entries(ex.env);
        entries.pop();
        const updatedEnv = Object.fromEntries(entries);
        return { ...ex, env: updatedEnv }; // Return a new executor object with the updated env field
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
    this.taskInput.push(inputTemplate);
    this.taskInputLength += 1;
  };

  handleInputPathChange = (event: Event, input: InputData) => {
    const inputPathInput = (event.target as HTMLInputElement).value;
    input.path = inputPathInput;
  };

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
    this.taskOutput.push(outputTemplate);
    this.taskOutputLength += 1;
  };

  handleOutputPathChange = (event: Event, output: OutputData) => {
    const outputPathInput = (event.target as HTMLInputElement).value;
    output.path = outputPathInput;
  };

  handleOutputUrlChange = (event: Event, output: OutputData) => {
    const outputUrlInput = (event.target as HTMLInputElement).value;
    output.url = outputUrlInput;
  };

  handleOutputTypeChange = (event: Event, output: OutputData) => {
    const outputTypeInput = (event.target as HTMLInputElement).value;
    output.path = outputTypeInput;
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
