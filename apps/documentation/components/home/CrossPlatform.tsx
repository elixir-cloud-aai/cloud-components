import Link from 'next/link';

const CrossPlatform = () => {
  return (
    <section className='space-y-8 mt-32' id='cross-platform'>
      <h2 className='text-4xl font-extrabold text-center'>Cross-platform</h2>
      <p className='text-center text-xl text-zinc-600 dark:text-zinc-300 max-w-4xl mx-auto'>
        ECC's are built using web components, making them framework-agnostic. This allows you to
        seamlessly integrate them into your projects, whether you're working with React, Vue,
        vanilla HTML, or any other web development framework.
        <Link href='/docs/usage' className='text-blue-500'> Learn more → </Link>
      </p>
      <div></div>
    </section>
  );
};

export default CrossPlatform;
