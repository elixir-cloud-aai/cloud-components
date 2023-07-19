interface Tags {
  [key: string]: string;
}

interface WorkflowEngineParameters {
  [key: string]: string;
}

interface RunLog {
  name: string;
  cmd: string[];
  start_time: string;
  end_time: string;
  stdout: string;
  stderr: string;
  exit_code: number;
}

type TaskLog = RunLog;

export default interface WorkflowData {
  run_id: string;
  state: string;
  request: {
    workflow_params: object;
    workflow_type: string;
    workflow_type_version: string;
    tags: Tags;
    workflow_engine_parameters: WorkflowEngineParameters;
    workflow_url: string;
  };
  run_log: RunLog;
  task_logs: TaskLog[];
  outputs: object;
}
