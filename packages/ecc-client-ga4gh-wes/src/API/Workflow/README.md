# Description

See the human-readable [Reference Documentation](https://ga4gh.github.io/workflow-execution-service-schemas/docs/) 
and the [OpenAPI YAML description](openapi/workflow_execution_service.swagger.yaml). You can also explore the specification in the [Swagger Editor](https://editor.swagger.io/?url=https://ga4gh.github.io/workflow-execution-service-schemas/openapi.yaml).

## fetchWorkflows

Fetches workflows based on the specified parameters.

**API Request Body**

| Parameter        | Type     | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| `baseURL`        | string   | The base URL for fetching workflows               |
| `pageSize`       | number   | **OPTIONAL**. The preferred number of workflow runs to return in a page. |
|                  |          | Defaults to 5.                                     |
| `nextPageToken`  | string   | **OPTIONAL**. Token to use to indicate where to start getting results. |

## fetchWorkflow

Fetches the full view of a workflow with the specified ID.

**API Request Body**

| Parameter        | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| `baseURL`        | string   | Base URL for fetching workflows         |
| `id`             | string   | ID of the specific workflow             |

## cancelWorkflow

Cancels a specific workflow.

**API Request Body**

| Parameter        | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| `baseURL`        | string   | Base URL for canceling workflow         |
| `id`             | string   | ID of the workflow to be canceled       |

## postWorkflow

Create a new workflow run.

**API Request Body**

| Parameter        | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| `baseURL`        | string   | Base URL for fetching workflows         |
| `data`           | object   | The data of the run to be posted.       |
|                  |          | This should be an object containing the necessary fields for the run. |


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)
