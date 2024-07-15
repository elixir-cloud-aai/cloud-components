'use client';
import { RiArrowRightLine } from '@remixicon/react';
import { Link } from 'nextra-theme-docs';

export default function Hero() {
  return (
    <div className='w-full md:w-5/6 mx-auto relative h-96 md:h-[32rem] flex items-center justify-center'>
      <div className='flex flex-col items-center'>
        <h1 className='text-4xl md:text-7xl font-extrabold bg-gradient-to-r from-sky-600 to-green-400 via-sky-400 text-transparent bg-clip-text text-center flex flex-col items-center gap-4'>
          <div>The Component Library</div>
          <div>for Federated Cloud Services</div>
        </h1>
        <p className='mt-8 text-lg md:text-xl text-zinc-500 max-w-7xl text-center'>
          Modular, composable, and customizable components for interacting with cloud
          infrastructure.
        </p>
        <div className='flex gap-4 mt-12 text-sm md:text-base'>
          <Link
            href='/docs/introduction'
            className='rounded-xl bg-sky-600 hover:bg-sky-500 !text-white py-2 px-6 transition duration-300 ease-in-out flex items-center gap-1'
            style={{ textDecoration: 'none' }}
          >
            Get started
            <RiArrowRightLine className='inline-block h-4' />
          </Link>
          <Link
            href='/docs/installation'
            className='rounded-xl dark:bg-zinc-600 dark:hover:bg-zinc-500 bg-zinc-300 hover:bg-zinc-200 dark:!text-white !text-zinc-900 py-2 px-6 transition duration-300 ease-in-out flex items-center justify-center'
            style={{ textDecoration: 'none' }}
          >
            Install
          </Link>
          <div className='p-0.5 bg-gradient-to-r from-sky-600 to-green-400 via-sky-400 rounded-xl flex items-center justify-center'>
            <Link
              href='/docs/customization'
              className='rounded-xl dark:bg-zinc-600 dark:hover:bg-zinc-500 bg-zinc-300 hover:bg-zinc-200 dark:!text-white !text-zinc-900 py-2 px-6 transition duration-300 ease-in-out w-full'
              style={{ textDecoration: 'none' }}
            >
              Make your own?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}