import dynamic from 'next/dynamic';
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const SlTag = dynamic(() => import('@shoelace-style/shoelace/dist/react/tag'), {
  ssr: false,
  loading: () => (
    <>
      <SlSkeleton className='w-16 h-8' effect='pulse' />
    </>
  ),
});
const SlCopyButton = dynamic(() => import('@shoelace-style/shoelace/dist/react/copy-button'), {
  ssr: false,
});

function ComponentName({ tagName, reactTagName, version, beta = false }) {
  return (
    <div className='flex flex-wrap gap-2 font-mono text'>
      {beta ? (
        <SlTag pill variant='warning'>
          Beta
        </SlTag>
      ) : (
        <SlTag pill variant='success'>
          Stable
        </SlTag>
      )}
      <SlTag pill variant='neutral'>
        {version}
      </SlTag>
      <SlTag size='medium' pill variant='primary'>
        <code>{tagName}</code>
        <SlCopyButton value={tagName} />
      </SlTag>
      <SlTag size='medium' pill variant='primary'>
        <code>{reactTagName}</code>
        <SlCopyButton value={reactTagName} />
      </SlTag>
    </div>
  );
}

export default ComponentName;
