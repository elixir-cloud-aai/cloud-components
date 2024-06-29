import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const EccUtilsDesignCode = dynamic(() => import('@elixir-cloud/design/dist/react/code/index'), {
  ssr: false,
  loading: () => (
    <>
      <SlSkeleton className='h-20' effect='pulse' />,
    </>
  ),
});

export default function Code() {
  return (
    <div>
      <EccUtilsDesignCode language='json' />
    </div>
  );
}
