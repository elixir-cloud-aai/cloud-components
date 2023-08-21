# ecc-client-ga4gh-wes-run

The `ecc-client-ga4gh-wes-run` component is an integral part of the `ecc-client-ga4gh-wes-runs` component, which is used for listing [WES](https://github.com/ga4gh/workflow-execution-service-schemas) workflow runs in a paginated manner. The `ecc-client-ga4gh-wes-run` component serves as an individual item within the runs list, providing additional functionality for displaying and managing detailed information about a specific run.

When rendered within the `ecc-client-ga4gh-wes-runs` component, each instance of `ecc-client-ga4gh-wes-run` represents a single run. By default, it displays essential task details such as the `Run ID` and its current `state`. However, when clicked or expanded, the component expands to reveal a comprehensive view of the run, showcasing additional information.

## API Reference

The `<ecc-client-ga4gh-wes-run>` component, is configured with specific attributes that define its behavior:  
- `baseURL`
- `id`
- `state`
- `admin`

#### Fixture

```html
  <ecc-client-ga4gh-wes-run
          baseURL="https://wes-prod.cloud.e-infra.cz/ga4gh/wes/v1"
          id="5OZ3ZG"
          state="RUNNING"
          admin="true"/>
```

#### baseURL 

This attribute specifies the `base URL` of the `API` endpoint used for interacting with the [WES](https://github.com/ga4gh/workflow-execution-service-schemas) backend. In this case, the base URL is set to "https://csc-tesk-noauth.rahtiapp.fi/v1". It serves as the starting point for constructing API requests and accessing the necessary data related to the task.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`string`|**Required**. Base end point to fetch tasks|null|

#### id

This attribute represents the unique identifier of the `run`. In the provided code, the `id` is set to `5OZ3ZG`. The `Run ID` is a crucial piece of information that allows the component to identify and retrieve the specific details associated with this particular task.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`id`|`string`|**Required**. Run ID of the Workflow to be fetched|null|

#### state

This attribute indicates the current `state` or `status` of the `run`. In the given code snippet, the state attribute is set to "RUNNING". The available task states can vary depending on the [WES](https://github.com/ga4gh/workflow-execution-service-schemas) implementation and may include states such as `RUNNING,` `COMPLETED,` `FAILED,` etc. This is not to be provided by `app-author` but set according to the `API` response.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`state`|`string`|**Required**. State of the task|null|

#### admin 

This attribute is used to allow user to be able to be able interact with the run at admin level, ie delete (as of now). 

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`admin`|`boolean`|Defines admin permissions|false|



![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

