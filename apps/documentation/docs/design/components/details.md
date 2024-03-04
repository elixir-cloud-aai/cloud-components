# Details Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-details&gt;</div>
This component is used to render a detailed view of items.
<ClientOnly>
<div :class="isDark ? 'component-dark component' : 'component-light component'">
<ecc-utils-design-details :v-if="renderComponent" :data="data" :fields="fields" :actions="actions">
</ecc-utils-design-details>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/details/index.js ";

const data = {
	company: {
		name: "TechCorp",
		industry: "Technology",
		employees: [
		{
			id: 101,
			name: "Alice Johnson",
			position: "Software Engineer",
			skills: ["Java", "JavaScript", "SQL"],
			projects: [
			{
				projectId: "P123",
				projectName: "SmartApp",
				startDate: "2022-05-01",
				endDate: "2023-01-15",
				status: "Completed",
				team: ["Alice Johnson", "Bob Smith"],
			},
			{
				projectId: "P124",
				projectName: "DataAnalyzer",
				startDate: "2023-02-01",
				endDate: null,
				status: "In Progress",
				team: ["Alice Johnson", "Charlie Brown"],
			},
			],
			address: {
			street: "123 Tech Street",
			city: "Techville",
			zipCode: "T12345",
			country: "Techland",
			},
		},
		{
			id: 102,
			name: "Bob Smith",
			position: "UI/UX Designer",
			skills: ["UI Design", "CSS", "Adobe XD"],
			projects: [
			{
				projectId: "P123",
				projectName: "SmartApp",
				startDate: "2022-05-01",
				endDate: "2023-01-15",
				status: "Completed",
				team: ["Alice Johnson", "Bob Smith"],
			},
			{
				projectId: "P125",
				projectName: "MobileApp",
				startDate: "2023-03-01",
				endDate: null,
				status: "In Progress",
				team: ["Bob Smith", "Eve White"],
			},
			],
			address: {
			street: "456 Design Avenue",
			city: "DesignCity",
			zipCode: "D67890",
			country: "Designland",
			},
		},
		],
	},
	clients: [
		{
		clientId: "C001",
		clientName: "GlobalTech Solutions",
		contactPerson: "John Johnson",
		email: "john.johnson@globaltech.com",
		projects: ["SmartApp", "DataAnalyzer"],
		},
		{
		clientId: "C002",
		clientName: "DesignMaster Co.",
		contactPerson: "Eva Designer",
		email: "eva.designer@designmaster.com",
		projects: ["MobileApp"],
		},
	],
	financials: {
		revenue: 1500000.5,
		expenses: {
		operating: 500000.25,
		marketing: 200000.75,
		research: 100000.5,
		},
		profit: 696969,
	},
	marketSegments: ["Enterprise", "Startups", "Government"],
	partners: [
		{
		partnerId: "P001",
		partnerName: "InnoTech Innovations",
		contactPerson: "Mark Innovator",
		email: "mark@innotech.com",
		projects: ["SmartApp"],
		},
		{
		partnerId: "P002",
		partnerName: "CreatiDesign Solutions",
		contactPerson: "Lisa Designer",
		email: "lisa@creatidesign.com",
		projects: ["MobileApp"],
		},
	],
	debt: {
		partnerId: "P001",
		partnerName: "InnoTech Innovations",
		contactPerson: "Mark Innovator",
		email: "mark@innotech.com",
		projects: ["SmartApp"],
	},
};

