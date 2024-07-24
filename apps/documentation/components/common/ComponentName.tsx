function ComponentName({ tagName, reactTagName, version, beta = false }) {
  return (
    <div className='flex flex-wrap gap-2 font-mono text'>
      {beta ? (
        <div className='px-2 py-1 text-xs text-white bg-red-500 rounded-xl'>Beta</div>
      ) : (
        <> </>
      )}
      <div className='px-2 py-1 text-xs text-white bg-sky-500 rounded-xl'>{version}</div>
      <div
        className='flex items-center cursor-copy px-2 py-1 text-xs dark:text-zinc-100 text-zinc-900 bg-zinc-200 dark:bg-zinc-700 rounded-md'
        onClick={() => navigator.clipboard.writeText(tagName)}
      >
        &lt;{tagName}/&gt;
      </div>
      <div
        className='flex items-center cursor-copy px-2 py-1 text-xs dark:text-zinc-100 text-zinc-900 bg-zinc-200 dark:bg-zinc-700 rounded-md'
        onClick={() => navigator.clipboard.writeText(reactTagName)}
      >
        {reactTagName}
      </div>
    </div>
  );
}

export default ComponentName;
