# Collection Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-code&gt;</div>
Simple code editor to handle Yaml, JSON and multiline text input.
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

| Property      | Required | Default | Type     | Description                                                            |
| ------------- | -------- | ------- | -------- | ---------------------------------------------------------------------- |
| `code`        | `false`  |         | `String` | Specifies the code to be rendered in the editor during initialization. |
| `label`       | `Code`   |         | `String` | Label for code editor input field.                                     |
| `language`    | `false`  |         | `String` | Specifies the language interpreter for syntax highlighting.            |
| `indentation` | `2`      |         | `Number` | Specifies number of spaces that should be considered for 1 Tab space.  |
| `blurDelay`   | `150`    |         | `Number` | Time in ms between 2 Tab key presses that should move the focus.       |

## Events

| Event Name         | Description                                                                                                                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ecc-utils-change` | This event is triggered when there is a change in the code within the editor. The event details include the language set by the package author, the code as value, and an error attribute indicating whether the entered code is valid based on the specified language. |

## Methods

| Method Name | Arguments | Description        |
| ----------- | --------- | ------------------ |
| `getCode()` |           | Returns the input. |

## Slots

## Parts

## Examples

### JSON

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-code :v-if="renderComponent" :items="primaryItems" :filters="primaryFilters" totalItems="50" language="JSON"></ecc-utils-design-code>

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

### Indentation

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-code :v-if="renderComponent" indentation="4"></ecc-utils-design-code>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/code/index.js";

<ecc-utils-design-code indentation=12></ecc-utils-design-code>;
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
  import("@elixir-cloud/design/dist/components/code/index.js").then((module) => {
  });
});
</script>

<style>
</style>
