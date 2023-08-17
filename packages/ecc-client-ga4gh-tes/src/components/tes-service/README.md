
# ecc-client-ga4gh-tes-service

The `ecc-client-ga4gh-tes-runs` is Web Component designed to facilitate the listing of [TES](https://github.com/ga4gh/task-execution-schemas) (Task Execution Service) service information. 

## API Reference

To use the "ecc-client-ga4gh-tes-service" Web Component, you need to provide one parameter: 
- `baseURL`
### Fixture

```html
  <ecc-client-ga4gh-tes-service baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"/>
```

#### baseURL 

This attribute specifies the base URL of the API endpoint used for interacting with the [TES](https://github.com/ga4gh/task-execution-schemas) (Task Execution Service) backend. In this case, the base URL is set to "https://csc-tesk-noauth.rahtiapp.fi/v1". It serves as the starting point for constructing API requests and accessing the necessary data related to the service.

| Parameter | Type     | Description                       | Default |
| :-------- | :------- | :-------------------------------- | :-------|
|`baseURL`|`string`|**Required**. Base end point to fetch tasks|null|


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

