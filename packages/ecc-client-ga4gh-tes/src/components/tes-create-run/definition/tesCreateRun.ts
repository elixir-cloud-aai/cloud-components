import {
  FASTElement,
  attr,
  observable,
  customElement,
} from '@microsoft/fast-element';
import template, { executorFields } from './tesCreateRun.template.js';
import styles from './tesCreateRun.styles.js';
import CreateTaskData, {
  Executor,
  ExecutorData,
  Input,
  InputData,
  Output,
  OutputData,
} from './createTask.js';

const executorTemplate: Executor = {
  data: {
    command: [],
    env: {},
    image: '',
    stderr: '',
    stdin: '',
    stdout: '',
    workdir: '',
  },
  index: 0,
};

const inputTemplate: Input = {
  data: {
    path: '',
    url: '',
  },
  index: 0,
};

const outputTemplate: Output = {
  data: {
    path: '',
    url: '',
    type: '',
  },
  index: 0,
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

  @observable executors: Executor[] = [
    JSON.parse(JSON.stringify(executorTemplate)),
  ];

  @attr taskExecutors: ExecutorData[] = [];

  @observable executorsLength = 1;

  @observable input: Input[] = [JSON.parse(JSON.stringify(inputTemplate))];

  @attr taskInput: InputData[] = [];

  @observable inputLength = 1;

  @observable output: Output[] = [JSON.parse(JSON.stringify(outputTemplate))];

  @attr taskOutput: OutputData[] = [];

  @observable outputLength = 1;

  @attr cpu_cores = '0';

  @attr disk_gb = '0';

  @attr preemptible = false;

  @attr ram_gb = '0';

  @attr zones: string[] = [];

  @attr WORKFLOW_ID = '';

  @attr PROJECT_GROUP = '';

  @attr volumes: string[] = [];

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

  handleClick = async () => {
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
    // Call API here to create task
  };

  handleNameInput = (event: Event) => {
    this.name = (event.target! as HTMLInputElement).value;
  };

  handleStateInput = (event: Event) => {
    this.state = (event.target! as HTMLInputElement).value;
  };

  handleDiscriptionInput = (event: Event) => {
    this.description = (event.target! as HTMLInputElement).value;
  };

  handleCPUCoresInput = (event: Event) => {
    this.cpu_cores = (event.target! as HTMLInputElement).value;
  };

  handleDiskGBInput = (event: Event) => {
    this.disk_gb = (event.target! as HTMLInputElement).value;
  };

  handleRAMGBInput = (event: Event) => {
    this.ram_gb = (event.target! as HTMLInputElement).value;
  };

  handleZonesInput = (event: Event) => {
    this.zones = (event.target! as HTMLInputElement).value.split(',');
  };

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

  handleWorkflowIDInput = (event: Event) => {
    this.WORKFLOW_ID = (event.target! as HTMLInputElement).value;
  };

  handleProjectGroupInput = (event: Event) => {
    this.PROJECT_GROUP = (event.target! as HTMLInputElement).value;
  };

  handleVolumesInput = (event: Event) => {
    this.volumes = (event.target! as HTMLInputElement).value.split(',');
  };

  handleExecutorChange = (value: string, index: number, label: string) => {
    switch (label) {
      case executorFields[0].label:
        // handle command situation
        break;

      case executorFields[1].label:
      case executorFields[2].label:
        this.executors[index].data.env[label] = value;
        break;

      default:
        // @ts-expect-error: should not be using type string to index data
        this.executors[index].data[label] = value;
        break;
    }
  };

  handleInputChange = (value: string, index: number, label: string) => {
    // @ts-expect-error: should not be using type string to index data
    this.input[index].data[label] = value;
  };

  handleOutputChange = (value: string, index: number, label: string) => {
    // @ts-expect-error: should not be using type string to index data
    this.output[index].data[label] = value;
  };

  addExecutor = () => {
    const newTemplate: Executor = {
      ...JSON.parse(JSON.stringify(executorTemplate)),
      index: this.executorsLength,
    };

    this.executorsLength += 1;
    this.executors.push(newTemplate);
  };

  deleteExecutor = () => {
    if (this.executors.length > 1) this.executors.pop();
    this.executorsLength -= 1;
  };

  addInput = () => {
    const newTemplate: Input = {
      ...JSON.parse(JSON.stringify(inputTemplate)),
      index: this.inputLength,
    };

    this.inputLength += 1;
    this.input.push(newTemplate);
  };

  deleteInput = () => {
    if (this.input.length > 1) this.input.pop();
    this.inputLength -= 1;
  };

  addOutput = () => {
    const newTemplate: Output = {
      ...JSON.parse(JSON.stringify(outputTemplate)),
      index: this.outputLength,
    };

    this.outputLength += 1;
    this.output.push(newTemplate);
  };

  deleteOutput = () => {
    if (this.output.length > 1) this.output.pop();
    this.outputLength -= 1;
  };
}
