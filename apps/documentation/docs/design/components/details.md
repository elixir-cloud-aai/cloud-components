# Details Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-details&gt;</div>
This component is used to render a detailed view of items.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
<ecc-utils-design-details v-if="renderComponent" :fields="fields" :buttons="buttons">
<p slot="footer">26 Nov 2023</p>
</ecc-utils-design-details>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/details/index.js";

<ecc-utils-design-details fields="fields" buttons="buttons">
  <p slot="footer">26 Nov 2023</p>
</ecc-utils-design-details>;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/design/dist/details/index.js";
```

## Properties

| Property              | Required | Default | Type    | Description                               |
| --------------------- | -------- | ------- | ------- | ----------------------------------------- |
| [`fields`](#fields)   | `true`   |         | `Array` | An array of fields to render              |
| [`buttons`](#buttons) | `false`  |         | `Array` | An array of buttons and its configuration |

### fields\*

| Property                | Required | Default | Type     | Description                                              |
| ----------------------- | -------- | ------- | -------- | -------------------------------------------------------- |
| `tabGroup`              | `true`   |         | `String` | Tab group in which all the its children will be rendered |
| [`Children`](#children) | `true`   |         | `Array`  | Array of the details to be rendered                      |

### children\*

| Property                  | Required | Default | Type                  | Description                                     |
| ------------------------- | -------- | ------- | --------------------- | ----------------------------------------------- |
| `key`                     | `true`   |         | `string`              | The unique key of field                         |
| `label`                   | `true`   |         | `string`              | The label of the information to be rendered.    |
| `value`                   | `true`   |         | `string` or `number`  | The info to be rendered                         |
| `type`                    | `true`   |         | `text` or `long-text` | The type of information                         |
| `textOptions.copy`        | `false`  |         | `boolean`             | Text will have a copy to clip button            |
| `arrayOptions.isVertical` | `false`  |         | `boolean`             | Direction of rendering of array of string       |
| `arrayOptions.pill`       | `false`  |         | `boolean`             | Puts the string of array into a pill shaped tag |

### Buttons

The `buttons` property allows you to define an array of buttons along with their configuration. Buttons can be used to trigger specific actions or events within the component.

| Property  | Required | Default     | Type                           | Description                                                                                      |
| --------- | -------- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `key`     | `true`   |             | `string`                       | A unique identifier for the button, used to distinguish between buttons in the configuration.    |
| `name`    | `true`   |             | `string`                       | The display name or label for the button.                                                        |
| `size`    | `false`  | `'medium'`  | `small` or `meduim` or `large` | The size of the button. Possible values: `'small'`, `'medium'`, `'large'`.                       |
| `variant` | `false`  | `'primary'` | `string`                       | The visual style or color variant of the button. Possible values: `'primary'`, `'warning'`, etc. |
| `outline` | `false`  | `false`     | `boolean`                      | Specifies whether the button should have an outlined style.                                      |
| `pill`    | `false`  | `false`     | `boolean`                      | Specifies whether the button should have a pill-shaped style.                                    |
| `icon`    | `false`  |             | `object`                       | Configuration object for an optional icon associated with the button.                            |

#### Example

```javascript
buttons: [
  {
    key: "1",
    name: "Button 1",
    size: "medium",
    variant: "primary",
    outline: false,
    pill: false,
    icon: {
      name: "trash",
      viewBox: "0 0 16 16",
      path: "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z",
    },
  },
  {
    key: "2",
    name: "Button 2",
    size: "medium",
    variant: "warning",
    outline: true,
    pill: false,
  },
];
```

### Events

The component emits a custom event named `button-${button.key}-click` when a button is clicked. The event provides information about the clicked button, such as its key and name.

#### Event Payload

| Property | Type     | Description                                  |
| -------- | -------- | -------------------------------------------- |
| `key`    | `String` | The unique identifier of the clicked button. |
| `event`  | `Event`  | The event emitted.                           |

### Methods

## Methods

| Method Name          | Arguments                                 | Description                                                      |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `setButtonLoading()` | {`index`: `number`, `loading`: `boolean`} | Sets the state of button with given index to given loading state |

## CSS Variables

## Examples

### Styled Collection

<script setup>
	import { onMounted, ref } from 'vue';
	import { useData } from 'vitepress';

	const { isDark } = useData();
	const renderComponent = ref(false);
	const fields = ref([]);
	const buttons = ref([]);

	onMounted(() => {
		import('@elixir-cloud/design/dist/details/index.js').then((module) => {
			renderComponent.value = false;
			fields.value = [
			  {
			    tabGroup: "General Info",
			    children: [
			      { key: "name", label: "Name", value: "John Doe", type: "text" },
			      { key: "age", label: "Age", value: 28, type: "text" },
			      {
			        key: "hobby",
			        label: "Hobby",
			        value: ["swimming", "dancing", "singing"],
			        type: "array",
			        arrayOptions: {
			          pill: true,
			        },
			      },
			      {
			        key: "email",
			        label: "Email",
			        value: "john@example.com",
			        type: "text",
			        textOptions: {
			          copy: true,
			        },
			      },
			      {
			        key: "credentials",
			        label: "Credentials",
			        value: {
			          username: "john.doe",
			          domain: "example",
			          extension: "com",
			        },
			        type: "object",
			      },
			    ],
			  },
			  {
			    tabGroup: "Address",
			    children: [
			      {
			        key: "street",
			        label: "Street",
			        value: "123 Main St",
			        type: "text",
			      },
			      { key: "city", label: "City", value: "Anytown", type: "text" },
			      { key: "zip", label: "Zip Code", value: "12345", type: "text" },
			    ],
			  },
			  {
			    tabGroup: "Description",
			    children: [
			      {
			        key: "bio",
			        label: "Bio",
			        value:
			          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde rerum maxime repellat ea numquam provident, iusto iste deleniti magni debitis, laborum excepturi inventore sed. Magni explicabo eligendi beatae labore dignissimos totam dolor voluptates veritatis molestias voluptatum commodi, expedita vel esse et officia distinctio debitis amet perspiciatis, sequi atque blanditiis, repellat quas saepe! A eos deserunt rerum repellat nobis corporis quam et ipsam voluptates totam pariatur modi cumque quibusdam, eius illo maxime. Numquam eos autem illo? Laudantium facilis autem quo nostrum cum, repellat sint vitae culpa libero recusandae deserunt quaerat ducimus labore possimus perspiciatis eius itaque ipsam mollitia eos amet maxime repellendus id minima molestiae. Sunt cumque harum, nihil adipisci deleniti libero repellendus. Dolorum consequatur ratione explicabo similique quasi. Aut, ullam rerum ipsa quam dicta mollitia inventore suscipit minus maxime nulla delectus rem unde itaque sunt illo. Illum quisquam, eligendi accusantium fugit consequuntur distinctio delectus quidem sed esse ducimus. Quis officiis repellendus magni debitis. Nihil odio cum aperiam quaerat fugit ducimus suscipit ab tenetur. Quisquam laudantium nulla ea maxime. Earum ab odit maxime iure. Excepturi eos sed magni iste, illum, architecto, voluptatibus nobis iusto obcaecati sequi consectetur consequatur laboriosam. Eaque repellat nihil dolore quidem nam consequuntur explicabo ex. Vero laborum quisquam, delectus nesciunt velit hic officia qui ratione itaque quos laudantium consequuntur, excepturi in quidem dignissimos saepe eligendi veritatis omnis ipsam officiis. Quaerat obcaecati laboriosam esse sequi. Magnam consequuntur, harum numquam obcaecati animi in nihil consectetur quis earum officia? Impedit, rem! Ratione, perspiciatis et, hic iusto unde numquam odit id reprehenderit laudantium quia laboriosam dolores quos dolorum rem labore ut? Itaque quod fuga sunt vel adipisci incidunt qui? Laborum maxime aspernatur voluptatem asperiores, laudantium assumenda explicabo exercitationem corporis quam est suscipit voluptate reprehenderit iure vitae? Eaque ad commodi, fugiat expedita aspernatur illum distinctio tempora cum tempore? Ad possimus quae ratione voluptatum.",
			        type: "long-text",
			        textOptions: {
			          copy: true,
			        },
			      },
			      {
			        key: "more-bio",
			        label: "More bio",
			        value:
			          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde rerum maxime repellat ea numquam provident, iusto iste deleniti magni debitis, laborum excepturi inventore sed. Magni explicabo eligendi beatae labore dignissimos totam dolor voluptates veritatis molestias voluptatum commodi, expedita vel esse et officia distinctio debitis amet perspiciatis, sequi atque blanditiis, repellat quas saepe! A eos deserunt rerum repellat nobis corporis quam et ipsam voluptates totam pariatur modi cumque quibusdam, eius illo maxime. Numquam eos autem illo? Laudantium facilis autem quo nostrum cum, repellat sint vitae culpa libero recusandae deserunt quaerat ducimus labore possimus perspiciatis eius itaque ipsam mollitia eos amet maxime repellendus id minima molestiae. Sunt cumque harum, nihil adipisci deleniti libero repellendus. Dolorum consequatur ratione explicabo similique quasi. Aut, ullam rerum ipsa quam dicta mollitia inventore suscipit minus maxime nulla delectus rem unde itaque sunt illo. Illum quisquam, eligendi accusantium fugit consequuntur distinctio delectus quidem sed esse ducimus. Quis officiis repellendus magni debitis. Nihil odio cum aperiam quaerat fugit ducimus suscipit ab tenetur. Quisquam laudantium nulla ea maxime. Earum ab odit maxime iure. Excepturi eos sed magni iste, illum, architecto, voluptatibus nobis iusto obcaecati sequi consectetur consequatur laboriosam. Eaque repellat nihil dolore quidem nam consequuntur explicabo ex. Vero laborum quisquam, delectus nesciunt velit hic officia qui ratione itaque quos laudantium consequuntur, excepturi in quidem dignissimos saepe eligendi veritatis omnis ipsam officiis. Quaerat obcaecati laboriosam esse sequi. Magnam consequuntur, harum numquam obcaecati animi in nihil consectetur quis earum officia? Impedit, rem! Ratione, perspiciatis et, hic iusto unde numquam odit id reprehenderit laudantium quia laboriosam dolores quos dolorum rem labore ut? Itaque quod fuga sunt vel adipisci incidunt qui? Laborum maxime aspernatur voluptatem asperiores, laudantium assumenda explicabo exercitationem corporis quam est suscipit voluptate reprehenderit iure vitae? Eaque ad commodi, fugiat expedita aspernatur illum distinctio tempora cum tempore? Ad possimus quae ratione voluptatum.",
			        type: "long-text",
			      },
			      {
			        key: "alot-more-bio",
			        label: "Alot more Bio",
			        value:
			          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde rerum maxime repellat ea numquam provident, iusto iste deleniti magni debitis, laborum excepturi inventore sed. Magni explicabo eligendi beatae labore dignissimos totam dolor voluptates veritatis molestias voluptatum commodi, expedita vel esse et officia distinctio debitis amet perspiciatis, sequi atque blanditiis, repellat quas saepe! A eos deserunt rerum repellat nobis corporis quam et ipsam voluptates totam pariatur modi cumque quibusdam, eius illo maxime. Numquam eos autem illo? Laudantium facilis autem quo nostrum cum, repellat sint vitae culpa libero recusandae deserunt quaerat ducimus labore possimus perspiciatis eius itaque ipsam mollitia eos amet maxime repellendus id minima molestiae. Sunt cumque harum, nihil adipisci deleniti libero repellendus. Dolorum consequatur ratione explicabo similique quasi. Aut, ullam rerum ipsa quam dicta mollitia inventore suscipit minus maxime nulla delectus rem unde itaque sunt illo. Illum quisquam, eligendi accusantium fugit consequuntur distinctio delectus quidem sed esse ducimus. Quis officiis repellendus magni debitis. Nihil odio cum aperiam quaerat fugit ducimus suscipit ab tenetur. Quisquam laudantium nulla ea maxime. Earum ab odit maxime iure. Excepturi eos sed magni iste, illum, architecto, voluptatibus nobis iusto obcaecati sequi consectetur consequatur laboriosam. Eaque repellat nihil dolore quidem nam consequuntur explicabo ex. Vero laborum quisquam, delectus nesciunt velit hic officia qui ratione itaque quos laudantium consequuntur, excepturi in quidem dignissimos saepe eligendi veritatis omnis ipsam officiis. Quaerat obcaecati laboriosam esse sequi. Magnam consequuntur, harum numquam obcaecati animi in nihil consectetur quis earum officia? Impedit, rem! Ratione, perspiciatis et, hic iusto unde numquam odit id reprehenderit laudantium quia laboriosam dolores quos dolorum rem labore ut? Itaque quod fuga sunt vel adipisci incidunt qui? Laborum maxime aspernatur voluptatem asperiores, laudantium assumenda explicabo exercitationem corporis quam est suscipit voluptate reprehenderit iure vitae? Eaque ad commodi, fugiat expedita aspernatur illum distinctio tempora cum tempore? Ad possimus quae ratione voluptatum.",
			        type: "long-text",
			        textOptions: {
			          copy: true,
			        },
			      },
			      {
			        key: "website",
			        label: "Website",
			        value: "http://johndoe.com",
			        type: "text",
			        textOptions: {
			          copy: true,
			        },
			      },
			      {
			        key: "values",
			        label: "Values",
			        value: [
			          "Friendly and outgoing",
			          "Enjoys outdoor activities",
			          "Passionate about technology",
			          "Loves trying new cuisines",
			        ],
			        type: "array",
			        arrayOptions: {
			          vertical: true,
			        },
			      },
			    ],
			  },
			];

			buttons.value = [
			  {
			    key: "1",
			    isPresent: true,
			    name: "Button 1",
			    size: "medium",
			    variant: "primary",
			    outline: false,
			    pill: false,
			    icon: {
			      name: "trash",
			      viewBox: "0 0 16 16",
			      path: "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z",
			    },
			  },
			  {
			    key: "2",
			    isPresent: false,
			    name: "Button 2",
			    size: "medium",
			    variant: "warning",
			    outline: true,
			    pill: false,
			  },
			];
			renderComponent.value = true;
			
			document.querySelectorAll("ecc-utils-design-details")
			.forEach((element) => {
				element.addEventListener("button-1-click", (e) => {
					console.log("form-submitted", e.detail);
				});
			});
		});
	});
</script>
<style>
</style>

<style>
</style>
