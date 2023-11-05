# Form Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-form&gt;</div>
This component is used to render a form with the given fields.

<div :class="isDark ? 'component-dark component' : 'component-light component'">
  <ecc-utils-design-form :v-if="renderComponent" :fields="primaryFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design";

const fields = [...];

<ecc-utils-design-form
    .fields=${fields}
    @form-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
```

<!-- ```jsx [React]

``` -->

:::

</div>

## Importing

```js [HTML]
import "@elixir-cloud/design";
```

## Properties

| Property            | Required | Default | Type    | Description                                 |
| ------------------- | -------- | ------- | ------- | ------------------------------------------- |
| [`fields`](#fields) | `true`   | `[]`    | `Array` | Array of fields to be rendered in the form. |

### fields \*

This property is used to render the fields in the form. Fields can be passed as the array of objects. Each object represents a field. The object can have the following properties.

| Property              | Required | Default | Type                                                                                                                           | Description                                                                             |
| --------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| key                   | `true`   | `null`  | `string`                                                                                                                       | Unique key for the field.                                                               |
| label                 | `true`   | `null`  | `string`                                                                                                                       | Label for the field.                                                                    |
| type                  | `false`  | `text`  | `text    \| date \| number \| email \| password \| tel \| url \| search \| datetime-local \| time \| file  \| switch  \|array` | Type of the field.                                                                      |
| fieldOptions.required | `false`  | `false` | `boolean`                                                                                                                      | Whether the field is required or not.                                                   |
| switchOptions.default | `false`  | `false` | `boolean`                                                                                                                      | Default value for the switch. Only applicable when type is switch.                      |
| children              | `false`  | `null`  | `array`                                                                                                                        | Children fields for the field if type is array. This allows dynamic addition of fields. |

## Events

| Event Name    | Description                                                                              |
| ------------- | ---------------------------------------------------------------------------------------- |
| `form-submit` | This event is fired when the form is submitted. The event detail contains the form data. |

## Parts

| Part Name       | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `form`          | Component's internal form.                                                        |
| `submit-button` | Component's internal submit button                                                |
| `field`         | Component's row containing a input, label & other elements.                       |
| `label`         | Component's label for field.                                                      |
| `input-base`    | Component's input base element.                                                   |
| `input`         | Component's input element. :placeholder and other pseudo selectors are supported. |
| `array-header`  | Component's header for array type field containing label & add button.            |
| `array-label`   | Component's label for array type field.                                           |
| `array-item`    | Component's item for array type field.                                            |
| `add-button`    | Component's add button for array type field.                                      |
| `remove-button` | Component's remove button for array type field.                                   |
| `switch`        | Component's switch.                                                               |
| `switch-thumb`  | Component's switch thumb element.                                                 |

## CSS Variables

## Examples

### Complex Form

<div :class="isDark ? 'component-dark component' : 'component-light component'">
<!-- Render ecc-utils-design-form component only after the component is loaded -->
  <ecc-utils-design-form class="complex-form-example" :v-if="renderComponent" :fields="complexExampleFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design";


const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
  },
  {
    key: "address",
    label: "Address",
    type: "array",
    children: [
      {
        key: "street",
        label: "Street",
        type: "text",
      },
      {
        key: "city",
        label: "City",
        type: "text",
        fieldOptions: {
          required: true,
        },
      },
      {
        key: "isPrimary",
        label: "Primary",
        type: "switch",
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    switchOptions: {
      default: true,
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
    },
  },
];


<ecc-utils-design-form
    class="complex-form-example"
    .fields=${fields}
    @form-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
```

<!-- ```jsx [React]

``` -->

:::

</div>

### Styled Form

<div :class="isDark ? 'component-dark component' : 'component-light component'">
<!-- Render ecc-utils-design-form component only after the component is loaded -->
  <ecc-utils-design-form class="styled-form-example" :v-if="renderComponent" :fields="complexExampleFields"></ecc-utils-design-form>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design";


const fields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    fieldOptions: {
      required: true,
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
  },
  {
    key: "address",
    label: "Address",
    type: "array",
    children: [
      {
        key: "street",
        label: "Street",
        type: "text",
      },
      {
        key: "city",
        label: "City",
        type: "text",
        fieldOptions: {
          required: true,
        },
      },
      {
        key: "isPrimary",
        label: "Primary",
        type: "switch",
      },
    ],
  },
  {
    key: "18+",
    label: "18+",
    type: "switch",
    switchOptions: {
      default: true,
    },
  },
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      required: true,
    },
  },
];


<ecc-utils-design-form
    class="styled-form-example"
    .fields=${fields}
    @form-submit=${(e) => {
        console.log("form-submitted", e.detail);
    }}
/>
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

<!-- ```jsx [React]

``` -->

:::

</div>

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
const {isDark} = useData();
const renderComponent = ref(false);
console.log(renderComponent.value);
const primaryFields = ref([]);
const complexExampleFields = ref([]);
onMounted(() => {
  import("@elixir-cloud/design").then((module) => {
    renderComponent.value = false;
    primaryFields.value =  [
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
          },
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          fieldOptions: {
            // required: false,
          },
        },
        {
          key: "address",
          label: "Address",
          type: "array",
          children: [
            {
              key: "street",
              label: "Street",
              type: "text",
              fieldOptions: {
                // required: false,
              },
            },
            {
              key: "city",
              label: "City",
              type: "text",
              fieldOptions: {
                required: true,
              },
            },
            {
              key: "isPrimary",
              label: "Primary",
              type: "switch",
            },
          ],
        },
        {
          key: "18+",
          label: "18+",
          type: "switch",
          switchOptions: {
            default: true,
          },
        },
        {
          key: "id",
          label: "ID",
          type: "file",
          fieldOptions: {
            required: true,
          },
        },
      ];
    renderComponent.value = true;
    document.querySelectorAll("ecc-utils-design-form").forEach((element) => {
      element.addEventListener("form-submit", (e) => {
        console.log("form-submitted", e.detail);
      });
    });
  });
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
