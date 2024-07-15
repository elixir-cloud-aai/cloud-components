import Link from 'next/link';

const Card = ({ title, href }) => {
  return (
    <Link
      className='inline px-4 py-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg shadow-md text-zinc-900 dark:text-zinc-100 w-full'
      href={href}
    >
      {title}
    </Link>
  );
};

export default Card;
