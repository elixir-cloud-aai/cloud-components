# Form Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-form&gt;</div>
This component is used to render a form with the given fields.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
    <ecc-utils-design-form :v-if="renderComponent" :fields="primaryFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";

const fields = [...];

<ecc-utils-design-form
    .fields=${fields}
    @ecc-utils-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
```

```jsx [React]
import { EccUtilsDesignForm } from '@elixir-cloud/design/dist/react';

const fields = [...];

function App() {
  return (
    <div className='App'>
      <EccUtilsDesignForm
        fields={fields}
        onEccUtilsSubmit={(e) => {
          console.log("form-submitted", e.detail);
        }}
      >
      </EccUtilsDesignForm>
    </div>
  );
}

export default App;
```

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";
```

## Properties

| Property            | Required | Default | Type    | Description                                 |
| ------------------- | -------- | ------- | ------- | ------------------------------------------- |
| [`fields`](#fields) | `true`   | `[]`    | `Array` | Array of fields to be rendered in the form. |

### fields\*

This property is used to render the fields in the form. Fields can be passed as the array of objects. Each object represents a field. The object can have the following properties.

| Property                      | Required | Default | Type                                                                                                                                  | Description                                                                                                                                                                                                               |
| ----------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key                           | `true`   | `null`  | `string`                                                                                                                              | Unique key for the field.                                                                                                                                                                                                 |
| label                         | `true`   | `null`  | `string`                                                                                                                              | Label for the field.                                                                                                                                                                                                      |
| type                          | `false`  | `text`  | `text \| date \| number \| email \| password \| tel \| url \| search \| datetime-local \| time \| file  \| switch  \| array \| group` | Type of the field.                                                                                                                                                                                                        |
| children                      | `false`  | `null`  | `array`                                                                                                                               | Children fields for the field if type is array. This allows fields to be added dynamically                                                                                                                                |
| fieldOptions.required         | `false`  | `false` | `boolean`                                                                                                                             | Whether the field is required or not.                                                                                                                                                                                     |
| fieldOptions.default          | `false`  | `null`  | `string \| boolean`                                                                                                                   | Value of the field                                                                                                                                                                                                        |
| fieldOptions.multiple         | `false`  | `false` | `boolean`                                                                                                                             | Whether fields of type `file` accept multiple values. Only applies to fields of type `file`                                                                                                                               |
| fieldOptions.tooltip          | `false`  | `null`  | `string`                                                                                                                              | Tooltip or help-text that will render a popup when hovered over label of form field.                                                                                                                                      |
| fieldOptions.accept           | `false`  | `null`  | `string`                                                                                                                              | A comma seperated string that determines the types of files that fields of type `file` will accept. [Example](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept). Only applies to fields of type `file` |
| fieldOptions.returnIfEmpty    | `false`  | `false` | `boolean`                                                                                                                             | Determines if the data from an empty input field will be returned in the form data when empty.                                                                                                                            |
| arrayOptions.defaultInstances | `false`  | `null`  | `number`                                                                                                                              | Sets a default number of instances for fields of type `array` Only applies to fields of type `array`                                                                                                                      |
| arrayOptions.max              | `false`  | `null`  | `number`                                                                                                                              | Sets a maximum number of instances for fields of type `array` Only applies to fields of type `array`                                                                                                                      |
| arrayOptions.min              | `false`  | `null`  | `number`                                                                                                                              | Sets a minimum number of instances for fields of type `array` Only applies to fields of type `array` arrayOptions.defaultInstances must also be set and must be a number greater than arrayOptions.min                    |
| groupOptions.collapsible      | `false`  | `null`  | `number`                                                                                                                              | Determines if a field of type `group` will be collapsible                                                                                                                                                                 |

## Events

| Event Name         | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `ecc-utils-submit` | This event is fired when the form is submitted. The event detail contains the form data. |

## Methods

| Method Name               | Arguments             | Description                                                   |
| ------------------------- | --------------------- | ------------------------------------------------------------- |
| `idle()`                  | `none`                | Reset the form state to idle. Doesn't affect the form values. |
| `loading()`               | `none`                | Set the form state to loading. Disables the submit button.    |
| [`success()`](#methods-1) | {`message`: `string`} | Set the form state to success. Show the success message.      |
| [`error()`](#methods-1)   | {`message`: `string`} | Set the form state to error. Show the error message at end.   |

## Parts

| Part Name           | Description                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `form`              | Component's internal form.                                                                                             |
| `submit-button`     | Component's internal submit button                                                                                     |
| `field`             | Component's row containing a input, label & other elements.                                                            |
| `label`             | Component's label for field.                                                                                           |
| `input-base`        | Component's input base element.                                                                                        |
| `input`             | Component's input element. :placeholder and other pseudo selectors are supported.                                      |
| `input-label`       | Component's label for email, file, text, date, number, tel, url, search, datetime-local, time and password type fields |
| `header`            | Component's header for array and group type fields                                                                     |
| `container`         | Component's container for array and group type fields                                                                  |
| `item`              | Individual child fields in an array and group type field                                                               |
| `array-header`      | Component's header for array type field containing label & add button.                                                 |
| `array-label`       | Component's label for array type field.                                                                                |
| `array-item`        | Individual child fields in an array type field.                                                                        |
| `add-button`        | Component's add button for array type field.                                                                           |
| `remove-button`     | Component's remove button for array type field.                                                                        |
| `switch`            | Component's switch.                                                                                                    |
| `switch-thumb`      | Component's switch thumb element.                                                                                      |
| `switch-label`      | Component's label for switch type field                                                                                |
| `group`             | Component's group field                                                                                                |
| `group-item`        | Individual child fields in a group type field                                                                          |
| `group-header`      | Component's header for group type field, containing label                                                              |
| `group-label`       | Component's label for group type field                                                                                 |
| `group-toggle-icon` | Component's toggle icon for group type field                                                                           |
| `group-content`     | Content area for group type field, where the children are rendered                                                     |

## CSS Variables

## Examples

### Complex Form

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-utils-design-form class="complex-form-example" :v-if="renderComponent" :fields="complexExampleFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";

const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
      tooltip: "Your name",
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    fieldOptions: {
      tooltip: "Your email address",
    },
  },
  {
    key: "address",
    label: "Address",
    type: "group",
    groupOptions: {
      collapsible: true,
      tooltip: "Your address",
    },
    fieldOptions: {
      tooltip: "Group for address",
    },
    arrayOptions: {
      defaultInstances: 1,
      max: 4,
      min: 1,
    },
    children: [
      {
        key: "Details",
        label: "Details",
        type: "array",
        fieldOptions: {
          tooltip: "Details for address",
        },
        arrayOptions: {
          defaultInstances: 0,
          max: 2,
        },
        children: [
          {
            key: "houseNumber",
            label: "House Number",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your house number",
            },
          },
          {
            key: "street",
            label: "Street",
            type: "text",
            fieldOptions: {
              default: "1601 Harrier Ln",
              required: false,
              tooltip: "Your street name",
            },
          },
          {
            key: "city",
            label: "City",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your city name",
            },
          },
          {
            key: "isPrimary",
            label: "Primary",
            type: "switch",
            fieldOptions: {
              default: true,
              tooltip: "Is this your primary residence?",
            },
          },
        ],
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    fieldOptions: {
      tooltip: "Are you over 18 years old?",
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
      tooltip: "Your ID document",
    },
  },
];

<ecc-utils-design-form
    class="complex-form-example"
    .fields=${fields}
    @ecc-utils-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
```

```jsx [React]
import EccUtilsDesignForm from "@elixir-cloud/design/dist/react/form";

const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
      tooltip: "Your name",
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    fieldOptions: {
      tooltip: "Your email address",
    },
  },
  {
    key: "address",
    label: "Address",
    type: "group",
    groupOptions: {
      collapsible: true,
      tooltip: "Your address",
    },
    fieldOptions: {
      tooltip: "Group for address",
    },
    arrayOptions: {
      defaultInstances: 1,
      max: 4,
      min: 1,
    },
    children: [
      {
        key: "Details",
        label: "Details",
        type: "array",
        fieldOptions: {
          tooltip: "Details for address",
        },
        arrayOptions: {
          defaultInstances: 0,
          max: 2,
        },
        children: [
          {
            key: "houseNumber",
            label: "House Number",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your house number",
            },
          },
          {
            key: "street",
            label: "Street",
            type: "text",
            fieldOptions: {
              default: "1601 Harrier Ln",
              required: false,
              tooltip: "Your street name",
            },
          },
          {
            key: "city",
            label: "City",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your city name",
            },
          },
          {
            key: "isPrimary",
            label: "Primary",
            type: "switch",
            fieldOptions: {
              default: true,
              tooltip: "Is this your primary residence?",
            },
          },
        ],
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    fieldOptions: {
      tooltip: "Are you over 18 years old?",
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
      tooltip: "Your ID document",
    },
  },
];

