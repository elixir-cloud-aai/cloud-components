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
      </div>
    </>
  ),
});

export default function Form() {
  const fields: Field[] = [
    {
      key: 'service-name',
      label: 'Service name',
      type: 'text',
      fieldOptions: {
        required: true,
      },
    },
  ];

  return (
    <div>
      <EccUtilDesignForm fields={fields} />
    </div>
  );
}
