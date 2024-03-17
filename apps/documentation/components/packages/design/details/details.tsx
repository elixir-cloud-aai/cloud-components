import dynamic from 'next/dynamic';
import { Action, Field } from '@elixir-cloud/design/dist/components/details/details';

const EccUtilsDesignDetails = dynamic(
  () => import('@elixir-cloud/design/dist/react/details/index'),
  {
    ssr: false,
  },
);

export default function Details() {
  const data: unknown = {
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

  const fields: Field[] = [
    {
      key: 'company.name',
      path: 'company.name',
      tab: 'Company Info',
    },
    {
      key: 'company.industry',
      path: 'company.industry',
      tab: 'Company Info',
    },
    {
      key: 'company.employees',
      path: 'company.employees[*]',
      tab: 'Employees',
      arrayOptions: {
        labelOptions: {
          path: '.id',
          prefix: 'Employee ',
        },
      },
    },
    {
      key: 'company.employees.skills',
      parentKey: 'company.employees',
      path: 'company.employees[*].skills',
      copy: true,
      arrayOptions: {
        type: 'tag',
      },
    },
    {
      key: 'company.employees.projects.team',
      parentKey: 'company.employees',
      path: 'company.employees[*].projects[*].team',
      arrayOptions: {
        type: 'tag',
      },
    },
    {
      key: 'company.employees.projects',
      parentKey: 'company.employees',
      path: 'company.employees[*].projects[*]',
      arrayOptions: {
        labelOptions: {
          path: '.projectName',
        },
      },
    },
    {
      key: 'company.employees.projects',
      parentKey: 'company.employees',
      path: 'company.employees[0].projects[1]',
      copy: true,
    },
    {
      key: 'clients',
      path: 'clients[*]',
      tab: 'Clients',
      arrayOptions: {
        labelOptions: {
          path: '.clientName',
        },
      },
    },
    {
      key: 'clients.projects',
      parentKey: 'clients',
      path: 'clients[*].projects',
      arrayOptions: {
        type: 'tag',
      },
    },
    {
      key: 'financials',
      path: 'financials.*',
      tab: 'Financials',
    },
    {
      key: 'financials.expenses',
      parentKey: 'financials',
      path: 'financials.expenses',
      tooltip: 'Different fields of expenses',
    },
    {
      key: 'hypothetical',
      path: 'hypothetical',
      tab: 'Hypothetical',
    },
  ];

  const actions: Action[] = [
    {
      key: '3',
      label: 'View More',
      type: 'link',
      linkOptions: {
        url: 'https://www.google.com',
      },
      position: 'left',
    },
    {
      key: '2',
      label: 'Cancel',
      type: 'button',
      buttonOptions: {
        variant: 'danger',
      },
    },
    {
      key: '1',
      label: 'Save',
      type: 'button',
      buttonOptions: {
        variant: 'primary',
        icon: {
          url: 'https://img.icons8.com/ios/50/ffffff/save--v1.png',
        },
      },
    },
  ];
  return (
    <div>
      <EccUtilsDesignDetails data={data} fields={fields} actions={actions} />
    </div>
  );
}