const fields = [
	{
		key: "company.name",
		path: "company.name",
		tab: "Company Info",
	},
	{
		key: "company.industry",
		path: "company.industry",
		tab: "Company Info",
	},
	{
		key: "company.employees",
		path: "company.employees[*]",
		tab: "Employees",
		arrayOptions: {
		labelOptions: {
			path: ".id",
			prefix: "Employee ",
		},
		},
	},
	{
		key: "company.employees.skills",
		parentKey: "company.employees",
		path: "company.employees[*].skills",
		copy: true,
		arrayOptions: {
		type: "tag",
		},
	},
	{
		key: "company.employees.projects.team",
		parentKey: "company.employees",
		path: "company.employees[*].projects[*].team",
		arrayOptions: {
		type: "tag",
		},
	},
	{
		key: "company.employees.projects",
		parentKey: "company.employees",
		path: "company.employees[*].projects[*]",
		arrayOptions: {
		labelOptions: {
			path: ".projectName",
		},
		},
	},
	{
		key: "company.employees.projects",
		parentKey: "company.employees",
		path: "company.employees[0].projects[1]",
		copy: true,
	},
	{
		key: "clients",
		path: "clients[*]",
		tab: "Clients",
		arrayOptions: {
		labelOptions: {
			path: ".clientName",
		},
		},
	},
	{
		key: "clients.projects",
		parentKey: "clients",
		path: "clients[*].projects",
		arrayOptions: {
		type: "tag",
		},
	},
	{
		key: "financials",
		path: "financials.*",
		tab: "Financials",
	},
	{
		key: "financials.expenses",
		parentKey: "financials",
		path: "financials.expenses",
		tooltip: "Different fields of expenses",
	},
	{
		key: "hypothetical",
		path: "hypothetical",
		tab: "Hypothetical",
	},
];

const actions = [
	{
		key: "3",
		label: "View More",
		type: "link",
		linkOptions: {
		url: "https://www.google.com",
		},
		position: "left",
	},
	{
		key: "2",
		label: "Cancel",
		type: "button",
		buttonOptions: {
		variant: "danger",
		},
	},
	{
		key: "1",
		label: "Save",
		type: "button",
		buttonOptions: {
		variant: "primary",
		icon: {
			url: "https://img.icons8.com/ios/50/ffffff/save--v1.png",
		},
		},
	},
];

<ecc-utils-design-details
 .data=${data}
 .fields=${fields}
 .actions=${actions}
 @ecc-utils-button-click=${async (e) => {
  const {key, index} = e.detail;
  e.target.setButtonLoading(index, true);
  await new Promise((resolve) => {
  setTimeout(() => {
   resolve();
   }, 2000);
  });
  e.target.setButtonLoading(index, false);
 }}
/>;
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

## Importing

```js [HTML]
import "@elixir-cloud/design/dist/components/details/index.js";
```

## Properties

