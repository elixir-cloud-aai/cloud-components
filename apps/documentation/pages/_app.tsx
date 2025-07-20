import '@/styles/global.css';
import { DefaultSeo } from 'next-seo';
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });
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
