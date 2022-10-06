import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import PWALayout from '../layouts/PWALayout'
import AdminLayout from '../layouts/AdminLayout'
import MainAppLayout from '../layouts/MainAppLayout'

// todo: rework layouts
// admin | bottommenu | arrow back | header top (players view, tournaments view)


function MyApp({ Component, pageProps, router }: AppProps) {
  if (router.pathname.startsWith('/admin')) {
    return (
      <PWALayout>
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      </PWALayout>
    )
  }


  if (
    router.pathname.startsWith('/players/profile/') ||
    router.pathname.startsWith('/tournaments/')
  ) {
    return (
      <PWALayout>
        <Component {...pageProps} />
      </PWALayout>
    )
  }

  return (
    <PWALayout>
      <MainAppLayout>
        <Component {...pageProps} />
      </MainAppLayout>
    </PWALayout>
  )
}

export default MyApp
