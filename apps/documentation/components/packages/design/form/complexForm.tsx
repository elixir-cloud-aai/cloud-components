import dynamic from 'next/dynamic';
import { Field } from '@elixir-cloud/design/dist/components/form/form';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const EccUtilDesignForm = dynamic(() => import('@elixir-cloud/design/dist/react/form/index'), {
  ssr: false,
  loading: () => (
    <>
      <div className='form-skeleton flex flex-col gap-2 mt-2'>
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
      </div>
    </>
  ),
});

export default function Form() {
  const fields: Field[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      fieldOptions: {
        required: true,
        tooltip: 'Your name',
      },
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      fieldOptions: {
        tooltip: 'Your email address',
      },
    },
    {
      key: 'address',
      label: 'Address',
      type: 'group',
      groupOptions: {
        collapsible: true,
      },
      fieldOptions: {
        tooltip: 'Group for address',
      },
      arrayOptions: {
        defaultInstances: 1,
        max: 4,
        min: 1,
      },
      children: [
        {
          key: 'Details',
          label: 'Details',
          type: 'array',
          fieldOptions: {
            tooltip: 'Details for address',
          },
          arrayOptions: {
            defaultInstances: 0,
            max: 2,
          },
          children: [
            {
              key: 'houseNumber',
              label: 'House Number',
              type: 'text',
              fieldOptions: {
                required: true,
                tooltip: 'Your house number',
              },
            },
            {
              key: 'street',
              label: 'Street',
              type: 'text',
              fieldOptions: {
                default: '1601 Harrier Ln',
                required: false,
                tooltip: 'Your street name',
              },
            },
            {
              key: 'city',
              label: 'City',
              type: 'text',
              fieldOptions: {
                required: true,
                tooltip: 'Your city name',
              },
            },
            {
              key: 'isPrimary',
              label: 'Primary',
              type: 'switch',
              fieldOptions: {
                default: true,
                tooltip: 'Is this your primary residence?',
              },
            },
          ],
        },
      ],
    },
    {
      key: '18+',
      label: '18+',
      type: 'switch',
      fieldOptions: {
        tooltip: 'Are you over 18 years old?',
      },
    },
    {
      key: 'id',
      label: 'ID',
      type: 'file',
      fieldOptions: {
        required: true,
        tooltip: 'Your ID document',
      },
    },
  ];

  return (
    <div>
      <EccUtilDesignForm fields={fields} />
    </div>
  );
}
