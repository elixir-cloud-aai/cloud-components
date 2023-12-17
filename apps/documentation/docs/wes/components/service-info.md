# WES Service <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-client-lit-ga4gh-wes-service-info&gt;</div>
This component is used to show information related (but not limited to) the workflow descriptor formats, versions supported, the WES API versions supported, and information about general service availability.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-client-lit-ga4gh-wes-service-info />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

<ecc-client-lit-ga4gh-wes-service-info />;
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

| Property                                              | Required | Default                                   | Type     | Description |
| ----------------------------------------------------- | -------- | ----------------------------------------- | -------- | ----------- |
| [`baseURL`](#baseURL)                                 | `false`  | `https://prowes.rahtiapp.fi/ga4gh/wes/v1` | `String` | Base URL    |
| [`fields`](../../design/components/details.md#fields) | `false`  | `https://prowes.rahtiapp.fi/ga4gh/wes/v1` | `String` | Base URL    |

#### Default

```JSON
[
    {
      tabGroup: "General Info",
      children: [
        { label: "ID", path: "id", copy: true },
        { label: "Name", path: "name" },
        { label: "Description", path: "description" },
        { label: "Type", path: "type" },
        { label: "Organization", path: "organization", copy: true },
        { label: "Contact URL", path: "contactUrl", copy: true },
        { label: "Documentation URL", path: "documentationUrl", copy: true },
        { label: "Environment", path: "environment" },
        { label: "Version", path: "version" },
        {
          label: "Auth Instructions URL",
          path: "auth_instructions_url",
          copy: true,
        },
        { label: "Created At", path: "createdAt" },
        { label: "Updated At", path: "updatedAt" },
      ],
    },
    {
      tabGroup: "Workflow",
      children: [
        {
          label: "Default workflow engine parameters",
          path: "default_workflow_engine_parameters",
        },
        {
          label: "workflow engine versions",
          path: "workflow_engine_versions",
          copy: true,
        },
        {
          label: "Workflow type versions",
          path: "workflow_type_versions",
          copy: true,
        },
      ],
    },
    {
      tabGroup: "Supported Features",
      children: [
        {
          label: "Supported Filesystem Protocols",
          path: "supported_filesystem_protocols",
        },
        { label: "Supported WES Versions", path: "supported_wes_versions" },
      ],
    },
    {
      tabGroup: "Meta",
      children: [
        {
          label: "System state counts",
          path: "system_state_counts",
        },
        { label: "Tags", path: "tags" },
      ],
    },
  ];
```

### baseURL

This property is used to give `GET` endpoint service info. The provided baseURL is concatenated with `/service-info` and is used as an endpoint to create a `GET` request.

## Parts

TODO:

<!-- | Part Name       | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| ``          | Component's internal form.                                                        | -->

## CSS Variables

## Examples

### With baseURL and fields

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-client-lit-ga4gh-wes-service-info
        :fields="fields"
    />

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/lit-wes";

const fields = [{
		tabGroup: 'Basic Info',
		children: [{
				label: 'ID',
				path: 'id',
				copy: true
			},
			{
				label: 'Name',
				path: 'name'
			},
			{
				label: 'Description',
				path: 'description'
			},
			{
				label: 'Created At',
				path: 'createdAt'
			},
			{
				label: 'Updated At',
				path: 'updatedAt'
			},
		],
	},
	{
		tabGroup: 'Type Info',
		children: [{
				label: 'Group',
				path: 'type.group'
			},
			{
				label: 'Artifact',
				path: 'type.artifact'
			},
			{
				label: 'Version',
				path: 'type.version'
			},
		],
	},
	{
		tabGroup: 'Organization Info',
		children: [{
				label: 'Organization Name',
				path: 'organization.name',
				copy: true
			},
			{
				label: 'Organization URL',
				path: 'organization.url',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Contact and Documentation',
		children: [{
				label: 'Contact URL',
				path: 'contactUrl',
				copy: true
			},
			{
				label: 'Documentation URL',
				path: 'documentationUrl',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Version Info',
		children: [{
				label: 'Environment',
				path: 'environment'
			},
			{
				label: 'Version',
				path: 'version'
			},
			{
				label: 'Auth Instructions URL',
				path: 'auth_instructions_url',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Default Workflow Engine',
		children: [{
				label: 'Default workflow engine parameters',
				path: 'default_workflow_engine_parameters',
				copy: true
			},
			{
				label: 'Workflow engine versions',
				path: 'workflow_engine_versions',
				copy: true
			}
		],
	},
	{
		tabGroup: 'Supported Features',
		children: [{
				label: 'Supported Filesystem Protocols',
				path: 'supported_filesystem_protocols',
				copy: true
			},
			{
				label: 'Supported WES Versions',
				path: 'supported_wes_versions'
			},
			{
				label: 'Workflow type',
				path: 'workflow_type_versions'
			}
		],
	},
	{
		tabGroup: 'System State Counts',
		children: [{
				label: 'System state counts',
				path: 'system_state_counts'
			},
		],
	},
	{
		tabGroup: 'Tags',
		children: [{
				label: 'Tags',
				path: 'tags'
			},
		],
	},
]

<ecc-client-lit-ga4gh-wes-service-info .fields=${fields} baseURL="http://localhost:8090/ga4gh/wes/v1" .fields=${fields}/>;
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

  const { isDark } = useData();
  const fields = ref([]);
  const renderComponent = ref(false);

  onMounted(() => {
    import("@elixir-cloud/lit-wes").then((module) => {
      renderComponent.value = false;
      document.querySelectorAll("ecc-client-lit-ga4gh-wes-service-info").forEach((element) => {
         fields.value = [{
		tabGroup: 'Basic Info',
		children: [{
				label: 'ID',
				path: 'id',
				copy: true
			},
			{
				label: 'Name',
				path: 'name'
			},
			{
				label: 'Description',
				path: 'description'
			},
			{
				label: 'Created At',
				path: 'createdAt'
			},
			{
				label: 'Updated At',
				path: 'updatedAt'
			},
		],
	},
	{
		tabGroup: 'Type Info',
		children: [{
				label: 'Group',
				path: 'type.group'
			},
			{
				label: 'Artifact',
				path: 'type.artifact'
			},
			{
				label: 'Version',
				path: 'type.version'
			},
		],
	},
	{
		tabGroup: 'Organization Info',
		children: [{
				label: 'Organization Name',
				path: 'organization.name',
				copy: true
			},
			{
				label: 'Organization URL',
				path: 'organization.url',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Contact and Documentation',
		children: [{
				label: 'Contact URL',
				path: 'contactUrl',
				copy: true
			},
			{
				label: 'Documentation URL',
				path: 'documentationUrl',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Version Info',
		children: [{
				label: 'Environment',
				path: 'environment'
			},
			{
				label: 'Version',
				path: 'version'
			},
			{
				label: 'Auth Instructions URL',
				path: 'auth_instructions_url',
				copy: true
			},
		],
	},
	{
		tabGroup: 'Default Workflow Engine',
		children: [{
				label: 'Default workflow engine parameters',
				path: 'default_workflow_engine_parameters',
				copy: true
			},
			{
				label: 'Workflow engine versions',
				path: 'workflow_engine_versions',
				copy: true
			}
		],
	},
	{
		tabGroup: 'Supported Features',
		children: [{
				label: 'Supported Filesystem Protocols',
				path: 'supported_filesystem_protocols',
				copy: true
			},
			{
				label: 'Supported WES Versions',
				path: 'supported_wes_versions'
			},
			{
				label: 'Workflow type',
				path: 'workflow_type_versions'
			}
		],
	},
	{
		tabGroup: 'System State Counts',
		children: [{
				label: 'System state counts',
				path: 'system_state_counts'
			},
		],
	},
	{
		tabGroup: 'Tags',
		children: [{
				label: 'Tags',
				path: 'tags'
			},
		],
	},
]
        renderComponent.value = true;
      });
    });
  });
</script>
