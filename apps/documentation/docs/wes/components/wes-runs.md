# Runs Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-client-lit-ga4gh-wes-runs&gt;</div>
This component facilitates browsing workflow runs via WES API.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-client-lit-ga4gh-wes-runs />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

<ecc-client-lit-ga4gh-wes-runs />;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/lit-wes";
```

## Properties

| Property                | Required | Default                                   | Type     | Description             |
| ----------------------- | -------- | ----------------------------------------- | -------- | ----------------------- |
| [`baseURL`](#baseURL)   | `false`  | `https://prowes.rahtiapp.fi/ga4gh/wes/v1` | `String` | Base URL                |
| [`pageSize`](#pageSize) | `false`  | 5                                         | `Number` | Number of runs per page |

### baseURL

This property is used to give `POST` endpoint to create workflow. The provided baseURL is concatinated with `/runs` and is used as an endpoint to create a `POST` request.

### baseURL

This property is used to define the number of runs to be rendered per pagination window.

## Parts

TODO:

<!-- | Part Name       | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| ``          | Component's internal form.                                                        | -->

## CSS Variables

## Examples

### With baseURL and pageSize

Runs component here renders 7 runs per page.

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-wes-runs
        baseURL="http://localhost:8090/ga4gh/wes/v1"
        pageSize=7
    />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

<ecc-client-lit-ga4gh-wes-create-run baseURL="http://localhost:8090/ga4gh/wes/v1" />;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

> The baseURL provided is localhost:8090, for this to work, have a WES implementation running on PORT 8090 or locally deploy [proWES](https://github.com/elixir-cloud-aai/proWES).

<script setup>
  import { onMounted } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
onMounted(() => {
  import("@elixir-cloud/lit-wes");
});
</script>
