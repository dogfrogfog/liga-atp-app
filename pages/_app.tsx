import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import PWALayout from '../layouts/PWALayout'
// import AdminLayout from '../layouts/AdminLayout'
import MainAppLayout from '../layouts/MainAppLayout'
import SecondaryPageLayout from '../layouts/SecondaryPageLayout'

function MyApp({ Component, pageProps, router }: AppProps) {
  // admin
  // if (router.pathname.startsWith('/admin')) {
  //   return (
  //     <PWALayout>
  //       <AdminLayout>
  //         <Component {...pageProps} />
  //       </AdminLayout>
  //     </PWALayout>
  //   )
  // }

  // secondary pages
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
    )
  }

  // with bottom menu
  return (
    <PWALayout>
      <MainAppLayout>
        <Component {...pageProps} />
      </MainAppLayout>
    </PWALayout>
  )
}

export default MyApp
