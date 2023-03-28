import { SWRConfig } from 'swr';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withPasswordProtect } from 'next-password-protect';
import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import PWALayout from '../layouts/PWALayout';
import AdminLayout from '../layouts/AdminLayout';
import MainAppLayout from '../layouts/MainAppLayout';
import SecondaryPageLayout from '../layouts/SecondaryPageLayout';


function MyApp({ Component, pageProps, router }: AppProps) {
  const { events } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading((v) => !v);
    };

    events.on('routeChangeStart', handleRouteChange);
    events.on('routeChangeComplete', handleRouteChange);

    return () => {
      events.off('routeChangeStart', handleRouteChange);
      events.off('routeChangeComplete', handleRouteChange);
    };
  }, [events]);

  if (router.pathname.startsWith('/admin')) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  if (
    router.pathname.startsWith('/players/') ||
    router.pathname.startsWith('/tournaments/') ||
    router.pathname.startsWith('/digests/') ||
    router.pathname.startsWith('/h2h/compare') ||
    router.pathname.startsWith('/other/')
  ) {
    return (
      <PWALayout>
        <SecondaryPageLayout loading={loading}>
          <Component {...pageProps} />
        </SecondaryPageLayout>
      </PWALayout>
    );
  }

  // with bottom menu
  return (
    <PWALayout>
      <MainAppLayout loading={loading}>
        <Component {...pageProps} />
      </MainAppLayout>
    </PWALayout>
  );
}

// @ts-ignore
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

const SWRMyApp = (props: AppProps) => (
  <SWRConfig
    value={{
      fetcher,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times.
        if (retryCount >= 3) return;
      },
      // to prevent same requests occur multiple times
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }}
  >
    <MyApp {...props} />
  </SWRConfig>
);

// todo: add only for /admin route
// https://github.com/instantcommerce/next-password-protect
// Step 3
export default withPasswordProtect(SWRMyApp, {
  bypassProtection: ({ route }) => {
    return !route.startsWith('/admin');
  },
  loginApiUrl: '/api/login',
  loginComponentProps: {
    backUrl: 'https://github.com/instantcommerce/next-password-protect',
    logo: 'https://avatars.githubusercontent.com/u/93975473',
  },
});
