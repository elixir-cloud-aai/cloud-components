import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const ECCClientGa4ghWesCreateRun = dynamic(
  () => import('@elixir-cloud/wes/dist/react/create-run/index'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col gap-6'>
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
        <SlSkeleton className='h-8' effect='pulse' />
      </div>
    ),
  },
);

export default function () {
  return (
    <div>
      <ECCClientGa4ghWesCreateRun />
    </div>
  );
}
