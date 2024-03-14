# List Component <Badge type="warning" text="beta" />

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

| Property                                              | Required | Default                                   | Type            | Description                                                   |
| ----------------------------------------------------- | -------- | ----------------------------------------- | --------------- | ------------------------------------------------------------- |
| [`baseURL`](#baseURL)                                 | `false`  | `https://prowes.rahtiapp.fi/ga4gh/wes/v1` | `String`        | Base URL                                                      |
| [`pageSize`](#pageSize)                               | `false`  | 5                                         | `Number`        | Number of runs per page                                       |
| [`fields`](../../design/components/details.md#fields) | `false`  | [`default`](#default)                     | `Array<Fields>` | Configuration based on which data will be rendered in groups. |
| `filter`                                              | `false`  | `true`                                    | `Boolean`       | Defines the rendering of the filter-by-state bar.             |

> Filter feature isn't implemented in the package as it isn't implemented in backend and client side filtering is not an ideal solution.

### baseURL

This property is used to give `POST` endpoint to create workflow. The provided baseURL is concatenated with `/runs` and is used as an endpoint to create a `POST` request.

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
          path: "request.tags",
        },
        {
          path: "request.workflow_engine_parameters",
        },
        {
          path: "request.workflow_params",
        },
        {
          path: "request.workflow_type",
        },
        {
          path: "request.workflow_type_version",
        },
        {
          path: "request.workflow_url",
        },
      ],
    },
    {
      tabGroup: "Log",
      children: [
        {
          path: "run_log",
        },
        {
          path: "task_logs",
        },
      ],
    },
  ]
```

<!-- ## Parts

## CSS Variables
 -->

## Examples

### With baseURL, pageSize, fields and filter

Runs component here renders 7 runs per page and no filtering.

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-wes-runs
        :pageSize="examplePageSize"
        :fields="exampleFields"
        :filter="exampleFilter"
        :baseURL="exampleURL"
    />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

const fields = [
  {
    "tabGroup": "Experiment",
    "children": [
      {
        "path": "request.workflow_type",
      },
      {
        "path": "request.workflow_type_version",
      },
      {
        "path": "request.workflow_params",
        "copy": true,
      },
      {
        "path": "request.workflow_engine_parameters",
        "copy": true,
      },
      {
        "path": "request.workflow_url",
        "copy": true,
      },
    ],
  },
  {
    "tabGroup": "Tags",
    "children": [
      {
        "path": "request.tags",
      },
    ],
  },
  {
    "tabGroup": "Execution",
    "children": [
      {
        "path": "run_id",
      },
      {
        "path": "state",
      },
      {
        "path": "run_log",
        "copy": true,
      },
      {
        "path": "task_logs",
        "copy": true,
      },
    ],
  },
  {
    "tabGroup": "Command",
    "children": [
      {
        "path": "run_log.cmd",
        "copy": true,
      },
      {
        "path": "task_logs[].cmd",
      },
    ],
  },
  {
    "tabGroup": "Output",
    "children": [
      {
        "path": "outputs",
        "copy": true,
      },
    ],
  }
]
;

const filter = false;

<ecc-client-lit-ga4gh-wes-create-run
  .baseURL="http://localhost:8090/ga4gh/wes/v1"
  .pageSize="7"
  .fields=${fields}
  .filter=${filter}
/>;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

> The baseURL provided is localhost:8090, for this to work, have a WES implementation running on PORT 8090 or locally deploy [proWES](https://github.com/elixir-cloud-aai/proWES).

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";

const renderComponent = ref(false);

const { isDark } = useData();
const exampleFields = ref([]);
const exampleURL = ref("");
const examplePageSize = ref(0);
const exampleFilter = ref();

onMounted(async () => {
  try {
    const module = await import("@elixir-cloud/lit-wes");

    // Assuming the module exports exampleFields, exampleURL, and examplePageSize
    exampleFilter.value = false;
    exampleFields.value =  [
  {
    "tabGroup": "Experiment",
    "children": [
      {
        "path": "request.workflow_type",
      },
      {
        "path": "request.workflow_type_version",
      },
      {
        "path": "request.workflow_params",
        "copy": true,
      },
      {
        "path": "request.workflow_engine_parameters",
        "copy": true,
      },
      {
        "path": "request.workflow_url",
        "copy": true,
      },
    ],
  },
  {
    "tabGroup": "Tags",
    "children": [
      {
        "path": "request.tags",
      },
    ],
  },
  {
    "tabGroup": "Execution",
    "children": [
      {
        "path": "run_id",
      },
      {
        "path": "state",
      },
      {
        "path": "run_log",
        "copy": true,
      },
      {
        "path": "task_logs",
        "copy": true,
      },
    ],
  },
  {
    "tabGroup": "Command",
    "children": [
      {
        "path": "run_log.cmd",
        "copy": true,
      },
      {
        "path": "task_logs[].cmd",
      },
    ],
  },
  {
    "tabGroup": "Output",
    "children": [
      {
        "path": "outputs",
        "copy": true,
      },
    ],
  }
]
;
    exampleURL.value = "http://localhost:8090/ga4gh/wes/v1";
    examplePageSize.value = 7;

    renderComponent.value = true;
  } catch (error) {
    console.error("Error loading module:", error);
  }
});
</script>
