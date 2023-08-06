# ecc-client-ga4gh-wes-runs

The `ecc-client-ga4gh-wes-runs` is Web Component designed to facilitate the listing of [WES](https://github.com/ga4gh/workflow-execution-service-schemas) workflows in a paginated manner. It provides an intuitive interface for retrieving and displaying a collection of runs, allowing users to efficiently navigate through a potentially large number of runs.

With `ecc-client-ga4gh-wes-runs`, users can conveniently browse through runs, accessing essential information such as run status, run Id, and other relevant metadata. The component offers pagination functionality, enabling users to control the number of runs displayed per page and easily navigate between different pages of run results.

## API Reference

To use the "ecc-client-ga4gh-wes-runs" Web Component, you need to provide some important parameters: 
- `pageNumber`
- `baseURL`
- `admin`
### Fixture

```html
    <ecc-client-ga4gh-wes-runs
      pageNumber=2
      baseURL="https://wes-prod.cloud.e-infra.cz/ga4gh/wes/v1"/>
```
#### pageNumber

This parameter allows you to specify the page number of the run listing you want to display. By adjusting the pageNumber value, you can change the number of runs to be listed in one page of pagination results.


| Parameter | Type     | Description                | Default|
| :-------- | :------- | :------------------------- |:------------|
|`pageNumber`|`string`|Number of runs in one page|5|

#### baseURL 

This attribute specifies the base URL of the API endpoint used for interacting with the [WES](https://github.com/ga4gh/workflow-execution-service-schemas) backend. In this case, the base URL is set to `https://csc-tesk-noauth.rahtiapp.fi/v1`. It serves as the starting point for constructing API requests and accessing the necessary data related to the run.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`string`|**Required**. Base end point to fetch runs|null|

#### admin 

This attribute is used to allow user to be able interact with the runs at admin level, ie delete (as of now). 

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`boolean`|Defines admin permissions|false|


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)