function App() {
  return (
    <div className="App">
      <EccUtilsDesignForm
        className="complex-form-example"
        fields={fields}
        onEccUtilsSubmit={(e) => {
          console.log("form-submitted", e.detail);
        }}
      ></EccUtilsDesignForm>
    </div>
  );
}

export default App;
```

:::

  </div>
</ClientOnly>

### Methods

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-utils-design-form class="methods-example" :v-if="renderComponent" :fields="methodsExampleFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";

const fields = [
  {
    key: "custom-message",
    label: "Custom Message",
    type: "text",
  },
  {
    key: "throw-error",
    label: "Throw Error",
    type: "switch",
  },
]

<ecc-utils-design-form
    class="methods-example"
    .fields=${fields}
    @ecc-utils-submit=${(e) => {
      document.querySelector(".methods-example").loading();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (e.detail.form.data["throw-error"]) {
        document.querySelector(".methods-example").error({
          message: e.detail.form.data["custom-message"],
        });
      } else {
        document.querySelector(".methods-example").success({
          message: e.detail.form.data["custom-message"],
        });
      }
    }}
/>
```

```jsx [React]
import EccUtilsDesignForm from "@elixir-cloud/design/dist/react/form";

const fields = [
  {
    key: "custom-message",
    label: "Custom Message",
    type: "text",
  },
  {
    key: "throw-error",
    label: "Throw Error",
    type: "switch",
  },
];

function App() {
  return (
    <div className="App">
      <EccUtilsDesignForm
        fields={fields}
        onEccUtilsSubmit={async (e) => {
          e.target.loading();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          if (e.detail.form.data["throw-error"]) {
            e.target.error({
              message: e.detail.form.data["custom-message"],
            });
          } else {
            e.target.success({
              message: e.detail.form.data["custom-message"],
            });
          }
        }}
      ></EccUtilsDesignForm>
    </div>
  );
}

export default App;
```

