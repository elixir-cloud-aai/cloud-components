/* eslint camelcase: "off" */

interface Executor {
  command: string[];
  env?: Record<string, string>;
  image: string;
  stderr?: string;
  stdin?: string;
  stdout?: string;
  workdir: string;
}

interface Input {
  path: string;
  url: string;
}

interface Output {
  path: string;
  type: string;
  url: string;
}

interface Resources {
  cpu_cores?: number;
  disk_gb?: number;
  preemptible?: boolean;
  ram_gb?: number;
  zones?: string;
}

interface Tags {
  [key: string]: string;
}

interface postData {
  name?: string;
  description?: string;
  executors: Executor[];
  inputs?: Input[];
  outputs?: Output[];
  resources?: Resources;
  tags?: Tags;
  volumes?: string[];
}

export default postData;
