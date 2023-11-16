# Form Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-client-lit-ga4gh-tes-create-run&gt;</div>
This component is used to create task runs using TES API.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-client-lit-ga4gh-tes-create-run>
    </ecc-client-lit-ga4gh-tes-create-run>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-tes";

<ecc-client-lit-ga4gh-tes-create-run />;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/lit-tes";
```

## Properties

| Property              | Required | Default                                   | Type     | Description |
| --------------------- | -------- | ----------------------------------------- | -------- | ----------- |
| [`baseURL`](#baseURL) | `false`  | `https://protes.rahtiapp.fi/ga4gh/tes/v1` | `String` | Base URL    |

### baseURL

This property is used to give `POST` endpoint to create `Task run`. The provided baseURL is concatinated with `/runs` and is used as an endpoint to create a `POST` request.

## Parts

<!-- TODO: -->

<!-- | Part Name       | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| ``          | Component's internal form.                                                        | -->

## CSS Variables

## Examples

### With baseURL

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-tes-create-run
        baseURL="http://localhost:8080/ga4gh/tes/v1"
    />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-tes";

<ecc-client-lit-ga4gh-tes-create-run baseURL="http://localhost:8080/ga4gh/tes/v1" />;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

> The baseURL provided is localhost:8080, for this to work, have a TES implementation running on PORT 8080 or locally deploy [proTES](https://github.com/elixir-cloud-aai/proTES).

<script setup>
import { onMounted } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
onMounted(() => {
  import("@elixir-cloud/lit-tes").then((module) => {
    document.querySelectorAll("ecc-client-lit-ga4gh-tes-create-run").forEach((element) => {
      element.addEventListener("form-submit", (e) => {
        console.log("form-submitted", e.detail);
      });
    });
  });
});
</script>
