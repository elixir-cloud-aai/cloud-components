'use client';
import { RiArrowRightLine, RiGithubLine } from '@remixicon/react';
import { Link } from 'nextra-theme-docs';

export default function Hero() {
  return (
    <div className='mx-auto static mt-12 md:mt-[6rem] flex flex-col items-center'>
      <div className='flex flex-col items-center w-full md:w-5/6 max-w-6xl'>
        {/* Main Headline */}
        <h1 className='text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-sky-600 to-green-400 via-sky-400 text-transparent bg-clip-text text-center leading-tight'>
          <div className='hidden md:block'>
            <div>Build Federated Cloud</div>
            <div>Applications with Ease</div>
          </div>
          <div className='block md:hidden'>
            Build Federated Cloud Applications with Ease
          </div>
        </h1>
        
        {/* Subtitle */}
        <p className='mt-6 md:mt-8 text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-4xl text-center leading-relaxed'>
          Production-ready components for GA4GH-compliant cloud services. 
          <span className='block mt-2'>
            Framework-agnostic, fully customizable, and built for modern development.
          </span>
        </p>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row gap-4 mt-10 md:mt-12 text-sm md:text-base items-center justify-center'>
          <Link
            href='/docs/introduction'
            className='rounded-xl bg-sky-600 hover:bg-sky-500 !text-white py-2 px-5 transition duration-300 ease-in-out flex items-center gap-2 shadow-lg hover:shadow-xl'
            style={{ textDecoration: 'none' }}
          >
            Get Started
            <RiArrowRightLine className='h-4 w-4' />
          </Link>
          
          <Link
            href='https://github.com/elixir-cloud-aai/cloud-components'
            className='rounded-xl dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-white hover:bg-zinc-50 dark:!text-white !text-zinc-900 py-2 px-5 transition duration-300 ease-in-out flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md'
            style={{ textDecoration: 'none' }}
            target='_blank'
          >
            <RiGithubLine className='h-4 w-4' />
            View on GitHub
          </Link>
        </div>

        {/* Quick stats */}
        <div className='flex flex-wrap gap-6 mt-8 text-sm text-zinc-500 dark:text-zinc-400 items-center justify-center'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span>5+ GA4GH Services</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span>25+ Components</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
            <span>Framework Agnostic</span>
          </div>
        </div>
      </div>
    </div>
  );
}
