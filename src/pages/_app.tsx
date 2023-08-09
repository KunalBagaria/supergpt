import '@/styles/globals.scss';
import type {
  AppProps
} from 'next/app'
import { NextUIProvider } from '@nextui-org/react';
import { Wallet } from '@/components/wallet';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Wallet>
        <Component {...pageProps} />
      </Wallet>
    </NextUIProvider>
  );
};