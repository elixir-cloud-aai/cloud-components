export default interface CreateTaskData {
  description: string;
  executors: ExecutorData[];
  inputs: InputData[];
  name: string;
  outputs: OutputData[];
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

export interface InputData {
  url: string;
  path: string;
}

export interface OutputData {
  path: string;
  url: string;
  type: string;
}

interface Resources {
  cpu_cores: string;
  disk_gb: string;
  preemptible: boolean;
  ram_gb: string;
  zones: string[];
}

interface Tags {
  [key: string]: string;
}
