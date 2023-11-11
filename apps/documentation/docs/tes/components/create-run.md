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

<script setup>
import { onMounted } from "vue";
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
