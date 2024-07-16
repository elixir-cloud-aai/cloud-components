import Image from 'next/image';

function Footer() {
  return (
    <div className='flex justify-center items-center p-1 border-t dark:border-zinc-800 border-zinc-200 rounded-md'>
      <div className='container flex flex-col sm:flex-row justify-between px-4 py-4'>
        <div className='flex justify-center items-center my-2 gap-4'>
          <a href='https://elixir-cloud.dcc.sib.swiss/' target='_blank' rel='noopener noreferrer'>
            <Image src='/elixir-cloud/logo.svg' alt='Elixir Cloud & AAI' width={75} height={75} />
          </a>
          <Image
            src='/cloud-sdk/dark.svg'
            alt='Cloud SDK'
            width={75}
            height={75}
            className='dark:block hidden'
          />
          <Image
            src='/cloud-sdk/light.svg'
            alt='Cloud SDK'
            width={75}
            height={75}
            className='block dark:hidden'
          />
          <a href='https://elixir-europe.org/' target='_blank' rel='noopener noreferrer'>
            <Image
              src='/elixir/dark.png'
              alt='Elixir'
              width={75}
              height={75}
              className='dark:block hidden ml-2'
            />
            <Image
              src='/elixir/light.svg'
              alt='Elixir'
              width={95}
              height={95}
              className='block dark:hidden'
            />
          </a>
        </div>
        <div className='flex flex-col text-zinc-500 text-xs sm:text-sm justify-center items-center'>
          <p>Released under Apache 2.0 License.</p>
          <p>Copyright © 2023-{new Date().getFullYear()} ELIXIR</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
