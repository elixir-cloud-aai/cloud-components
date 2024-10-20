import { useRouter } from 'next/router'
import { DocsThemeConfig } from 'nextra-theme-docs';
import Image from 'next/image';
import { RiSlackFill, RiGithubFill } from '@remixicon/react';

import Footer from './components/common/Footer';

const config: DocsThemeConfig = {
  logo: (
    <div className='flex gap-3 items-center'>
      <Image src='/elixir-cloud/logo.svg' alt='Logo' width={44} height={44} />
      <span className='tracking-wide font-semibold'>ELIXIR Cloud Components</span>
    </div>
  ),
  project: {
    link: 'https://github.com/elixir-cloud-aai/cloud-components/',
    icon: <RiGithubFill />,
  },
  chat: {
    link: 'https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM',
    icon: <RiSlackFill />,
  },
  docsRepositoryBase:
    'https://github.com/elixir-cloud-aai/cloud-components/tree/main/apps/documentation',
  footer: {
    component: <Footer />,
  },
  gitTimestamp: false,
  useNextSeoProps() {
    const { asPath } = useRouter()
    
    return {
      titleTemplate: `${asPath === '/' ? '' : `%s – `}Elixir Cloud Components`,
    };
  },
};

export default config;
