import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const ECCClientGa4ghTesRuns = dynamic(() => import('@elixir-cloud/lit-tes/dist/react/runs/index'), {
  ssr: false,
  loading: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-end'>
        <SlSkeleton effect='pulse' className='h-10 w-24 flex-row-reverse' />
      </div>
      <SlSkeleton effect='pulse' className='h-10' />
      <SlSkeleton effect='pulse' className='h-10' />
      <SlSkeleton effect='pulse' className='h-10' />
      <SlSkeleton effect='pulse' className='h-10' />
      <SlSkeleton effect='pulse' className='h-10' />
      <div className='flex justify-center'>
        <SlSkeleton effect='pulse' className='h-10 w-16' />
      </div>
    </div>
  ),
});

export default function Runs() {
  return (
    <div>
      <ECCClientGa4ghTesRuns />
    </div>
  );
}
