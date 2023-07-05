export default interface CreateTaskData {
  description: string;
  executors: Executor[];
  inputs: Input[];
  name: string;
  outputs: Output[];
  resources: Resources;
  state: string;
  tags: Tags;
  volumes: string[];
}

interface ExecutorData {
  command: string[];
  env: Record<string, string>;
  image: string;
  stderr: string;
  stdin: string;
  stdout: string;
  workdir: string;
}

interface Executor {
  data: ExecutorData;
  index: number;
}

export interface InputData {
  url: string;
  path: string;
}

interface Input {
  data: InputData;
  index: number;
}

export interface OutputData {
  path: string;
  url: string;
  type: string;
}

interface Output {
  data: OutputData;
  index: number;
}

interface Resources {
  cpu_cores: number;
  disk_gb: number;
  preemptible: boolean;
  ram_gb: number;
  zones: string[];
}

interface Tags {
  [key: string]: string;
}
