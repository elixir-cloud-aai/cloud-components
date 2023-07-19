
# ecc-client-ga4gh-tes-run

The `ecc-client-ga4gh-tes-run` component is an integral part of the `ecc-client-ga4gh-tes-runs` component, which is used for listing [TES](https://github.com/ga4gh/task-execution-schemas) tasks in a paginated manner. The `ecc-client-ga4gh-tes-run` component serves as an individual item within the task list, providing additional functionality for displaying and managing detailed information about a specific task.

When rendered within the `ecc-client-ga4gh-tes-runs` component, each instance of `ecc-client-ga4gh-tes-run` represents a single task. By default, it displays essential task details such as the `task ID` and its current `state`. However, when clicked or expanded, the component expands to reveal a comprehensive view of the task, showcasing additional information such as task execution progress, associated metadata, and any relevant details related to the task's execution environment.

This expandable functionality allows users to conveniently access more comprehensive information about a specific task without overwhelming the task list view. By collapsing the expanded view, users can regain a concise overview of the task list, with only the `task ID` and `state` visible. This feature improves the user experience by offering a balance between displaying essential information and providing detailed insights on-demand.
## API Reference

The `<ecc-client-ga4gh-tes-run>` component, is configured with specific attributes that define its behavior:  
- `baseURL`
- `id`
- `state`

#### Fixture

```html
  <ecc-client-ga4gh-tes-run
        baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"
        id="task-05b4ec40"
        state="SYSTEM_ERROR"/>
```

#### baseURL 

This attribute specifies the `base URL` of the `API` endpoint used for interacting with the [`TES`](https://github.com/ga4gh/task-execution-schemas) (Task Execution Service) backend. In this case, the base URL is set to "https://csc-tesk-noauth.rahtiapp.fi/v1". It serves as the starting point for constructing API requests and accessing the necessary data related to the task.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`string`|**Required**. Base end point to fetch tasks|null|

#### id

This attribute represents the unique identifier of the `task`. In the provided code, the `id` is set to "task-05b4ec40". The `task ID` is a crucial piece of information that allows the component to identify and retrieve the specific details associated with this particular task.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`id`|`string`|**Required**. Run ID of the task to be fetched|null|

#### state

This attribute indicates the current `state` or `status` of the `task`. In the given code snippet, the state attribute is set to "SYSTEM_ERROR". The available task states can vary depending on the [TES](https://github.com/ga4gh/task-execution-schemas) implementation and may include states such as `RUNNING,` `COMPLETED,` `FAILED,` etc. This is not to be provided by `app-author` but set according to the `API` response.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`state`|`string`|**Required**. State of the task|null|

#### admin 

This attribute is used to allow user to be able to be able interact with the task at admin level, ie delete (as of now). 

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`boolean`|Defines admin permissions|false|



![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

