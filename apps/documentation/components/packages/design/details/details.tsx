/* cSpell:disable */
import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const EccUtilsDesignDetails = dynamic(
  () => import('@elixir-cloud/design/dist/react/ecc-d-details/index'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col gap-4'>
        <SlSkeleton effect='pulse' className='h-10' />
        <SlSkeleton effect='pulse' className='h-20' />
        <div className='flex gap-2 justify-end'>
          <SlSkeleton effect='pulse' className='h-10 w-20' />
          <SlSkeleton effect='pulse' className='h-10 w-20' />
        </div>
      </div>
    ),
  },
);

const EccUtilsDesignDataItem = dynamic(
  () => import('@elixir-cloud/design/dist/react/ecc-d-data-item/index'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col gap-4'>
        <SlSkeleton effect='pulse' className='h-10' />
        <SlSkeleton effect='pulse' className='h-20' />
        <div className='flex gap-2 justify-end'>
          <SlSkeleton effect='pulse' className='h-10 w-20' />
          <SlSkeleton effect='pulse' className='h-10 w-20' />
        </div>
      </div>
    ),
  },
);

export default function Details() {
  const employees = [
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
          copy: true,
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
  ];

  const clients = [
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
  ];

  const financials = {
    revenue: 1500000.5,
    expenses: {
      operating: 500000.25,
      marketing: 200000.75,
      research: 100000.5,
    },
    profit: 696969,
  };

  const saveIcon = '<img src="https://img.icons8.com/ios/50/ffffff/save--v1.png"/>';

  return (
    <div>
      <EccUtilsDesignDetails>
        <EccUtilsDesignDataItem
          type='tab'
          tabs={['Company Info', 'Employees', 'Clients', 'Financials']}
        >
          <div slot='Company Info'>
            <EccUtilsDesignDataItem copy tooltip='Company Name' label='name' value='TechCorp' />
            <EccUtilsDesignDataItem label='industry' value='Technology' />
          </div>

          <div slot='Employees'>
            {employees.map((e) => (
              <EccUtilsDesignDataItem copy label={`Employee${e.id}`} type='detail'>
                {Object.keys(e).map(
                  (key) =>
                    key !== 'address' &&
                    key !== 'projects' && (
                      <EccUtilsDesignDataItem
                        label={key}
                        type={key === 'skills' ? 'list' : null}
                        value={e[key]}
                      />
                    ),
                )}
                <EccUtilsDesignDataItem type='detail' label='Projects'>
                  {e.projects.map((p) => (
                    <EccUtilsDesignDataItem copy={p.copy} label={p.projectName} type='detail'>
                      {Object.keys(p).map((pKey) => (
                        <EccUtilsDesignDataItem
                          label={pKey}
                          type={pKey === 'team' ? 'list' : null}
                          value={p[pKey]}
                        />
                      ))}
                    </EccUtilsDesignDataItem>
                  ))}
                </EccUtilsDesignDataItem>
                <EccUtilsDesignDataItem type='detail' label='Address'>
                  {Object.keys(e.address).map((aKey) => (
                    <EccUtilsDesignDataItem label={aKey} value={e.address[aKey]} />
                  ))}
                </EccUtilsDesignDataItem>
              </EccUtilsDesignDataItem>
            ))}
          </div>

          <div slot='Clients'>
            {clients.map((c) => (
              <EccUtilsDesignDataItem type='detail' tooltip='client name' label={c.clientName}>
                {Object.keys(c).map((cKey) => (
                  <EccUtilsDesignDataItem
                    type={cKey === 'projects' ? 'list' : null}
                    label={cKey}
                    value={c[cKey]}
                  />
                ))}
              </EccUtilsDesignDataItem>
            ))}
          </div>

          <div slot='Financials'>
            {Object.keys(financials).map((fKey) =>
              fKey === 'expenses' ? (
                <EccUtilsDesignDataItem type='detail' label={fKey}>
                  {Object.keys(financials[fKey]).map((k) => (
                    <EccUtilsDesignDataItem label={k} value={financials[fKey][k]} />
                  ))}
                </EccUtilsDesignDataItem>
              ) : (
                <EccUtilsDesignDataItem slot='Financials' label={fKey} value={financials[fKey]} />
              ),
            )}
          </div>
        </EccUtilsDesignDataItem>

        <a href='https://www.google.com' ecc-type='action' ecc-position='left'>
          text
        </a>
        <button ecc-type='action' className='ecc-action-button ecc-danger'>
          Cancel
        </button>

        <button
          ecc-type='action'
          ecc-position='right'
          className='ecc-action-button ecc-primary'
          ecc-end-icon={saveIcon}
        >
          Save
        </button>
      </EccUtilsDesignDetails>
    </div>
  );
}
