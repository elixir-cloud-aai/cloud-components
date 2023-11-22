# Details Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-details&gt;</div>
This component is used to render a detailed view of items.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
<ecc-utils-design-details v-if="renderComponent" :fields="fields"></ecc-utils-design-details>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/details/index.js";
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

| Property            | Required | Default | Type    | Description                  |
| ------------------- | -------- | ------- | ------- | ---------------------------- |
| [`fields`](#fields) | `true`   |         | `Array` | An array of fields to render |

### fields\*

| Property                | Required | Default | Type     | Description                                              |
| ----------------------- | -------- | ------- | -------- | -------------------------------------------------------- |
| `tabGroup`              | `true`   |         | `String` | Tab group in which all the its children will be rendered |
| [`Children`](#children) | `true`   |         | `Array`  | Array of the details to be rendered                      |

### children\*

| Property | Required | Default | Type                           | Description                                  |
| -------- | -------- | ------- | ------------------------------ | -------------------------------------------- |
| `key`    | `true`   |         | `String`                       | The unique key of field                      |
| `label`  | `true`   |         | `String`                       | The label of the information to be rendered. |
| `value`  | `true`   |         | `String` or `Number`           | The info to be rendered                      |
| `type`   | `true`   |         | `text` or `long-text` or `url` | The type of information                      |

## CSS Variables

## Examples

### Styled Collection

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();
const renderComponent = ref(false);
const fields = ref([]);

onMounted(() => {
  import("@elixir-cloud/design/dist/details/index.js").then((module) => {
    renderComponent.value = false;
    fields.value = [
			  {
			    tabGroup: "General Info",
			    children: [
			      { key: "name", label: "Name", value: "John Doe", type: "text" },
			      { key: "age", label: "Age", value: 28, type: "text" },
			      {
			        key: "email",
			        label: "Email",
			        value: "john@example.com",
			        type: "url",
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
			      },
			      {
			        key: "website",
			        label: "Website",
			        value: "http://johndoe.com",
			        type: "url",
			      },
			    ],
			  },
			];

    renderComponent.value = true;
  });
});
</script>

<style>
</style>

<style>
</style>
