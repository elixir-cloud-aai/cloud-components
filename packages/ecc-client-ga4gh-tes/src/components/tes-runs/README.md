
# ecc-client-ga4gh-tes-runs

The `ecc-client-ga4gh-tes-runs` is Web Component designed to facilitate the listing of [TES](https://github.com/ga4gh/task-execution-schemas) (Task Execution Service) tasks in a paginated manner. It provides an intuitive interface for retrieving and displaying a collection of tasks, allowing users to efficiently navigate through a potentially large number of tasks.

With `ecc-client-ga4gh-tes-runs`, users can conveniently browse through tasks, accessing essential information such as task status, execution progress, and other relevant metadata. The component offers pagination functionality, enabling users to control the number of tasks displayed per page and easily navigate between different pages of task results.

## API Reference

To use the "ecc-client-ga4gh-tes-runs" Web Component, you need to provide two important parameters: 
- `pageNumber`
- `baseURL`
- `admin`
### Fixture

```html
  <ecc-client-ga4gh-tes-runs pageNumber="7" baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"/>
```
#### pageNumber

This parameter allows you to specify the page number of the task listing you want to display. By adjusting the pageNumber value, you can change the number of tasks to be listed in one page of pagination results.


| Parameter | Type     | Description                | Default|
| :-------- | :------- | :------------------------- |:------------|
|`pageNumber`|`string`|Number of tasks in one page|5|

#### baseURL 

This attribute specifies the base URL of the API endpoint used for interacting with the [TES](https://github.com/ga4gh/task-execution-schemas) (Task Execution Service) backend. In this case, the base URL is set to "https://csc-tesk-noauth.rahtiapp.fi/v1". It serves as the starting point for constructing API requests and accessing the necessary data related to the task.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`string`|**Required**. Base end point to fetch tasks|null|

#### baseURL 

This attribute is used to allow user to be able to be able interact with the task at admin level, ie delete (as of now). 

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`boolean`|Defines admin permissions|false|


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