:::

  </div>
</ClientOnly>

### Styled Form

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
    <ecc-utils-design-form class="styled-form-example" :v-if="renderComponent" :fields="styledExampleFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/form/index.js";

const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
      tooltip: "Your name",
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    fieldOptions: {
      tooltip: "Your email address",
    },
  },
  {
    key: "address",
    label: "Address",
    type: "group",
    groupOptions: {
      collapsible: true,
      tooltip: "Your address",
    },
    fieldOptions: {
      tooltip: "Group for address",
    },
    arrayOptions: {
      defaultInstances: 1,
      max: 4,
      min: 1,
    },
    children: [
      {
        key: "Details",
        label: "Details",
        type: "array",
        fieldOptions: {
          tooltip: "Details for address",
        },
        arrayOptions: {
          defaultInstances: 0,
          max: 2,
        },
        children: [
          {
            key: "houseNumber",
            label: "House Number",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your house number",
            },
          },
          {
            key: "street",
            label: "Street",
            type: "text",
            fieldOptions: {
              default: "1601 Harrier Ln",
              required: false,
              tooltip: "Your street name",
            },
          },
          {
            key: "city",
            label: "City",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your city name",
            },
          },
          {
            key: "isPrimary",
            label: "Primary",
            type: "switch",
            fieldOptions: {
              default: true,
              tooltip: "Is this your primary residence?",
            },
          },
        ],
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    fieldOptions: {
      tooltip: "Are you over 18 years old?",
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
      tooltip: "Your ID document",
    },
  },
];

