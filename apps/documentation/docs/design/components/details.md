# Details Component <Badge type="warning" text="beta" />

<div class="component-name">&lt;ecc-utils-design-details&gt;</div>
This component is used to render a detailed view of items.
<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
<ecc-utils-design-details :v-if="renderComponent" :data="data" :fields="fields" :buttons="buttons">
<p slot="footer">26 Nov 2023</p>
</ecc-utils-design-details>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/details/index.js";
			const data = {
				company: {
					name: 'TechCorp',
					industry: 'Technology',
					employees: [
						{
							id: 101,
							name: 'Alice Johnson',
							position: 'Software Engineer',
							skills: ['Java', 'JavaScript', 'SQL'],
							projects: [
								{
									projectId: 'P123',
									projectName: 'SmartApp',
									startDate: '2022-05-01',
									endDate: '2023-01-15',
									status: 'Completed',
									team: ['Alice Johnson', 'Bob Smith'],
								},
								{
									projectId: 'P124',
									projectName: 'DataAnalyzer',
									startDate: '2023-02-01',
									endDate: null,
									status: 'In Progress',
									team: ['Alice Johnson', 'Charlie Brown'],
								},
							],
							address: {
								street: '123 Tech Street',
								city: 'Techville',
								zipCode: 'T12345',
								country: 'Techland',
							},
						},
						{
							id: 102,
							name: 'Bob Smith',
							position: 'UI/UX Designer',
							skills: ['UI Design', 'CSS', 'Adobe XD'],
							projects: [
								{
									projectId: 'P123',
									projectName: 'SmartApp',
									startDate: '2022-05-01',
									endDate: '2023-01-15',
									status: 'Completed',
									team: ['Alice Johnson', 'Bob Smith'],
								},
								{
									projectId: 'P125',
									projectName: 'MobileApp',
									startDate: '2023-03-01',
									endDate: null,
									status: 'In Progress',
									team: ['Bob Smith', 'Eve White'],
								},
							],
							address: {
								street: '456 Design Avenue',
								city: 'DesignCity',
								zipCode: 'D67890',
								country: 'Designland',
							},
						},
					],
				},
				clients: [
					{
						clientId: 'C001',
						clientName: 'GlobalTech Solutions',
						contactPerson: 'John Johnson',
						email: 'john.johnson@globaltech.com',
						projects: ['SmartApp', 'DataAnalyzer'],
					},
					{
						clientId: 'C002',
						clientName: 'DesignMaster Co.',
						contactPerson: 'Eva Designer',
						email: 'eva.designer@designmaster.com',
						projects: ['MobileApp'],
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
				marketSegments: ['Enterprise', 'Startups', 'Government'],
				partners: [
					{
						partnerId: 'P001',
						partnerName: 'InnoTech Innovations',
						contactPerson: 'Mark Innovator',
						email: 'mark@innotech.com',
						projects: ['SmartApp'],
					},
					{
						partnerId: 'P002',
						partnerName: 'CreatiDesign Solutions',
						contactPerson: 'Lisa Designer',
						email: 'lisa@creatidesign.com',
						projects: ['MobileApp'],
					},
				],
				debt: {
					partnerId: 'P001',
					partnerName: 'InnoTech Innovations',
					contactPerson: 'Mark Innovator',
					email: 'mark@innotech.com',
					projects: ['SmartApp'],
				},
			};

			const fields = [
				{
					tabGroup: 'Company Info',
					children: [{ path: 'company.name' }, { path: 'company.industry' }],
				},
				{
					tabGroup: 'Employees',
					children: [{ path: 'company.employees', copy: true }],
				},
				{
					tabGroup: 'Clients',
					children: [{ path: 'clients' }],
				},
				{
					tabGroup: 'Market Segments',
					children: [
						{ path: 'financials.revenue' },
						{ path: 'financials.expenses.operating' },
						{ path: 'financials.expenses.marketing' },
						{ path: 'financials.expenses.research' },
						{ path: 'financials.profit' },
						{ path: 'marketSegments', copy: true },
						{ path: 'debt' },
					],
				},
				{
					tabGroup: 'Partners',
					children: [{ path: 'partners' }],
				},
			];

			const buttons = [
				{
					key: '1',
					isPresent: true,
					name: 'Button 1',
					size: 'medium',
					variant: 'primary',
					outline: false,
					pill: false,
					icon: {
						name: 'trash',
						viewBox: '0 0 16 16',
						path: 'M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z',
					},
				},
				{
					key: '2',
					isPresent: false,
					name: 'Button 2',
					size: 'medium',
					variant: 'warning',
					outline: true,
					pill: false,
				},
			];

<ecc-utils-design-details
  .data=${data}
  .fields=${fields}
  .buttons={buttons}
  @ecc-utils-button-click=${async (e) => {
    const { index } = e.detail;
    e.target.setButtonLoading(index, true);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    e.target.setButtonLoading(index, false);
  }}
>
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
import "@elixir-cloud/design/dist/components/details/index.js";
```

## Properties

| Property              | Required | Default | Type     | Description                               |
| --------------------- | -------- | ------- | -------- | ----------------------------------------- |
| `data`                | `true`   |         | `Object` | Data to be rendered                       |
| [`fields`](#fields)   | `true`   |         | `Array`  | An array of fields to render              |
| [`buttons`](#buttons) | `false`  |         | `Array`  | An array of buttons and its configuration |

### fields\*

| Property                | Required | Default | Type     | Description                                              |
| ----------------------- | -------- | ------- | -------- | -------------------------------------------------------- |
| `tabGroup`              | `true`   |         | `string` | Tab group in which all the its children will be rendered |
| [`Children`](#children) | `true`   |         | `Array`  | Array of the details to be rendered                      |

### children\*

| Property       | Required | Default               | Type      | Description                                                 |
| -------------- | -------- | --------------------- | --------- | ----------------------------------------------------------- |
| `label`        | `false`  | Last part of the path | `string`  | Label of the child data                                     |
| `path`         | `true`   |                       | `string`  | Path of the child data to be rendered                       |
| `copy`         | `false`  | `false`               | `boolean` | Defines if the child data should have a copy button         |
| `defaultValue` | `false`  |                       | `any`     | Default value if child data is `null` at the specified path |

### Buttons

The `buttons` property allows you to define an array of buttons along with their configuration. Buttons can be used to trigger specific actions or events within the component.

| Property  | Required | Default     | Type                                                           | Description                                                                                   |
| --------- | -------- | ----------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `key`     | `true`   |             | `string`                                                       | A unique identifier for the button, used to distinguish between buttons in the configuration. |
| `name`    | `true`   |             | `string`                                                       | The display name or label for the button.                                                     |
| `size`    | `false`  | `'medium'`  | `'small' \| 'meduim' \| 'large'`                               | The size of the button.                                                                       |
| `variant` | `false`  | `'primary'` | `'primary' \| 'success' \| 'neutral' \| 'warning' \| 'danger'` | The visual style or color variant of the button.                                              |
| `outline` | `false`  | `false`     | `boolean`                                                      | Specifies whether the button should have an outlined style.                                   |
| `pill`    | `false`  | `false`     | `boolean`                                                      | Specifies whether the button should have a pill-shaped style.                                 |
| `icon`    | `false`  |             | `object`                                                       | Configuration object for an optional icon associated with the button.                         |

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

The component emits a custom event named `ecc-utils-button-click` when a button is clicked. The event provides information about the clicked button, such as its key and name.

#### Event Payload

| Property | Type     | Description                                           |
| -------- | -------- | ----------------------------------------------------- |
| `key`    | `string` | The unique identifier of the clicked button.          |
| `index`  | `number` | The index of the button in reference to other buttons |
| `event`  | `Event`  | The event emitted.                                    |

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
	const data = ref([]);

	onMounted(() => {
		import('@elixir-cloud/design/dist/details/index.js').then((module) => {
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
			    profit: null,
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
				  partnerId: 'P001',
				  partnerName: 'InnoTech Innovations',
				  contactPerson: 'Mark Innovator',
				  email: 'mark@innotech.com',
				  projects: ['SmartApp'],
			  },
			};

			fields.value = [
				{
					tabGroup: 'Company Info',
					children: [{ path: 'company.name' }, { path: 'company.industry' }, { path: 'company.employees', copy: true }],
				},
				{
					tabGroup: 'Employees',
					children: [{ path: 'company.employees', copy: true }],
				},
				{
					tabGroup: 'Clients',
					children: [{ path: 'clients' }],
				},
				{
					tabGroup: 'Market Segments',
					children: [
						{ path: 'financials.revenue' },
						{ path: 'financials.expenses.operating' },
						{ path: 'financials.expenses.marketing' },
						{ path: 'financials.expenses.research' },
						{ path: 'financials.profit' },
						{ path: 'marketSegments', copy: true },
						{ path: 'debt' },
					],
				},
				{
					tabGroup: 'Partners',
					children: [{ path: 'partners' }],
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
				element.addEventListener("ecc-utils-button-click", async (e) => {
          const { index, key } = e.detail;
					console.log('button clicked', e.detail);
          e.target.setButtonLoading(index, true);

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000);
          });

          e.target.setButtonLoading(index, false);
				});
			});
		});
	});
</script>
<style>
</style>

<style>
</style>
