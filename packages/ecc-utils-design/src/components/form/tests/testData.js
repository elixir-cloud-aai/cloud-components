export const arrayTestData = [
  {
    key: "addresses",
    label: "Addresses",
    type: "array",
    fieldOptions: { tooltip: "Your Addresses" },
    arrayOptions: { defaultInstances: 0, max: 2 },
    children: [
      {
        key: "houseNumber",
        label: "House Number",
        type: "text",
        fieldOptions: { required: true, tooltip: "Your house number" },
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
        fieldOptions: { required: true, tooltip: "Your city name" },
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

  {
    key: "bankAccounts",
    label: "Bank Accounts",
    type: "array",
    arrayOptions: { defaultInstances: 2, max: 4, min: 1 },
    children: [
      {
        key: "bankName",
        label: "Bank Name",
        type: "text",
        fieldOptions: { required: true, tooltip: "your bank name" },
      },
      {
        key: "branchCode",
        label: "Branch Code",
        type: "text",
        fieldOptions: {
          required: true,
        },
      },
      {
        key: "accountNumber",
        label: "Account Number",
        type: "text",
        fieldOptions: {
          required: true,
          tooltip: "Your bank account number",
        },
      },
      {
        key: "beneficiaryName",
        label: "Beneficiary Name",
        fieldOptions: {
          required: true,
          tooltip: "the name on the account",
        },
      },
      {
        key: "accountBalance",
        label: "Account Balance",
        type: "number",
        fieldOptions: {
          required: true,
          tooltip: "The account Balance",
        },
      },
      {
        key: "isPrimary",
        label: "Primary",
        type: "switch",
        fieldOptions: {
          default: true,
          tooltip: "Is this your primary bank account?",
        },
      },
      {
        key: "id",
        label: "ID",
        type: "file",
        fieldOptions: {
          tooltip: "Upload a copy of your ID",
        },
      },
    ],
  },
];

export const simpleArrayTestData = [
  {
    key: "otherNames",
    label: "Other Names",
    type: "array",
    arrayOptions: { defaultInstances: 1, max: 3 },
    children: [
      {
        key: "name",
        label: "Name",
        type: "text",
        fieldOptions: { required: true, tooltip: "Your other name" },
      },
    ],
  },
];

export const groupTestData = [
  {
    key: "addresses",
    label: "Addresses",
    type: "group",
    groupOptions: {
      collapsible: true,
      tooltip: "Your addresses",
    },
    children: [
      {
        key: "houseNumber",
        label: "House Number",
        type: "text",
        fieldOptions: { required: true, tooltip: "Your house number" },
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
        fieldOptions: { required: true, tooltip: "Your city name" },
      },
      {
        key: "utilityBill",
        label: "Utility Bill",
        type: "file",
        fieldOptions: {
          required: true,
          tooltip: "Upload a copy of your utility bill",
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
];