<ecc-utils-design-form
    class="styled-form-example"
    .fields=${fields}
    @ecc-utils-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
```

```jsx [React]
import EccUtilsDesignForm from "@elixir-cloud/design/dist/react/form";

const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
      tooltip: "Your name",
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    fieldOptions: {
      tooltip: "Your email address",
    },
  },
  {
    key: "address",
    label: "Address",
    type: "group",
    groupOptions: {
      collapsible: true,
      tooltip: "Your address",
    },
    fieldOptions: {
      tooltip: "Group for address",
    },
    arrayOptions: {
      defaultInstances: 1,
      max: 4,
      min: 1,
    },
    children: [
      {
        key: "Details",
        label: "Details",
        type: "array",
        fieldOptions: {
          tooltip: "Details for address",
        },
        arrayOptions: {
          defaultInstances: 0,
          max: 2,
        },
        children: [
          {
            key: "houseNumber",
            label: "House Number",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your house number",
            },
          },
          {
            key: "street",
            label: "Street",
            type: "text",
            fieldOptions: {
              default: "1601 Harrier Ln",
              required: false,
              tooltip: "Your street name",
            },
          },
          {
            key: "city",
            label: "City",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your city name",
            },
          },
          {
            key: "isPrimary",
            label: "Primary",
            type: "switch",
            fieldOptions: {
              default: true,
              tooltip: "Is this your primary residence?",
            },
          },
        ],
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    fieldOptions: {
      tooltip: "Are you over 18 years old?",
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
      tooltip: "Your ID document",
    },
  },
];

function App() {
  return (
    <div className="App">
      <EccUtilsDesignForm
        className="styled-form-example"
        fields={fields}
        onEccUtilsSubmit={(e) => {
          console.log("form-submitted", e.detail);
        }}
      ></EccUtilsDesignForm>
    </div>
  );
}

