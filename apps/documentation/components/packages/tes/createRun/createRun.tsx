import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const EccClientGa4ghTesCreateRun = dynamic(
  () => import('@elixir-cloud/tes/dist/react/create-run/index'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col gap-4'>
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
        <SlSkeleton className='h-8' />
      </div>
    ),
  },
);

function createRun() {
  return (
    <div>
      <EccClientGa4ghTesCreateRun />
    </div>
  );
}

export default createRun;
