// export interface Request {
//   tags?: Record<string, string>;
//   workflow_engine_parameters?: Record<string, string>;
//   workflow_params?: Record<string, string>;
//   workflow_type?: string;
//   workflow_type_version?: string;
//   workflow_url?: string;
// }

// export interface RunLog {
//   cmd?: string[];
//   end_time?: string;
//   exit_code?: number;
//   name?: string;
//   start_time?: string;
//   stderr?: string;
//   stdout?: string;
// }

// export interface TaskLog {
//   cmd?: string[];
//   end_time?: string;
//   exit_code?: number;
//   name?: string;
//   start_time?: string;
//   stderr?: string;
//   stdout?: string;
// }

// export default interface Workflow {
//   outputs?: Record<string, unknown>;
//   request: Request;
//   run_id: string;
//   run_log?: RunLog;
//   state: string;
//   task_logs?: TaskLog[];
// }
