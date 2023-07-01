import {
  FASTElement,
  attr,
  // attr,
  customElement,
  // observable,
} from '@microsoft/fast-element';
import template from './tesCreateRun.template.js';
import styles from './tesCreateRun.styles.js';
import CreateTaskData, {
  Executor,
  Input,
  Output,
} from './createTask.js';
import { postTask } from '../../../data/Task/tesGet.js';

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

  @attr executors: Executor[] = [];

  @attr input: Input[] = [];

  @attr output: Output[] = [];

  @attr cpu_cores = 0;

  @attr disk_gb = 0;

  @attr preemptible = false;

  @attr ram_gb = 0;

  @attr zones: string[] = [];

  @attr WORKFLOW_ID = '';

  @attr PROJECT_GROUP = '';

  @attr volumes: string[] = [];

  @attr testData: CreateTaskData = {
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

  handleClick = async () => {
    const resp = await postTask(this.baseURL, this.testData);
    console.log(resp);
  };
}
