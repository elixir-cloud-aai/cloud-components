import Image from 'next/image';
import Link from 'next/link';

function Hero() {
  return (
    <div className='flex justify-between pb-16'>
      <div>
        <div className='flex flex-col flex-start max-w-4xl mx-auto text-center'>
          <h1 className='text-start text-[2rem] sm:text-[3rem] font-bold bg-gradient-to-r from-[#3692d6] to-[#32a8f2] inline-block text-transparent bg-clip-text'>
            <span className='text-[3rem]'>ELIXIR Cloud</span>
            <br />
            Components
          </h1>
          <p className='text text-start text-gray-500'>
            A suite of highly reusable Web Components to operationalize ELIXIR and GA4GH Cloud
            Services.
          </p>
          <Link
            href='/design/introduction'
            className='btn btn-primary mt-4 w-fit rounded-full bg-[#3692d6] hover:bg-[#32a8f2] text-white font-bold py-2 px-6 shadow-md transition duration-300 ease-in-out'
          >
            <button>Get Started</button>
          </Link>
        </div>
      </div>
      <div className='flex flex-start items-start'>
        <Image
          className='hidden sm:block'
          src='/elixir-cloud/logo.svg'
          width={200}
          height={200}
          alt='Logo'
        />
      </div>
    </div>
  );
}

export default Hero;
