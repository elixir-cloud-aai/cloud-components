import Image from 'next/image';

function Footer() {
  return (
    <div className='footer flex justify-center items-center p-1 border-2 rounded-md'>
      <div className='container flex flex-col sm:flex-row justify-between px-4'>
        <div className='footer-icons flex justify-center items-center my-2 gap-2'>
          <a href='https://elixir-cloud.dcc.sib.swiss/' target='_blank' rel='noopener noreferrer'>
            <Image
              src='/elixir-cloud/logo.svg'
              alt='Elixir Cloud & AAI'
              className='footer-logo'
              width={75}
              height={75}
            />
          </a>
          <Image
            src='/cloud-sdk/light.svg'
            alt='Cloud SDK'
            className='footer-logo'
            width={75}
            height={75}
          />
          <a href='https://elixir-europe.org/' target='_blank' rel='noopener noreferrer'>
            <Image
              src='/elixir/light.svg'
              alt='Elixir'
              className='footer-logo'
              width={75}
              height={75}
            />
          </a>
        </div>
        <div className='flex flex-col text-gray-500 text-xs sm:text-sm justify-center items-center'>
          <p className='message'>Released under Apache 2.0 License</p>
          <p className='copyright'>Copyright © 2023-{new Date().getFullYear()} Elixir</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
