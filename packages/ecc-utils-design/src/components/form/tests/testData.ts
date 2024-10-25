import { Field } from "../form.js";

export const simpleTestData: Field[] = [
  {
    key: "name",
    label: "Name",
  },
];

export const selectFieldTestData: Field[] = [
  {
    key: "gender",
    label: "Gender",
    type: "select",
    fieldOptions: {
      required: true,
    },
    selectOptions: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Non-binary", value: "non-binary" },
      { label: "other", value: "other" },
      { label: "Prefer not to say", value: "none" },
    ],
  },
];

export const arrayTestData: Field[] = [
  {
    key: "otherNames",
    label: "Other Names",
    type: "array",
    arrayOptions: { defaultInstances: 2, max: 3 },
    children: [
      {
        key: "name",
        label: "Name",
        type: "text",
        fieldOptions: { required: true, tooltip: "Your other name" },
      },
      {
        key: "18+",
        label: "18+",
        type: "switch",
        fieldOptions: { required: true, tooltip: "switch" },
      },
      {
        key: "passportPicture",
        label: "Passport Picture",
        type: "file",
        fieldOptions: { required: false, tooltip: "your passport" },
      },
    ],
  },
];

export const groupTestData: Field[] = [
  {
    key: "addresses",
    label: "Addresses",
    type: "group",
    groupOptions: {
      collapsible: true,
    },
    fieldOptions: {
      tooltip: "Your Addresses",
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

export const submitTestData: Field[] = [
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
    key: "age",
    label: "Age",
    type: "text",
    fieldOptions: {
      required: true,
      tooltip: "Your age",
    },
  },
  {
    key: "isMarried",
    label: "Married",
    type: "switch",
    fieldOptions: {
      default: false,
      tooltip: "Are you married?",
    },
  },
  {
    key: "address",
    label: "Address",
    type: "group",
    groupOptions: {
      collapsible: true,
    },
    fieldOptions: {
      tooltip: "Your Address",
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
        key: "phoneNumbers",
        label: "Phone Numbers",
        type: "array",
        arrayOptions: { defaultInstances: 2 },
        children: [
          {
            key: "phoneNumber",
            label: "Phone Number",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your phone number",
            },
          },
        ],
      },
      {
        key: "emails",
        label: "Emails",
        type: "array",
        arrayOptions: { defaultInstances: 0 },
        children: [
          {
            key: "email",
            label: "Email",
            type: "text",
            fieldOptions: {
              required: true,
              tooltip: "Your email address",
            },
          },
        ],
      },
    ],
  },
  {
    key: "bankAccounts",
    label: "Bank Accounts",
    type: "array",
    arrayOptions: { defaultInstances: 2 },
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
        type: "text",
        fieldOptions: {
          tooltip: "The account Balance",
          returnIfEmpty: true,
        },
      },
      {
        key: "isPrimary",
        label: "Primary",
        type: "switch",
        fieldOptions: {
          default: false,
          tooltip: "Is this your primary bank account?",
        },
      },
    ],
  },
];

export const fieldOptionsTestData: Field[] = [
  {
    key: "participants",
    label: "Participants",
    type: "array",
    fieldOptions: {
      tooltip: "test tooltip",
    },
    arrayOptions: {
      defaultInstances: 1,
    },
    children: [
      {
        key: "name",
        label: "Name",
        fieldOptions: {
          default: "John Doe",
          tooltip: "test tooltip",
        },
      },
      {
        key: "id",
        label: "ID",
        type: "file",
        fieldOptions: {
          tooltip: "test tooltip",
        },
      },
      {
        key: "isMarried",
        label: "Married",
        type: "switch",
        fieldOptions: {
          default: true,
          tooltip: "test tooltip",
        },
      },
      {
        key: "address",
        label: "Address",
        type: "group",
        fieldOptions: {
          tooltip: "test tooltip",
        },
        children: [
          {
            key: "street",
            label: "Street",
            fieldOptions: {
              tooltip: "test tooltip",
            },
          },
        ],
      },
    ],
  },
];

export const requiredFieldsTestData: Field[] = [
  {
    key: "name",
    label: "Name",
    fieldOptions: {
      required: true,
    },
  },
  {
    key: "age",
    label: "Age",
    type: "number",
    fieldOptions: {
      required: true,
    },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
  },
];

export const testDataForFileOptions: Field[] = [
  {
    key: "id",
    label: "ID",
    type: "file",
    fieldOptions: {
      accept: ".pdf .doc .docx",
    },
  },
  {
    key: "vactionPhotos",
    label: "Vaction Photos",
    type: "file",
    fieldOptions: {
      multiple: true,
      accept: "image/*",
    },
  },
  {
    key: "passport",
    label: "Passport",
    type: "file",
    fieldOptions: {
      multiple: false,
    },
  },
];
