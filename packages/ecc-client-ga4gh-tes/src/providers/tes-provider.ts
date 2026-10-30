const StateEnum = {
  UNKNOWN: "UNKNOWN",
  QUEUED: "QUEUED",
  INITIALIZING: "INITIALIZING",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  COMPLETE: "COMPLETE",
  EXECUTOR_ERROR: "EXECUTOR_ERROR",
  SYSTEM_ERROR: "SYSTEM_ERROR",
  CANCELED: "CANCELED",
  PREEMPTED: "PREEMPTED",
  CANCELING: "CANCELING",
} as const;

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const STATE_INFO: Record<
  State,
  { variant: BadgeVariant; label: string }
> = {
  [StateEnum.UNKNOWN]: { variant: "outline", label: "Unknown" },
  [StateEnum.QUEUED]: { variant: "secondary", label: "Queued" },
  [StateEnum.INITIALIZING]: { variant: "secondary", label: "Initializing" },
  [StateEnum.RUNNING]: { variant: "default", label: "Running" },
  [StateEnum.PAUSED]: { variant: "outline", label: "Paused" },
  [StateEnum.COMPLETE]: { variant: "default", label: "Complete" },
  [StateEnum.EXECUTOR_ERROR]: {
    variant: "destructive",
    label: "Executor Error",
  },
  [StateEnum.SYSTEM_ERROR]: { variant: "destructive", label: "System Error" },
  [StateEnum.CANCELED]: { variant: "outline", label: "Canceled" },
  [StateEnum.PREEMPTED]: { variant: "destructive", label: "Preempted" },
  [StateEnum.CANCELING]: { variant: "outline", label: "Canceling" },
};

export const CANCELLABLE_STATES: State[] = [
  StateEnum.QUEUED,
  StateEnum.INITIALIZING,
  StateEnum.RUNNING,
  StateEnum.PAUSED,
];

/**
 * Types for the GA4GH TES API based on OpenAPI specification v1.1.0
 */

export type State = (typeof StateEnum)[keyof typeof StateEnum];

// MINIMAL: id and state only. BASIC: everything except large log/content fields.
export type TaskView = "MINIMAL" | "BASIC" | "FULL";

export type FileType = "FILE" | "DIRECTORY";

export interface Executor {
  image: string;
  command: string[];
  workdir?: string;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  env?: Record<string, string>;
  ignore_error?: boolean;
}

// Spec: `url` is required unless `content` is set.
export interface Input {
  name?: string;
  description?: string;
  url?: string;
  path: string;
  type?: FileType;
  content?: string;
  streamable?: boolean;
}

export interface Output {
  name?: string;
  description?: string;
  url: string;
  path: string;
  // Required by the server when `path` contains wildcards.
  path_prefix?: string;
  type?: FileType;
}

export interface Resources {
  cpu_cores?: number;
  preemptible?: boolean;
  ram_gb?: number;
  disk_gb?: number;
  zones?: string[];
  backend_parameters?: Record<string, string>;
  backend_parameters_strict?: boolean;
}

export interface ExecutorLog {
  start_time?: string;
  end_time?: string;
  stdout?: string;
  stderr?: string;
  exit_code: number;
}

export interface OutputFileLog {
  url: string;
  path: string;
  size_bytes: string;
}

export interface TaskLog {
  logs: ExecutorLog[];
  metadata?: Record<string, string>;
  start_time?: string;
  end_time?: string;
  outputs: OutputFileLog[];
  system_logs?: string[];
}

export interface TaskRequest {
  name?: string;
  description?: string;
  inputs?: Input[];
  outputs?: Output[];
  resources?: Resources;
  executors: Executor[];
  volumes?: string[];
  tags?: Record<string, string>;
}

export interface Task extends Partial<TaskRequest> {
  id: string;
  state: State;
  logs?: TaskLog[];
  creation_time?: string;
}

export interface TaskId {
  id: string;
}

export interface TaskListResponse {
  tasks: Task[];
  next_page_token?: string;
}

export interface ListTasksParams {
  pageSize?: number;
  pageToken?: string;
  view?: TaskView;
  namePrefix?: string;
  state?: State;
  tags?: Record<string, string>;
}

// GA4GH service-info plus the TES extensions.
export interface ServiceInfo {
  id: string;
  name: string;
  type: { group: string; artifact: "tes" | string; version: string };
  description?: string;
  organization: { name: string; url: string };
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
  version: string;
  storage?: string[];
  tesResources_backend_parameters?: string[];
}

export interface ErrorResponse {
  message?: string;
  msg?: string;
  status_code?: number;
}

/**
 * Operations required for TES data providers.
 * Implementations may use REST, GraphQL or any other data source.
 */
export interface TesProvider {
  getServiceInfo(): Promise<ServiceInfo>;
  listTasks(params?: ListTasksParams): Promise<TaskListResponse>;
  getTask(taskId: string, view?: TaskView): Promise<Task>;
  createTask(request: TaskRequest): Promise<TaskId>;
  cancelTask(taskId: string): Promise<void>;
}
