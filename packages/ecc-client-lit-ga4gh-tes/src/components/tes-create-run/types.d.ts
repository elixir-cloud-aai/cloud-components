/* eslint-disable camelcase */

export interface Executor {
  command: string[];
  env?: Record<string, string>;
  image: string;
  stderr?: string;
  stdin?: string;
  stdout?: string;
  workdir?: string;
}

export interface Input {
  path?: string;
  url?: string;
}

export interface Output {
  path?: string;
  type?: string;
  url?: string;
}

export interface Resources {
  cpu_cores?: number;
  disk_gb?: number;
  preemptible?: boolean;
  ram_gb?: number;
  zones?: string;
}

export interface Tags {
  [key: string]: string;
}

export default interface postTask {
  name?: string;
  description?: string;
  executors: Executor[];
  inputs?: Input[];
  outputs?: Output[];
  resources?: Resources;
  tags?: Tags;
  volumes?: string[];
}
