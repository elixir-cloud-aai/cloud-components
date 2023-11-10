# Form Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-client-lit-ga4gh-wes-create-run&gt;</div>
This component is used to create workflows runs using WES API.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-client-lit-ga4gh-wes-create-run />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

<ecc-utils-design-form />;
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

| Property              | Required | Default                                   | Type     | Description |
| --------------------- | -------- | ----------------------------------------- | -------- | ----------- |
| [`baseURL`](#baseURL) | `false`  | `https://prowes.rahtiapp.fi/ga4gh/wes/v1` | `String` | Base URL    |

### baseURL

This property is used to give `POST` endpoint to create workflow. The provided baseURL is concatinated with `/runs` and is used as an endpoint to create a `POST` request.

## Parts

TODO:

<!-- | Part Name       | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| ``          | Component's internal form.                                                        | -->

## CSS Variables

## Examples

### With baseURL

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-wes-create-run
        baseURL="http://localhost:8090/ga4gh/wes/v1"
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

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
import '@elixir-cloud/lit-wes'
const { isDark } = useData();
    document.querySelectorAll("ecc-client-lit-ga4gh-wes-create-run").forEach((element) => {
      element.addEventListener("form-submit", (e) => {
        console.log("form-submitted", e.detail);
      });
    });
</script>
