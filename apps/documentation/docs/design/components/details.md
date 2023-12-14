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
import "@elixir - cloud / design / dist / components / details / index.js ";

const data = {
	company: {
		name: 'TechCorp',
		industry: 'Technology',
		employees: [{
				id: 101,
				name: 'Alice Johnson',
				position: 'Software Engineer',
				skills: ['Java', 'JavaScript', 'SQL'],
				projects: [{
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
				projects: [{
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
	clients: [{
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
	partners: [{
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

const fields = [{
		tabGroup: 'Company Info',
		children: [{
			path: 'company.name'
		}, {
			path: 'company.industry'
		}],
	},
	{
		tabGroup: 'Employees',
		children: [{
			path: 'company.employees',
			copy: true
		}],
	},
	{
		tabGroup: 'Clients',
		children: [{
			path: 'clients'
		}],
	},
	{
		tabGroup: 'Market Segments',
		children: [{
				path: 'financials.revenue'
			},
			{
				path: 'financials.expenses.operating'
			},
			{
				path: 'financials.expenses.marketing'
			},
			{
				path: 'financials.expenses.research'
			},
			{
				path: 'financials.profit'
			},
			{
				path: 'marketSegments',
				copy: true
			},
			{
				path: 'debt'
			},
		],
	},
	{
		tabGroup: 'Partners',
		children: [{
			path: 'partners'
		}],
	},
];

const buttons = [{
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

### Methods

## Methods

| Method Name          | Arguments                                 | Description                                                      |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `setButtonLoading()` | {`index`: `number`, `loading`: `boolean`} | Sets the state of button with given index to given loading state |

## Parts

| Part Name           | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `data-container`    | Container for simple data ie {string, string}, {string, number} etc. |
| `label`             | Label for each data render.                                          |
| `container`         | Container for Array, Object and simple data render.                  |
| `summary-container` | Container for list-view or uncollapsed view with label and icon.     |
| `panel-container`   | Container for uncollapsed view.                                      |
| `footer-container`  | Container for footer which container buttons and slot.               |
| `footer-buttons`    | Container for footer buttons.                                        |
| `footer-slot`       | Container for footer slot.                                           |

## CSS Variables

## Examples

### Styled Details

<ClientOnly>
  <div :class="isDark ? 'component-dark component' : 'component-light component'">
  <!-- Render ecc-utils-design-form component only after the component is loaded -->
	<ecc-utils-design-details 
		class="styled-details-example"
		:v-if="renderComponent" 
		:data="styledData" 
		:fields="styledFields" 
		:buttons="styledButtons"
	>
		<p slot="footer">26 Nov 2023</p>
	</ecc-utils-design-details>

::: details Code Blocks
::: code-group

```js [HTML]
import "@elixir-cloud/design/dist/components/details/index.js ";

const buttons = [{
	key: "1",
	isPresent: true,
	name: "Button 1",
	size: "medium",
	variant: "primary",
	outline: true,
	pill: true,
	icon: {
		name: "smile",
		viewBox: "0 0 16 16",
		path: "M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434m6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434",
	},
}];

const data = {
	fruitCompany: {
		companyName: "FruitTech",
		industry: "Agriculture",
		employees: [{
				id: 201,
				name: "Anna Appleton",
				position: "Horticulturist",
				skills: ["Botany", "Fruit Cultivation", "Organic Farming"],
				projects: [{
						projectId: "F201",
						projectName: "JuicyHarvest",
						startDate: "2022-06-01",
						endDate: "2023-02-15",
						status: "Completed",
						team: ["Anna Appleton", "Ben Banana"],
					},
					{
						projectId: "F202",
						projectName: "TropicalDelight",
						startDate: "2023-03-01",
						endDate: null,
						status: "In Progress",
						team: ["Anna Appleton", "Charlie Cherry"],
					},
				],
				address: {
					street: "789 Orchard Lane",
					city: "Fruitville",
					zipCode: "F56789",
					country: "Fruitland",
				},
			},
			{
				id: 202,
				name: "Ben Banana",
				position: "Fruit Quality Specialist",
				skills: ["Quality Control", "Ripening Techniques", "Supply Chain"],
				projects: [{
						projectId: "F201",
						projectName: "JuicyHarvest",
						startDate: "2022-06-01",
						endDate: "2023-02-15",
						status: "Completed",
						team: ["Anna Appleton", "Ben Banana"],
					},
					{
						projectId: "F203",
						projectName: "CitrusFiesta",
						startDate: "2023-04-01",
						endDate: null,
						status: "In Progress",
						team: ["Ben Banana", "Eve Grape"],
					},
				],
				address: {
					street: "456 Grove Street",
					city: "FruitCity",
					zipCode: "F23456",
					country: "Fruitland",
				},
			},
		],
	},
	fruitClients: [{
			clientId: "FC001",
			clientName: "GlobalFruit Traders",
			contactPerson: "John Mango",
			email: "john.mango@globalfruit.com",
			projects: ["JuicyHarvest", "TropicalDelight"],
		},
		{
			clientId: "FC002",
			clientName: "CitrusBlend Co.",
			contactPerson: "Eva Citrus",
			email: "eva.citrus@citrusblend.com",
			projects: ["CitrusFiesta"],
		},
	],
	fruitFinancials: {
		revenue: 1200000.75,
		expenses: {
			farming: 400000.25,
			marketing: 150000.5,
			research: 80000.75,
		},
		profit: null,
	},
	fruitMarketSegments: ["Retail", "Export", "Local Markets"],
	fruitPartners: [{
			partnerId: "FP001",
			partnerName: "AgroInnovate Solutions",
			contactPerson: "Mark Innovator",
			email: "mark@agroinnovate.com",
			projects: ["JuicyHarvest"],
		},
		{
			partnerId: "FP002",
			partnerName: "FruitDesign Dynamics",
			contactPerson: "Lisa Designer",
			email: "lisa@fruitdesign.com",
			projects: ["CitrusFiesta"],
		},
	],
	fruitDebt: {
		partnerId: 'FP001',
		partnerName: 'AgroInnovate Solutions',
		contactPerson: 'Mark Innovator',
		email: 'mark@agroinnovate.com',
		projects: ['JuicyHarvest'],
	},
};

const fields = [{
		tabGroup: 'Company Info',
		children: [{
			path: 'fruitCompany.companyName'
		}, {
			path: 'fruitCompany.industry'
		}, {
			path: 'fruitCompany.employees',
			copy: true
		}],
	},
	{
		tabGroup: 'Employees',
		children: [{
			path: 'fruitCompany.employees',
			copy: true
		}],
	},
	{
		tabGroup: 'Clients',
		children: [{
			path: 'fruitClients'
		}],
	},
	{
		tabGroup: 'Market Segments',
		children: [{
				path: 'fruitFinancials.revenue'
			},
			{
				path: 'fruitFinancials.expenses.farming'
			},
			{
				path: 'fruitFinancials.expenses.marketing'
			},
			{
				path: 'fruitFinancials.expenses.research'
			},
			{
				path: 'fruitFinancials.profit'
			},
			{
				path: 'fruitMarketSegments',
				copy: true
			},
			{
				path: 'fruitDebt'
			},
		],
	},
	{
		tabGroup: 'Partners',
		children: [{
			path: 'fruitPartners'
		}],
	},
];

<ecc-utils-design-details
	class="styled-details-example"
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

```css [CSS]
/* Styling for data-container part */
.styled-details-example::part(data-container) {
  background-color: #ffd700; /* Gold background */
  padding: var(--sl-spacing-small);
  margin-bottom: var(--sl-spacing-medium);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

/* Styling for label part */
.styled-details-example::part(label) {
  font-weight: var(--sl-font-weight-semibold);
  font-style: italic;
  color: #ff6347; /* Tomato color */
}

/* Styling for container part */
.styled-details-example::part(container) {
  border: 2px solid #4169e1; /* Royal blue border */
  padding: var(--sl-spacing-medium);
  border-radius: 8px;
}

/* Styling for summary-container part */
.styled-details-example::part(summary-container) {
  background-color: #90ee90; /* Light green background */
  width: 100%;
  margin-bottom: 3px;
  padding: var(--sl-spacing-small);
  border-radius: 8px;
}

/* Styling for panel-container part */
.styled-details-example::part(panel-container) {
  height: calc(4 * var(--sl-spacing-4x-large));
  border-radius: 8px;
}

/* Styling for footer-container part */
.styled-details-example::part(footer-container) {
  background-color: #ff8c00; /* Dark orange background */
  padding: 2px;
  border-radius: 10px;
}

/* Styling for footer-buttons part */
.styled-details-example::part(footer-buttons) {
  display: flex;
  gap: var(--sl-spacing-small);
}

/* Styling for footer-slot part */
.styled-details-example::part(footer-slot) {
  color: #fff; /* White text color */
}
```

  <!-- ```jsx [React]

  ``` -->

:::

  </div>
</ClientOnly>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useData } from 'vitepress';

	const { isDark } = useData();
	const renderComponent = ref(false);
	const fields = ref([]);
	const buttons = ref([]);
	const data = ref([]);
	const styledFields = ref([]);
	const styledData = ref([]);
	const styledButtons = ref([]);

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

			styledButtons.value = [{
				key: "1",
				isPresent: true,
				name: "Button 1",
				size: "medium",
				variant: "primary",
				outline: true,
				pill: true,
				icon: {
					name: "smile",
					viewBox: "0 0 16 16",
					path: "M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434m6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434",
				},
			}];

			styledData.value = {
				fruitCompany: {
					companyName: "FruitTech",
					industry: "Agriculture",
					employees: [{
							id: 201,
							name: "Anna Appleton",
							position: "Horticulturist",
							skills: ["Botany", "Fruit Cultivation", "Organic Farming"],
							projects: [{
									projectId: "F201",
									projectName: "JuicyHarvest",
									startDate: "2022-06-01",
									endDate: "2023-02-15",
									status: "Completed",
									team: ["Anna Appleton", "Ben Banana"],
								},
								{
									projectId: "F202",
									projectName: "TropicalDelight",
									startDate: "2023-03-01",
									endDate: null,
									status: "In Progress",
									team: ["Anna Appleton", "Charlie Cherry"],
								},
							],
							address: {
								street: "789 Orchard Lane",
								city: "Fruitville",
								zipCode: "F56789",
								country: "Fruitland",
							},
						},
						{
							id: 202,
							name: "Ben Banana",
							position: "Fruit Quality Specialist",
							skills: ["Quality Control", "Ripening Techniques", "Supply Chain"],
							projects: [{
									projectId: "F201",
									projectName: "JuicyHarvest",
									startDate: "2022-06-01",
									endDate: "2023-02-15",
									status: "Completed",
									team: ["Anna Appleton", "Ben Banana"],
								},
								{
									projectId: "F203",
									projectName: "CitrusFiesta",
									startDate: "2023-04-01",
									endDate: null,
									status: "In Progress",
									team: ["Ben Banana", "Eve Grape"],
								},
							],
							address: {
								street: "456 Grove Street",
								city: "FruitCity",
								zipCode: "F23456",
								country: "Fruitland",
							},
						},
					],
				},
				fruitClients: [{
						clientId: "FC001",
						clientName: "GlobalFruit Traders",
						contactPerson: "John Mango",
						email: "john.mango@globalfruit.com",
						projects: ["JuicyHarvest", "TropicalDelight"],
					},
					{
						clientId: "FC002",
						clientName: "CitrusBlend Co.",
						contactPerson: "Eva Citrus",
						email: "eva.citrus@citrusblend.com",
						projects: ["CitrusFiesta"],
					},
				],
				fruitFinancials: {
					revenue: 1200000.75,
					expenses: {
						farming: 400000.25,
						marketing: 150000.5,
						research: 80000.75,
					},
					profit: null,
				},
				fruitMarketSegments: ["Retail", "Export", "Local Markets"],
				fruitPartners: [{
						partnerId: "FP001",
						partnerName: "AgroInnovate Solutions",
						contactPerson: "Mark Innovator",
						email: "mark@agroinnovate.com",
						projects: ["JuicyHarvest"],
					},
					{
						partnerId: "FP002",
						partnerName: "FruitDesign Dynamics",
						contactPerson: "Lisa Designer",
						email: "lisa@fruitdesign.com",
						projects: ["CitrusFiesta"],
					},
				],
				fruitDebt: {
					partnerId: 'FP001',
					partnerName: 'AgroInnovate Solutions',
					contactPerson: 'Mark Innovator',
					email: 'mark@agroinnovate.com',
					projects: ['JuicyHarvest'],
				},
			};

			styledFields.value = [{
					tabGroup: 'Company Info',
					children: [{
						path: 'fruitCompany.companyName'
					}, {
						path: 'fruitCompany.industry'
					}, {
						path: 'fruitCompany.employees',
						copy: true
					}],
				},
				{
					tabGroup: 'Employees',
					children: [{
						path: 'fruitCompany.employees',
						copy: true
					}],
				},
				{
					tabGroup: 'Clients',
					children: [{
						path: 'fruitClients'
					}],
				},
				{
					tabGroup: 'Market Segments',
					children: [{
							path: 'fruitFinancials.revenue'
						},
						{
							path: 'fruitFinancials.expenses.farming'
						},
						{
							path: 'fruitFinancials.expenses.marketing'
						},
						{
							path: 'fruitFinancials.expenses.research'
						},
						{
							path: 'fruitFinancials.profit'
						},
						{
							path: 'fruitMarketSegments',
							copy: true
						},
						{
							path: 'fruitDebt'
						},
					],
				},
				{
					tabGroup: 'Partners',
					children: [{
						path: 'fruitPartners'
					}],
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
/* Styling for data-container part */
.styled-details-example::part(data-container) {
  background-color: #ffd700; /* Gold background */
  padding: var(--sl-spacing-small);
  margin-bottom: var(--sl-spacing-medium);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

/* Styling for label part */
.styled-details-example::part(label) {
  font-weight: var(--sl-font-weight-semibold);
  font-style: italic;
  color: #ff6347; /* Tomato color */
}

/* Styling for container part */
.styled-details-example::part(container) {
  border: 2px solid #4169e1; /* Royal blue border */
  padding: var(--sl-spacing-medium);
  border-radius: 8px;
}

/* Styling for summary-container part */
.styled-details-example::part(summary-container) {
  background-color: #90ee90; /* Light green background */
  width: 100%;
  margin-bottom: 3px;
  padding: var(--sl-spacing-small);
  border-radius: 8px;
}

/* Styling for panel-container part */
.styled-details-example::part(panel-container) {
  height: calc(4 * var(--sl-spacing-4x-large));
  border-radius: 8px;
}

/* Styling for footer-container part */
.styled-details-example::part(footer-container) {
  background-color: #ff8c00; /* Dark orange background */
  padding: 2px;
  border-radius: 10px;
}

/* Styling for footer-buttons part */
.styled-details-example::part(footer-buttons) {
  display: flex;
  gap: var(--sl-spacing-small);
}

/* Styling for footer-slot part */
.styled-details-example::part(footer-slot) {
  color: #fff; /* White text color */
}
</style>