| Property              | Required | Default | Type     | Description                               |
| --------------------- | -------- | ------- | -------- | ----------------------------------------- |
| `data`                | `true`   |         | `Object` | Data to be rendered                       |
| [`fields`](#fields)   | `true`   |         | `Array`  | An array of fields to render              |
| [`actions`](#actions) | `false`  |         | `Array`  | An array of buttons and its configuration |

### fields\*

The `fields` property allows you to define an array of fields along with their configuration. Fields can be used to render specific data from the `data` object.

| Property                           | Required | Default  | Type                | Description                                                                                 |
| ---------------------------------- | -------- | -------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `key`                              | `true`   |          | `string`            | A unique identifier for the field, used to distinguish between fields in the configuration. |
| `path`                             | `true`   |          | `string`            | The path to the data to be rendered.                                                        |
| `tab`                              | `false`  |          | `string`            | The tab group to which the field belongs.                                                   |
| `parentKey`                        | `false`  |          | `string`            | The parent key of the field. Recommended if tab is not provided.                            |
| `label`                            | `false`  |          | `string`            | The display name or label for the field.                                                    |
| `tooltip`                          | `false`  |          | `string`            | The tooltip to be displayed on hover.                                                       |
| `copy`                             | `false`  | `false`  | `boolean`           | A flag to indicate if the field should be copied.                                           |
| `arrayOptions.type`                | `false`  | `detail` | `'detail' \| 'tag'` | The type of array to be rendered. Prefer `tag` for smaller values.                          |
| `arrayOptions.labelOptions.path`   | `false`  |          | `string`            | The path in the child object to be used as the label.                                       |
| `arrayOptions.labelOptions.prefix` | `false`  |          | `string`            | The prefix to be added to the label.                                                        |
| `arrayOptions.labelOptions.suffix` | `false`  |          | `string`            | The suffix to be added to the label.                                                        |

### Actions

The `actions` property allows you to define an array of actions along with their configuration. Actions can be used to render buttons or links.

| Property        | Required | Default  | Type             | Description                                                                                   |
| --------------- | -------- | -------- | ---------------- | --------------------------------------------------------------------------------------------- |
| `key`           | `true`   |          | `string`         | A unique identifier for the action, used to distinguish between actions in the configuration. |
| `label`         | `true`   |          | `string`         | The display name or label for the action.                                                     |
| `type`          | `false`  | `button` | `button \| link` | The type of action to be rendered.                                                            |
| `position`      | `false`  | `right`  | `left \| right`  | The position of the action.                                                                   |
| `buttonOptions` | `false`  |          | `Object`         | The configuration for the button. Can be used if `type` is `button`.                          |
| `linkOptions`   | `false`  |          | `Object`         | The configuration for the link. Can be used if `type` is `link`.                              |

#### Button Options

| Property        | Required | Default   | Type                                                         | Description                                                    |
| --------------- | -------- | --------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `variant`       | `false`  | `primary` | `primary \| success \| neutral \| warning \| danger \| text` | The variant of the button.                                     |
| `loading`       | `false`  | `false`   | `boolean`                                                    | A flag to indicate if the button should be in a loading state. |
| `disabled`      | `false`  | `false`   | `boolean`                                                    | A flag to indicate if the button should be disabled.           |
| `size`          | `false`  | `medium`  | `small \| medium \| large`                                   | The size of the button.                                        |
| `icon.url`      | `false`  |           | `string`                                                     | The URL of the icon to be displayed.                           |
| `icon.position` | `false`  | `prefix`  | `prefix \| suffix`                                           | The position of the icon.                                      |

#### Link Options

| Property | Required | Default  | Type                       | Description                 |
| -------- | -------- | -------- | -------------------------- | --------------------------- |
| `url`    | `true`   |          | `string`                   | The URL to be navigated to. |
| `size`   | `false`  | `medium` | `small \| medium \| large` | The size of the link.       |

## Events

The component triggers a custom event, named `ecc-utils-button-click`, upon clicking a button with a specific `key`. This event conveys details about the clicked button, including its `key` and `index`. The app-author is expected to fire the event based on the key provided in the `buttons` prop to the element. This action is intended to activate the corresponding button associated with the specified key.

#### Event Payload

| Property | Type     | Description                                           |
| -------- | -------- | ----------------------------------------------------- |
| `key`    | `string` | The unique identifier of the clicked button.          |
| `index`  | `number` | The index of the button in reference to other buttons |

## Slots

## Parts

## CSS Variables

<script setup>
 import { onMounted, ref } from 'vue';
 import { useData } from 'vitepress';

 const { isDark } = useData();
 const renderComponent = ref(false);
 const fields = ref([]);
 const actions = ref([]);
 const data = ref([]);

 onMounted(() => {
  import('@elixir-cloud/design/dist/components/details/index.js').then((module) => {
   renderComponent.value = false;

   data.value = {
        company: {
          name: "TechCorp",
          industry: "Technology",
          employees: [
            {
              id: 101,
              name: "Alice Johnson",
              position: "Software Engineer",
              skills: ["Java", "JavaScript", "SQL"],
              projects: [
                {
                  projectId: "P123",
                  projectName: "SmartApp",
                  startDate: "2022-05-01",
                  endDate: "2023-01-15",
                  status: "Completed",
                  team: ["Alice Johnson", "Bob Smith"],
                },
                {
                  projectId: "P124",
                  projectName: "DataAnalyzer",
                  startDate: "2023-02-01",
                  endDate: null,
                  status: "In Progress",
                  team: ["Alice Johnson", "Charlie Brown"],
                },
              ],
              address: {
                street: "123 Tech Street",
                city: "Techville",
                zipCode: "T12345",
                country: "Techland",
              },
            },
            {
              id: 102,
              name: "Bob Smith",
              position: "UI/UX Designer",
              skills: ["UI Design", "CSS", "Adobe XD"],
              projects: [
                {
                  projectId: "P123",
                  projectName: "SmartApp",
                  startDate: "2022-05-01",
                  endDate: "2023-01-15",
                  status: "Completed",
                  team: ["Alice Johnson", "Bob Smith"],
                },
                {
                  projectId: "P125",
                  projectName: "MobileApp",
                  startDate: "2023-03-01",
                  endDate: null,
                  status: "In Progress",
                  team: ["Bob Smith", "Eve White"],
                },
              ],
              address: {
                street: "456 Design Avenue",
                city: "DesignCity",
                zipCode: "D67890",
                country: "Designland",
              },
            },
          ],
        },
        clients: [
          {
            clientId: "C001",
            clientName: "GlobalTech Solutions",
            contactPerson: "John Johnson",
            email: "john.johnson@globaltech.com",
            projects: ["SmartApp", "DataAnalyzer"],
          },
          {
            clientId: "C002",
            clientName: "DesignMaster Co.",
            contactPerson: "Eva Designer",
            email: "eva.designer@designmaster.com",
            projects: ["MobileApp"],
          },
        ],
        financials: {
          revenue: 1500000.5,
          expenses: {
            operating: 500000.25,
            marketing: 200000.75,
            research: 100000.5,
          },
          profit: 696969,
        },
        marketSegments: ["Enterprise", "Startups", "Government"],
        partners: [
          {
            partnerId: "P001",
            partnerName: "InnoTech Innovations",
            contactPerson: "Mark Innovator",
            email: "mark@innotech.com",
            projects: ["SmartApp"],
          },
          {
            partnerId: "P002",
            partnerName: "CreatiDesign Solutions",
            contactPerson: "Lisa Designer",
            email: "lisa@creatidesign.com",
            projects: ["MobileApp"],
          },
        ],
        debt: {
          partnerId: "P001",
          partnerName: "InnoTech Innovations",
          contactPerson: "Mark Innovator",
          email: "mark@innotech.com",
          projects: ["SmartApp"],
        },
      };

   fields.value =  [
        {
          key: "company.name",
          path: "company.name",
          tab: "Company Info",
        },
        {
          key: "company.industry",
          path: "company.industry",
          tab: "Company Info",
        },
        {
          key: "company.employees",
          path: "company.employees[*]",
          tab: "Employees",
          arrayOptions: {
            labelOptions: {
              path: ".id",
              prefix: "Employee ",
            },
          },
        },
        {
          key: "company.employees.skills",
          parentKey: "company.employees",
          path: "company.employees[*].skills",
          copy: true,
          arrayOptions: {
            type: "tag",
          },
        },
        {
          key: "company.employees.projects.team",
          parentKey: "company.employees",
          path: "company.employees[*].projects[*].team",
          arrayOptions: {
            type: "tag",
          },
        },
        {
          key: "company.employees.projects",
          parentKey: "company.employees",
          path: "company.employees[*].projects[*]",
          arrayOptions: {
            labelOptions: {
              path: ".projectName",
            },
          },
        },
        {
          key: "company.employees.projects",
          parentKey: "company.employees",
          path: "company.employees[0].projects[1]",
          copy: true,
        },
        {
          key: "clients",
          path: "clients[*]",
          tab: "Clients",
          arrayOptions: {
            labelOptions: {
              path: ".clientName",
            },
          },
        },
        {
          key: "clients.projects",
          parentKey: "clients",
          path: "clients[*].projects",
          arrayOptions: {
            type: "tag",
          },
        },
        {
          key: "financials",
          path: "financials.*",
          tab: "Financials",
        },
        {
          key: "financials.expenses",
          parentKey: "financials",
          path: "financials.expenses",
          tooltip: "Different fields of expenses",
        },
        {
          key: "hypothetical",
          path: "hypothetical",
          tab: "Hypothetical",
        },
      ];

 actions.value = [
        {
          key: "3",
          label: "View More",
          type: "link",
          linkOptions: {
            url: "https://www.google.com",
          },
          position: "left",
        },
        {
          key: "2",
          label: "Cancel",
          type: "button",
          buttonOptions: {
            variant: "danger",
          },
        },
        {
          key: "1",
          label: "Save",
          type: "button",
          buttonOptions: {
            variant: "primary",
            icon: {
              url: "https://img.icons8.com/ios/50/ffffff/save--v1.png",
            },
          },
        },
      ];

   renderComponent.value = true;

   document.querySelectorAll("ecc-utils-design-details")
   .forEach((element) => {
    element.addEventListener("ecc-utils-button-click", async (e) => {
          const { index, key } = e.detail;
          if(key === '1'){
            console.log('button 1 clicked', e.detail);
            e.target.setButtonLoading(index, true);
  
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
  
            e.target.setButtonLoading(index, false);
            }
          else {
            console.log('button 2 clicked', e.detail);
            e.target.setButtonLoading(index, true);
  
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
  
            e.target.setButtonLoading(index, false);
          }
    });
   });
  });
 });
</script>
