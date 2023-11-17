# Collection Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-collection&gt;</div>
This component is used to render a collection of items. It can be used to render a filters & pagination component for a list of items.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-collection :v-if="renderComponent" :items="primaryItems" :filters="primaryFilters" totalItems="50"></ecc-utils-design-collection>

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

| Property              | Required | Default | Type     | Description                                                                                                                     |
| --------------------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [`items`](#items)     | `true`   |         | `Array`  | An array of items to render                                                                                                     |
| [`filters`](#filters) | `false`  |         | `Array`  | An array of filters to render                                                                                                   |
| `totalItems`          | `false`  |         | `Number` | The total number of items in the collection. If not provided, the collection will render pagination without fixed page numbers. |
| `pageSize`            | `false`  | 5       | `Number` | The number of items per pagination.                                                                                             |

### items\*

| Property | Required | Default | Type      | Description                                                   |
| -------- | -------- | ------- | --------- | ------------------------------------------------------------- |
| `key`    | `true`   |         | `String`  | The key of the item                                           |
| `index`  | `true`   |         | `Number`  | The index of the item                                         |
| `name`   | `true`   |         | `String`  | The name of the item                                          |
| `lazy`   | `false`  | `false` | `Boolean` | Whether or not the contents of the item should be lazy loaded |
| `tag`    | `false`  |         | `Object`  | The tag to render with the item                               |

### filters

| Property                | Required | Default | Type                 | Description                                                                                       |
| ----------------------- | -------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `key`                   | `true`   |         | `String`             | The key of the filter                                                                             |
| `type`                  | `true`   |         | `search` \| `select` | The type of the filter.                                                                           |
| `options`               | `false`  |         | `Array`              | The options to render for the filter. Only applicable for `select` filters.                       |
| `selectConfig.multiple` | `false`  | `false` | `Boolean`            | Whether or not the select should allow multiple selections. Only applicable for `select` filters. |
| `placeholder`           | `false`  |         | `String`             | The placeholder to render for the filter.                                                         |

## Events

| Event Name    | Payload                          | Description                     |
| ------------- | -------------------------------- | ------------------------------- |
| `page-change` | `{ page: Number }`               | Fired when the page is changed. |
| `expand-item` | `{ key: String }`                | Fired when an item is expanded. |
| `filter`      | `{ key: String, value: String }` | Fired when a filter is applied. |

## Methods

| Method Name | Arguments | Description                                     |
| ----------- | --------- | ----------------------------------------------- |
| `setPage()` | `page`    | Can be used to set the page of the collection.  |
| `error()`   | `message` | Can be used to display error alert to the user. |

## Slots

| Slot Name      | Description                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `${items.key}` | The contents of the item. This slot will be named after the key of the item provided by the [`items`](#items) property. |

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

const primaryTag = ref()

onMounted(() => {
  import("@elixir-cloud/design/dist/collection/index.js").then((module) => {
    renderComponent.value = false;
    primaryItems.value = [];
    primaryFilters.value = [
      {
        key: "title",
        type: "search",
        placeholder: "Search",
      },
      {
        key: "tag",
        type: "select",
        options: ["SUCCESS", "WARNING", "ERROR", "DEFAULT", "PRIMARY"],
        placeholder: "Filter by tag",
        selectOptions: {
          // multiple: true,
        },
      },
    ];
    renderComponent.value = true;
    document.querySelectorAll("ecc-utils-design-collection").forEach((element) => {
      element.addEventListener("page-change", async (e) => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${e.detail.page}&_limit=5${primaryTag.value ? `&userId=${primaryTag.value}` : ""}}`);
        const data = await res.json();
        for (let i = 0; i < data.length; i += 1) {
          const element = data[i];
          const existingItem = e.target.items.find(
            (item) => item.key === `item-${element.id}`
          );
          if (existingItem) {
            return; 
          }
          e.target.items = [
            ...e.target.items,
            {
              index: (e.detail.page - 1) * 5 + i + 1,
              name: element.title,
              key: `item-${element.id}`,
              lazy: true,
              tag: {
                name: element.userId % 5 === 0 ? "SUCCESS" : element.userId % 4 === 0 ? "WARNING" : element.userId % 3 === 0 ? "ERROR" : element.userId % 2 === 0 ? "NEUTRAL" : "PRIMARY",
                type: element.userId % 5 === 0 ? "success" : element.userId % 4 === 0 ? "warning" : element.userId % 3 === 0 ? "danger" : element.userId % 2 === 0 ? "neutral" : "primary",
              },
            },
          ];
        }
      });
      element.addEventListener("expand-item", async (e) => {
          // Check if child already exists
          const children = e.target.querySelectorAll(`[slot="${e.detail.key}"]`);
          if (children.length === 0) {
            // Add chlld to ecc-utils-design-collection
            const res = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${
                e.detail.key.split("-")[1]
              }`
            );
            const data = await res.json();
            const child = document.createElement("div");
            child.setAttribute("slot", e.detail.key);
            child.innerHTML = `<p>Body: ${data.body}</p>`;
            e.target.appendChild(child);
          }
        }
      );
      element.addEventListener("filter", async (e) => {
        if (e.detail.key === "title") {
          const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=5&title_like=${e.detail.value.toLowerCase()}`)
          const data = await res.json();
          primaryItems.value = data.map((item, index) => {
            return {
              index: index + 1,
              name: item.title,
              key: `item-${item.id}`,
              lazy: true,
              tag: {
                name: item.userId % 5 === 0 ? "SUCCESS" : item.userId % 4 === 0 ? "WARNING" : item.userId % 3 === 0 ? "ERROR" : item.userId % 2 === 0 ? "NEUTRAL" : "PRIMARY",
                type: item.userId % 5 === 0 ? "success" : item.userId % 4 === 0 ? "warning" : item.userId % 3 === 0 ? "danger" : item.userId % 2 === 0 ? "neutral" : "primary",
              },
            };
          });
        } else if(e.detail.key == "tag") {
          primaryTag.value = e.detail.value;
          const userId = e.detail.value === "SUCCESS" ? 5 : e.detail.value === "WARNING" ? 4 : e.detail.value === "ERROR" ? 3 : e.detail.value === "DEFAULT" ? 2 : e.detail.value === "PRIMARY" ? 1 : 0;
          primaryTag.value = userId;
          const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=5&userId=${userId}`)
          const data = await res.json();
          e.target.totalItems = 10;
          primaryItems.value = data.map((item, index) => {
            return {
              index: index + 1,
              name: item.title,
              key: `item-${item.id}`,
              lazy: true,
              tag: {
                name: item.userId % 5 === 0 ? "SUCCESS" : item.userId % 4 === 0 ? "WARNING" : item.userId % 3 === 0 ? "ERROR" : item.userId % 2 === 0 ? "NEUTRAL" : "PRIMARY",
                type: item.userId % 5 === 0 ? "success" : item.userId % 4 === 0 ? "warning" : item.userId % 3 === 0 ? "danger" : item.userId % 2 === 0 ? "neutral" : "primary",
              },
            };
          });
        }
      })
    });
  });
  fetch(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=5`).then((res) => {
    res.json().then((data) => {
      primaryItems.value = data.map((item) => {
        const chosenTag = Math.random();
        return {
          index: item.id,
          name: item.title,
          key: `item-${item.id}`,
          lazy: true,
          tag: {
            name: item.userId % 5 === 0 ? "SUCCESS" : item.userId % 4 === 0 ? "WARNING" : item.userId % 3 === 0 ? "ERROR" : item.userId % 2 === 0 ? "NEUTRAL" : "PRIMARY",
            type: item.userId % 5 === 0 ? "success" : item.userId % 4 === 0 ? "warning" : item.userId % 3 === 0 ? "danger" : item.userId % 2 === 0 ? "neutral" : "primary",
          },
        };
      });
    })
  });

});
</script>

<style>
</style>
