# Description

See the human-readable [Reference Documentation](https://ga4gh.github.io/task-execution-schemas/docs/)
and the [OpenAPI YAML description](openapi/task_execution_service.openapi.yaml). You can also explore the specification in the [Swagger Editor](https://editor.swagger.io/?url=https://ga4gh.github.io/task-execution-schemas/openapi.yaml).

## fetchTasks

Fetches tasks based on the specified parameters.

**API Request Body**

| Parameter       | Type   | Description                                                                                                                                   |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseURL`       | string | The base URL for fetching tasks                                                                                                               |
| `pageSize`      | number | **OPTIONAL**. Number of tasks to return in one page.                                                                                          |
|                 |        | Must be less than 2048. Defaults to 256.                                                                                                      |
| `nextPageToken` | string | **OPTIONAL**. Page token used to retrieve the next page of results.                                                                           |
|                 |        | If unspecified, returns the first page of results.                                                                                            |
| `view`          | string | **OPTIONAL**. Affects the fields included in the returned Task messages.                                                                      |
|                 |        | - 'MINIMAL': Task message will include ONLY the fields: Task.Id, Task.State.                                                                  |
|                 |        | - 'BASIC': Task message will include all fields EXCEPT: Task.ExecutorLog.stdout, Task.ExecutorLog.stderr, Input.content, TaskLog.system_logs. |
|                 |        | - 'FULL': Task message includes all fields.                                                                                                   |
| `namePrefix`    | string | **OPTIONAL**. Filter the list to include tasks where the name matches this prefix.                                                            |
|                 |        | If unspecified, no task name filtering is done.                                                                                               |

## fetchTask

Fetches the full view of a task with the specified ID.

**API Request Body**

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| `baseURL` | string | Base URL for fetching task |
| `id`      | string | ID of the specific task    |

## deleteTask

Deletes a specific task.

**API Request Body**

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `baseURL` | string | Base URL for deleting task   |
| `id`      | string | ID of the task to be deleted |

## postTask

Posts/Create a new task.

**API Request Body**

| Parameter  | Type   | Description                                                            |
| ---------- | ------ | ---------------------------------------------------------------------- |
| `baseURL`  | string | The base URL for posting the task.                                     |
| `taskData` | object | The data of the task to be posted.                                     |
|            |        | This should be an object containing the necessary fields for the task. |
|            |        | Modify the structure according to your task requirements.              |


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