export default App;
```

```css [CSS]
.styled-form-example::part(form) {
  display: flex;
  flex-direction: column;
}
.styled-form-example::part(submit-button) {
  margin-top: 20px;
  background-color: #4caf50;
  border: none;
  color: white;
  border-radius: 10px;
}
.styled-form-example::part(field) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.styled-form-example::part(array-header) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.styled-form-example::part(array-label) {
  font-weight: bold;
}
.styled-form-example::part(array-item) {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.styled-form-example::part(add-button) {
  color: #4caf50;
  border: none;
  border-radius: 10px;
}
.styled-form-example::part(remove-button) {
  color: #f44336;
  margin-bottom: -12px;
}
.styled-form-example::part(label) {
  font-size: 0.85rem;
}
.styled-form-example::part(switch) {
  background-color: #fff;
  height: 20px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 1px #ccc;
}
.styled-form-example::part(switch-thumb) {
  background-color: #4caf50;
  height: 20px;
  width: 20px;
  border: 0px;
}
.styled-form-example::part(input-base) {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 1px #ccc;
}
.styled-form-example::part(input) {
  font-size: small;
}
.styled-form-example::part(input):focus {
  outline: none;
  background-color: #f5f5f5;
}
.styled-form-example::part(input)::file-selector-button {
  background-color: #fff;
  color: #4caf50;
  font-weight: bold;
}
```

:::

  </div>
</ClientOnly>

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const renderComponent = ref(false);
const primaryFields = ref([]);
const complexExampleFields = ref([]);
const styledExampleFields = ref([]);
const methodsExampleFields = ref([]);
onMounted(() => {
  import("@elixir-cloud/design/dist/components/form/index.js").then(
    (module) => {
      renderComponent.value = false;
      primaryFields.value = [
        {
          key: "service-name",
          label: "Service name",
          type: "text",
          fieldOptions: {
            required: true,
          },
        },
      ];

      complexExampleFields.value = [
        {
          key: "name",
          label: "Name",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip: "Your name",
          },
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          fieldOptions: {
            tooltip: "Your email address",
          },
        },
        {
          key: "address",
          label: "Address",
          type: "group",
          groupOptions: {
            collapsible: true,
            tooltip: "Your address",
          },
          fieldOptions: {
            tooltip: "Group for address",
          },
          arrayOptions: {
            defaultInstances: 1,
            max: 4,
            min: 1,
          },
          children: [
            {
              key: "Details",
              label: "Details",
              type: "array",
              fieldOptions: {
                tooltip: "Details for address",
              },
              arrayOptions: {
                defaultInstances: 0,
                max: 2,
              },
              children: [
                {
                  key: "houseNumber",
                  label: "House Number",
                  type: "text",
                  fieldOptions: {
                    required: true,
                    tooltip: "Your house number",
                  },
                },
                {
                  key: "street",
                  label: "Street",
                  type: "text",
                  fieldOptions: {
                    default: "1601 Harrier Ln",
                    required: false,
                    tooltip: "Your street name",
                  },
                },
                {
                  key: "city",
                  label: "City",
                  type: "text",
                  fieldOptions: {
                    required: true,
                    tooltip: "Your city name",
                  },
                },
                {
                  key: "isPrimary",
                  label: "Primary",
                  type: "switch",
                  fieldOptions: {
                    default: true,
                    tooltip: "Is this your primary residence?",
                  },
                },
              ],
            },
          ],
        },
        {
          key: "18+",
          label: "18+",
          type: "switch",
          fieldOptions: {
            tooltip: "Are you over 18 years old?",
          },
        },
        {
          key: "id",
          label: "ID",
          type: "file",
          fieldOptions: {
            required: true,
            tooltip: "Your ID document",
          },
        },
      ];
      methodsExampleFields.value = [
        {
          key: "custom-message",
          label: "Custom Message",
          type: "text",
        },
        {
          key: "throw-error",
          label: "Throw Error",
          type: "switch",
        },
      ];

      renderComponent.value = true;
      document.querySelectorAll("ecc-utils-design-form").forEach((element) => {
        element.addEventListener("ecc-utils-submit", (e) => {
          console.log("form-submitted", e.detail);
        });
      });
      document.querySelectorAll(".methods-example").forEach((element) => {
        element.addEventListener("ecc-utils-submit", async (e) => {
          document.querySelector(".methods-example").loading();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          if (e.detail.form.data["throw-error"]) {
            document.querySelector(".methods-example").error({
              message: e.detail.form.data["custom-message"],
            });
          } else {
            document.querySelector(".methods-example").success({
              message: e.detail.form.data["custom-message"],
            });
          }
        });
      });
    },
  );
});
</script>

<style>
  .styled-form-example::part(form) {
    display: flex;
    flex-direction: column;
  }
  .styled-form-example::part(submit-button) {
    margin-top: 20px;
    background-color: #4caf50;
    border: none;
    color: white;
    border-radius: 10px;
  }
  .styled-form-example::part(field) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .styled-form-example::part(array-header) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .styled-form-example::part(array-label) {
    font-weight: bold;
  }
  .styled-form-example::part(array-item) {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .styled-form-example::part(add-button) {
    color: #4caf50;
    border: none;
    border-radius: 10px;
  }
  .styled-form-example::part(remove-button) {
    color: #f44336;
    margin-bottom: -12px;
  }
  .styled-form-example::part(label) {
    font-size: 0.85rem;
  }
  .styled-form-example::part(switch) {
    background-color: #fff;
    height: 20px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 1px 1px #ccc;
  }
  .styled-form-example::part(switch-thumb) {
    background-color: #4caf50;
    height: 20px;
    width: 20px;
    border: 0px;
  }
  .styled-form-example::part(input-base) {
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px #ccc;
  }
  .styled-form-example::part(input) {
    font-size: small;
  }
  .styled-form-example::part(input):focus {
    outline: none;
    background-color: #f5f5f5;
  }
  .styled-form-example::part(input)::file-selector-button {
    background-color: #fff;
    color: #4caf50;
    font-weight: bold;
  }
</style>
