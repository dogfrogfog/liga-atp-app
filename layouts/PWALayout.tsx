import Head from 'next/head';
import type { ReactNode } from 'react';

function PWALayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Liga Tennisa | Liga</title>
        <meta name="description" content="Liga Tennisa | Liga" />
        <meta name="application-name" content="Liga Tennisa | Liga" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Liga" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" /> 
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" /> 
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> 
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" /> 
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> 
        <link rel="manifest" href="/manifest.json" /> 
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" /> 
        <link rel="shortcut icon" href="/favicon.ico" /> 
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </Head>
      {children}
    </>
  );
}

export default PWALayout;
