export default interface TaskData {
  id: string;
  state: string;
  name: string;
  description: string;
  executors: Executor[];
  logs: Log[];
  creation_time: string;
}

interface Executor {
  image: string;
  command: string[];
}

interface Log {
  logs: LogEntry[];
  metadata: {
    USER_ID: string;
  };
  start_time: string;
  end_time: string;
}

interface LogEntry {
  start_time: string;
  end_time: string;
  stdout: string;
  exit_code: number;
}
