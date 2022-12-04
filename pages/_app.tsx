import type { AppProps } from 'next/app';
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
  if (router.pathname.startsWith('/admin')) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  // secondary pages with top circle back button <-
  if (
    router.pathname.startsWith('/players/') ||
    router.pathname.startsWith('/tournaments/')
  ) {
    return (
      <PWALayout>
        <SecondaryPageLayout>
          <Component {...pageProps} />
        </SecondaryPageLayout>
      </PWALayout>
    );
  }

  // to show user once
  // todo: add inavailable (WIP) routs here;
  if (router.pathname === '/' || router.pathname === '/preview') {
    return (
      <PWALayout>
        <Component {...pageProps} />
      </PWALayout>
    );
  }

  // with bottom menu
  return (
    <PWALayout>
      <MainAppLayout>
        <Component {...pageProps} />
      </MainAppLayout>
    </PWALayout>
  );
}

export default MyApp;
