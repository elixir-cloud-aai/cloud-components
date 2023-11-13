# Collection Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-collection&gt;</div>
This component is used to render a collection of items. It can be used to render a filters & pagination component for a list of items.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-collection :v-if="renderComponent"></ecc-utils-design-collection>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/collection/index.js";
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/design/dist/collection/index.js";
```

## Properties

| Property | Required | Default | Type | Description |
| -------- | -------- | ------- | ---- | ----------- |

## Events

| Event Name | Description |
| ---------- | ----------- |

## Methods

| Method Name | Arguments | Description |
| ----------- | --------- | ----------- |

## Parts

| Part Name | Description |
| --------- | ----------- |

## CSS Variables

## Examples

### Styled Collection

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-collection class="styled-collection-example" :v-if="renderComponent"></ecc-utils-design-collection>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/collection/index.js";
```

```css [CSS]

```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const renderComponent = ref(false);
onMounted(() => {
  import("@elixir-cloud/design/dist/collection/index.js").then((module) => {
    renderComponent.value = false;

    renderComponent.value = true;
    // document.querySelectorAll("ecc-utils-design-form").forEach((element) => {
    //   element.addEventListener("form-submit", (e) => {
    //     console.log("form-submitted", e.detail);
    //   });
    // });
  });
});
</script>

<style>
</style>
