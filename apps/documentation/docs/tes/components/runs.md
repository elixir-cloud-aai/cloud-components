# List Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-client-lit-ga4gh-runs&gt;</div>
This component is used to browse task runs using TES API.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-client-lit-ga4gh-tes-runs>
    </ecc-client-lit-ga4gh-tes-runs>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-tes";

<ecc-client-lit-ga4gh-tes-runs />;
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

| Property                                              | Required | Default                                   | Type            | Description                                                   |
| ----------------------------------------------------- | -------- | ----------------------------------------- | --------------- | ------------------------------------------------------------- |
| [`baseURL`](#baseURL)                                 | `false`  | `https://protes.rahtiapp.fi/ga4gh/tes/v1` | `String`        | Base URL                                                      |
| [`pageSize`](#pageSize)                               | `false`  | 5                                         | `Number`        | Number of runs per page                                       |
| [`fields`](../../design/components/details.md#fields) | `false`  | [`default`](#default)                     | `Array<Fields>` | Configuration based on which data will be rendered in groups. |
| `filter`                                              | `false`  | `true`                                    | `Boolean`       | Defines if filter by state should be rendered.                |
| `search`                                              | `false`  | `true`                                    | `Boolean`       | Defines if search by prefix should be rendered.               |

### baseURL

The base URL for TES instance.

### pageSize

This property is used to define the number of runs to be rendered per pagination window.

### fields

This is an `Array<Field>` which defines how structure of the data to be rendered. [`Field`](#Field) which is an object of containing `tabGroup` and [`Children`](#Children).

#### default

The default value of `fields` property.

```JSON
[
    {
      tabGroup: "Overview",
      children: [
        {
          label: "Name",
          path: "name",
          copy: true,
        },
        {
          label: "Description",
          path: "description",
        },
        {
          label: "Resources",
          path: "resources",
        },
        {
          label: "Tags",
          path: "tags",
        },
        {
          label: "Executor",
          path: "executors",
        },
        {
          label: "Volumes",
          path: "volumes",
        },
        {
          label: "Creation time",
          path: "creation_time",
        },
      ],
    },
    {
      tabGroup: "Logs",
      children: [
        {
          label: "Logs",
          path: "logs",
          copy: true,
        },
      ],
    },
    {
      tabGroup: "Output and Inputs",
      children: [
        {
          label: "Output",
          path: "outputs",
        },
        {
          label: "Input",
          path: "inputs",
        },
      ],
    },
  ]
```

<!-- ## Parts

## CSS Variables
 -->

## Examples

### With baseURL, filter, search and fields configured

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-tes-runs
        baseURL="http://localhost:8080/ga4gh/tes/v1"
        :fields="exampleFields"
        :pageSize="10"
        :search="exampleSearch"
        :filter="exampleFilter"
    />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-tes";

const exampleSearch = false;
const exampleFilter = false;
const exampleFields = [
{
  tabGroup: "Overview",
  children: [
    {
      label: "Name",
      path: "name",
      copy: true,
    },
    {
      label: "Description",
      path: "description",
    },
    {
      label: "Creation time",
      path: "creation_time",
    }
  ],
},
{
  tabGroup: "Task info",
  children: [
    {
      label: "Resources",
      path: "resources",
    },
    {
      label: "Tags",
      path: "tags",
    },
    {
      label: "Executor",
      path: "executors",
    },
    {
      label: "Volumes",
      path: "volumes",
    },
  ]
},
{
  tabGroup: "Logs",
  children: [
    {
      label: "Logs",
      path: "logs",
      copy: true,
    },
  ],
},
{
  tabGroup: "Output",
  children: [
    {
      label: "Output",
      path: "outputs",
    },
    {
      label: "Input",
      path: "inputs",
    },
  ],
},
{
  tabGroup: "Input",
  children: [
    {
      label: "Input",
      path: "inputs",
    },
  ],
},
]

<ecc-client-lit-ga4gh-tes-runs
  .baseURL="http://localhost:8080/ga4gh/tes/v1"
  .fields=${fields}
  .filter=${filter}
  .search=${search}
/>;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

> The baseURL provided is localhost:8080, for this to work, have a TES implementation running on PORT 8080 or locally deploy [proTES](https://github.com/elixir-cloud-aai/proTES).

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const renderComponent = ref(false);
const exampleFields = ref([]);
const exampleSearch = ref([]);
const exampleFilter = ref([]);
onMounted(() => {
  import("@elixir-cloud/lit-tes").then((module) => {
    document.querySelectorAll("ecc-client-lit-ga4gh-tes-runs").forEach((element) => {
			renderComponent.value = false;
      
      exampleSearch.value = false;
      exampleFilter.value = false;
      exampleFields.value = [
    {
      tabGroup: "Overview",
      children: [
        {
          label: "Name",
          path: "name",
          copy: true,
        },
        {
          label: "Description",
          path: "description",
        },
        {
          label: "Creation time",
          path: "creation_time",
        }
      ],
    },
    {
      tabGroup: "Task info",
      children: [
        {
          label: "Resources",
          path: "resources",
        },
        {
          label: "Tags",
          path: "tags",
        },
        {
          label: "Executor",
          path: "executors",
        },
        {
          label: "Volumes",
          path: "volumes",
        },
      ]
    },
    {
      tabGroup: "Input",
      children: [
        {
          label: "Input",
          path: "inputs",
        },
      ],
    },
    {
      tabGroup: "Output",
      children: [
        {
          label: "Output",
          path: "outputs",
        },
        {
          label: "Input",
          path: "inputs",
        },
      ],
    },
    {
      tabGroup: "Logs",
      children: [
        {
          label: "Logs",
          path: "logs",
          copy: true,
        },
      ],
    },
  ]
			renderComponent.value = false;

    });
  });
});
</script>
