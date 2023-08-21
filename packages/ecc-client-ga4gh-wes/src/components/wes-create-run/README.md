# ecc-client-ga4gh-wes-run

The web component `ecc-client-ga4gh-wes-create-run` is designed to facilitate the creation of runs using the [WES](https://github.com/ga4gh/workflow-execution-service-schemas) API provided by the Global Alliance for Genomics and Health (GA4GH). This component allows users to define various parameters and inputs required for creating a run.

## API Reference

The `<ecc-client-ga4gh-wes-create-run>` component, is configured with specific attributes that define its behavior:

- `baseURL`

#### Fixture

```html
  <ecc-client-ga4gh-wes-create-run
        baseURL="https://csc-tesk-noauth.rahtiapp.fi/v1"/>
```

#### baseURL

This attribute specifies the `base URL` of the `API` endpoint used for interacting with the [WES](https://github.com/ga4gh/workflow-execution-service-schemas) backend. In this case, the base URL is set to "https://csc-tesk-noauth.rahtiapp.fi/v1". It serves as the starting point for constructing API requests and accessing the necessary data related to the workflows.

| Parameter | Type     | Description                                 | Default |
| :-------- | :------- | :------------------------------------------ | :------ |
| `baseURL` | `string` | **Required**. Base end point to fetch workflows | null    |


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)
