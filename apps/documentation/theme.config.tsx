import { DocsThemeConfig } from 'nextra-theme-docs';
import Image from 'next/image';
import { FaSlack, FaGithub } from 'react-icons/fa';
import Footer from './components/layout/footer';

const config: DocsThemeConfig = {
  logo: (
    <>
      <Image src='/elixir-cloud/logo.svg' alt='Logo' width={50} height={50} />
      <span className='bg-red-400'>Elixir Cloud Components</span>
    </>
  ),
  project: {
    link: 'https://github.com/elixir-cloud-aai/cloud-components/',
    icon: <FaGithub size={25} />,
  },
  chat: {
    link: 'https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM',
    icon: <FaSlack size={25} />,
  },
  docsRepositoryBase: 'https://github.com/elixir-cloud-aai/cloud-components',
  footer: {
    component: <Footer />,
  },
};

export default config;
