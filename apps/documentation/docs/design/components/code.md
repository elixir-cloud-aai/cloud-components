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

## Methods

| Method Name | Arguments | Description        |
| ----------- | --------- | ------------------ |
| `getCode()` |           | Returns the input. |

## Slots

## Parts

| Part Name                         | Description                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `container`                       | Wrapper container for code and header (select, copy, etc.)                    |
| `header`                          | Header container                                                              |
| [`code`](#code)                   | Code wrapper of this element (see the [css variable](#code) for more info).   |
| `select-form-control`             | The form control that wraps the label, input, and help text.                  |
| `select-form-control-label`       | The labels wrapper.                                                           |
| `select-form-control-input`       | The selects wrapper.                                                          |
| `select-form-control-help-text`   | The help texts wrapper.                                                       |
| `select-combobox`                 | The container that wraps the prefix, combobox, clear icon, and expand button. |
| `select-prefix`                   | The container that wraps the prefix slot.                                     |
| `select-display-input`            | The element that displays the selected options label, an <input> element.     |
| `select-listbox`                  | The listbox container where options are slotted.                              |
| `select-tags`                     | The container that houses option tags when multiselect is used.               |
| `select-tag`                      | The individual tags that represent each multiselect option.                   |
| `select-tag__base`                | The tags base part.                                                           |
| `select-tag__content`             | The tags content part.                                                        |
| `select-tag__remove-button`       | The tags remove button.                                                       |
| `select-tag__remove-button__base` | The tags remove button base part.                                             |
| `select-clear-button`             | The clear button.                                                             |
| `select-expand-icon`              | The container that wraps the expand icon.                                     |
| `copy-button`                     | The internal `<button>` element.                                              |
| `copy-icon`                       | The container that holds the copy icon.                                       |
| `copy-success-icon`               | The container that holds the success icon.                                    |
| `copy-error-icon`                 | The container that holds the error icon.                                      |
| `copy-tooltip__base`              | The tooltips exported base part.                                              |
| `copy-tooltip__base__popup`       | The tooltips exported popup part.                                             |
| `copy-tooltip__base__arrow`       | The tooltips exported arrow part.                                             |
| `copy-tooltip__body`              | The tooltips exported body part.                                              |

## CSS Variables

### Code

| Variable                 | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `--font-family`          | The font family used for the code.                 |
| `--font-size`            | The font size of the code.                         |
| `--line-height`          | The line height of the code.                       |
| `--lines-width`          | The width of the lines in the code.                |
| `--editor-bg-color`      | The background color of the code editor.           |
| `--editor-text-color`    | The text color of the code editor.                 |
| `--editor-caret-color`   | The color of the caret in the code editor.         |
| `--editor-sel-color`     | The color of the selected text in the code editor. |
| `--lines-bg-color`       | The background color of the lines in the code.     |
| `--lines-text-color`     | The text color of the lines in the code.           |
| `--scroll-track-color`   | The color of the scroll track in the code editor.  |
| `--scroll-thumb-color`   | The color of the scroll thumb in the code editor.  |
| `--hl-color-string`      | The color for strings in code highlighting.        |
| `--hl-color-function`    | The color for functions in code highlighting.      |
| `--hl-color-number`      | The color for numbers in code highlighting.        |
| `--hl-color-operator`    | The color for operators in code highlighting.      |
| `--hl-color-class-name`  | The color for class names in code highlighting.    |
| `--hl-color-punctuation` | The color for punctuation in code highlighting.    |
| `--hl-color-keyword`     | The color for keywords in code highlighting.       |
| `--hl-color-comment`     | The color for comments in code highlighting.       |

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
