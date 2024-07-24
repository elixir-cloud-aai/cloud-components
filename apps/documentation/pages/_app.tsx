import '@/styles/global.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
import { DefaultSeo } from 'next-seo';
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });


setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.14.0/cdn/');

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <DefaultSeo
        title='Elixir Cloud Component'
        description='GUI for your federated cloud infrastructures.'
      />
      <Component {...pageProps} />
    </main>
  );
}
