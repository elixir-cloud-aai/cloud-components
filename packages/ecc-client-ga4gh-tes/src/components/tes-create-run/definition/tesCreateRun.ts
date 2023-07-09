import {
  FASTElement,
  attr,
  observable,
  customElement,
} from '@microsoft/fast-element';
import template from './tesCreateRun.template.js';
import styles from './tesCreateRun.styles.js';
import CreateTaskData, {
  Executor,
  ExecutorData,
  Input,
  InputData,
  Output,
  OutputData,
} from './createTask.js';
import { postTask } from '../../../data/Task/tesGet.js';

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

  @attr name = 'myTask';

  @attr state = 'UNKNOWN';

  @attr description = 'myTask';

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

  @attr cpu_cores = '4';

  @attr disk_gb = '40';

  @attr preemptible = false;

  @attr ram_gb = '8';

  @attr zones: string[] = ['us-west-1'];

  @attr WORKFLOW_ID = 'cwl-01234';

  @attr PROJECT_GROUP = 'alice-lab';

  @attr volumes: string[] = ['/vol/A/'];

  @observable testData: CreateTaskData = {
    description: 'string',
    executors: [
      {
        command: ['/bin/md5', '/data/file1'],
        env: {
          BLASTDB: '/data/GRC38',
          HMMERDB: '/data/hmmer',
        },
        image: 'ubuntu:20.04',
        stderr: '/tmp/stderr.log',
        stdin: '/data/file1',
        stdout: '/tmp/stdout.log',
        workdir: '/data/',
      },
    ],
    inputs: [
      {
        url: 's3://my-object-store/file1',
        path: '/data/file1',
      },
    ],
    name: 'string',
    outputs: [
      {
        path: '/data/outfile',
        url: 's3://my-object-store/outfile-1',
        type: 'FILE',
      },
    ],
    resources: {
      cpu_cores: 4,
      disk_gb: 40,
      preemptible: false,
      ram_gb: 8,
      zones: ['us-west-1'],
    },
    state: 'UNKNOWN',
    tags: {
      WORKFLOW_ID: 'cwl-01234',
      PROJECT_GROUP: 'alice-lab',
    },
    volumes: ['/vol/A/'],
  };

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
    for (const exec of this.executors) {
      this.taskExecutors.push(exec.data);
    }
    this.taskData.executors = this.taskExecutors;
    for (const inp of this.input) {
      this.taskInput.push(inp.data);
    }
    this.taskData.inputs = this.taskInput;
    for (const out of this.output) {
      this.taskOutput.push(out.data);
    }
    this.taskData.outputs = this.taskOutput;
    this.taskData.resources.cpu_cores = parseInt(this.cpu_cores, 10);
    this.taskData.resources.disk_gb = parseInt(this.disk_gb, 10);
    this.taskData.resources.preemptible = this.preemptible;
    this.taskData.resources.ram_gb = parseInt(this.ram_gb, 10);
    this.taskData.resources.zones = this.zones;
    this.taskData.tags.WORKFLOW_ID = this.WORKFLOW_ID;
    this.taskData.tags.PROJECT_GROUP = this.PROJECT_GROUP;
    this.taskData.volumes = this.volumes;
    // Call API to create task
    const createTask = await postTask(this.baseURL, this.taskData);
    console.log(createTask);
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
    if (label === 'command') {
      this.executors[index].data.command = value.split(',');
    } else if (label === 'hmmerdb' || label === 'blastdb') {
      this.executors[index].data.env[label] = value;
    } else {
      // @ts-expect-error: should not be using type string to index data
      this.executors[index].data[label] = value;
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
