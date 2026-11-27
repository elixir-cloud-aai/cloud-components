import {
  fetchWithTimeout,
  resolveRequestTimeout,
} from "@elixir-cloud/design/utils";
import type { RestProviderOptions } from "@elixir-cloud/design/utils";
import {
  TesProvider,
  ServiceInfo,
  ListTasksParams,
  Task,
  TaskId,
  TaskListResponse,
  TaskRequest,
  TaskView,
  ErrorResponse,
} from "./tes-provider.js";

/**
 * REST API implementation of TesProvider
 * Handles HTTP requests to GA4GH TES v1.1.0 compliant endpoints
 */
export class RestTesProvider implements TesProvider {
  private baseUrl: string;

  /** Deadline of each request in milliseconds, `0` for none. */
  public readonly timeout: number;

  /**
   * @param baseUrl Base URL of the TES API
   * @param options `timeout`: deadline of each request in milliseconds
   *   (default 30 s, `0` for none)
   */
  constructor(baseUrl: string, options: RestProviderOptions = {}) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.timeout = resolveRequestTimeout(options);
  }

  /**
   * Sends every request of this provider, with the provider's deadline.
   * Override it in a subclass to add headers (e.g. `Authorization`) or
   * otherwise change requests; call `super.fetch()` to keep the deadline.
   */
  protected fetch(input: RequestInfo | URL, init?: RequestInit) {
    return fetchWithTimeout(input, init, this.timeout);
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorBody: ErrorResponse = await response.json();
        errorMessage = errorBody.message || errorBody.msg || errorMessage;
      } catch {
        // If we can't parse the error body, use the default message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getServiceInfo(): Promise<ServiceInfo> {
    const response = await this.fetch(`${this.baseUrl}/service-info`);
    return RestTesProvider.handleResponse<ServiceInfo>(response);
  }

  async listTasks(params: ListTasksParams = {}): Promise<TaskListResponse> {
    const query = new URLSearchParams();

    if (params.pageSize !== undefined) {
      query.append("page_size", params.pageSize.toString());
    }
    if (params.pageToken) query.append("page_token", params.pageToken);
    if (params.view) query.append("view", params.view);
    if (params.namePrefix) query.append("name_prefix", params.namePrefix);
    if (params.state) query.append("state", params.state);
    Object.entries(params.tags ?? {}).forEach(([key, value]) => {
      query.append("tag_key", key);
      query.append("tag_value", value);
    });

    const qs = query.toString();
    const response = await this.fetch(
      `${this.baseUrl}/tasks${qs ? `?${qs}` : ""}`
    );
    const body = await RestTesProvider.handleResponse<TaskListResponse>(
      response
    );
    return { ...body, tasks: body.tasks ?? [] };
  }

  async getTask(taskId: string, view: TaskView = "FULL"): Promise<Task> {
    const response = await this.fetch(
      `${this.baseUrl}/tasks/${encodeURIComponent(taskId)}?view=${view}`
    );
    return RestTesProvider.handleResponse<Task>(response);
  }

  async createTask(request: TaskRequest): Promise<TaskId> {
    const response = await this.fetch(`${this.baseUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return RestTesProvider.handleResponse<TaskId>(response);
  }

  async cancelTask(taskId: string): Promise<void> {
    const response = await this.fetch(
      `${this.baseUrl}/tasks/${encodeURIComponent(taskId)}:cancel`,
      { method: "POST" }
    );
    await RestTesProvider.handleResponse<unknown>(response);
  }
}
