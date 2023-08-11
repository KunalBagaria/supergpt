import { Toaster } from 'react-hot-toast';
import '@/styles/globals.scss';
import type {
  AppProps
} from 'next/app'
import { NextUIProvider } from '@nextui-org/react';
import { Wallet } from '@/components/wallet';
import { UserProvider } from '@/components/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Toaster position='top-right' />
      <Wallet>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Wallet>
    </NextUIProvider>
  );
};