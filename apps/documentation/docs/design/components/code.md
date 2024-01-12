# Collection Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-code&gt;</div>
Simple code editor to handle Yaml, JSON and text manipulation and input.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-code :v-if="renderComponent" :items="primaryItems" :filters="primaryFilters" totalItems="50"></ecc-utils-design-code>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/code/index.js";
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/design/dist/components/code/index.js";
```

## Properties

| Property   | Required | Default | Type      | Description                                                            |
| ---------- | -------- | ------- | --------- | ---------------------------------------------------------------------- |
| `code`     | `false`  |         | `String`  | Specifies the code to be rendered in the editor during initialization. |
| `language` | `false`  |         | `String`  | Specifies the language interpreter for syntax highlighting.            |
| `lnu`      | `true`   |         | `Boolean` | Specifies whether the editor should display line numbers.              |

## Slots

## Parts

| Part Name | Description |
| --------- | ----------- |

## CSS Variables

## Examples

### Styled Collection

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const renderComponent = ref(false);
const primaryItems = ref([]);
const primaryFilters = ref([]);

const primaryTag = ref();

onMounted(() => {
  import("@elixir-cloud/design/dist/components/code/index.js").then((module) => {
    // Your code logic here
  });
});
</script>

<style>
</style>
