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

interface Executor {
  command: string[];
  env: { [key: string]: string };
  image: string;
  stderr: string;
  stdin: string;
  stdout: string;
  workdir: string;
}

export interface Input {
  url: string;
  path: string;
}

export interface Output {
  path: string;
  url: string;
  type: string;
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
