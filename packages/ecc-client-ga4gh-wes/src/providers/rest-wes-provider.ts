import {
  WesProvider,
  ServiceInfo,
  RunListResponse,
  RunRequest,
  RunId,
  RunLog,
  RunStatus,
  ErrorResponse,
} from "./wes-provider.js";
import { fetcher } from "@elixir-cloud/design";

/**
 * REST API implementation of WesProvider
 * Handles HTTP requests to GA4GH WES v1.0.0 compliant endpoints
 */
export class RestWesProvider implements WesProvider {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorBody: ErrorResponse = await response.json();
        if (errorBody.msg) {
          errorMessage = errorBody.msg;
        }
      } catch {
        // If we can't parse the error body, use the default message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getServiceInfo(): Promise<ServiceInfo> {
    const response = await fetcher(`${this.baseUrl}/service-info`, undefined, "ga4gh-wes/service-info");
    return RestWesProvider.handleResponse<ServiceInfo>(response);
  }

  async listRuns(
    pageSize?: number,
    pageToken?: string
  ): Promise<RunListResponse> {
    const params = new URLSearchParams();

    if (pageSize !== undefined) {
      params.append("page_size", pageSize.toString());
    }

    if (pageToken) {
      params.append("page_token", pageToken);
    }

    const url = `${this.baseUrl}/runs${params.toString() ? `?${params.toString()}` : ""
      }`;
    const response = await fetcher(url, undefined, "ga4gh-wes/runs/get");
    return RestWesProvider.handleResponse<RunListResponse>(response);
  }

  async runWorkflow(request: RunRequest): Promise<RunId> {
    const formData = new FormData();

    // Add required fields
    formData.append("workflow_params", JSON.stringify(request.workflow_params));
    formData.append("workflow_type", request.workflow_type);
    formData.append("workflow_type_version", request.workflow_type_version);
    formData.append("workflow_url", request.workflow_url);

    // Add optional fields
    if (request.tags) {
      formData.append("tags", JSON.stringify(request.tags));
    }

    if (request.workflow_engine_parameters) {
      formData.append(
        "workflow_engine_parameters",
        JSON.stringify(request.workflow_engine_parameters)
      );
    }

    // Add file attachments
    if (request.workflow_attachment) {
      request.workflow_attachment.forEach((file) => {
        formData.append("workflow_attachment", file);
      });
    }

    const response = await fetcher(`${this.baseUrl}/runs`, {
      method: "POST",
      body: formData,
    }, "ga4gh-wes/runs/post");

    return RestWesProvider.handleResponse<RunId>(response);
  }

  async getRunLog(runId: string): Promise<RunLog> {
    const response = await fetcher(
      `${this.baseUrl}/runs/${encodeURIComponent(runId)}`,
      undefined,
      "ga4gh-wes/runs/id"
    );
    return RestWesProvider.handleResponse<RunLog>(response);
  }

  async getRunStatus(runId: string): Promise<RunStatus> {
    const response = await fetcher(
      `${this.baseUrl}/runs/${encodeURIComponent(runId)}/status`,
      undefined,
      "ga4gh-wes/runs/status"
    );
    return RestWesProvider.handleResponse<RunStatus>(response);
  }

  async cancelRun(runId: string): Promise<RunId> {
    const response = await fetcher(
      `${this.baseUrl}/runs/${encodeURIComponent(runId)}/cancel`,
      {
        method: "POST",
      },
      "ga4gh-wes/runs/cancel"
    );
    return RestWesProvider.handleResponse<RunId>(response);
  }
}
