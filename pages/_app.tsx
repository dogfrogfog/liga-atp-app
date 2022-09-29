// import { NativeBaseProvider } from "native-base"
import type { AppProps } from 'next/app'
import '../styles/globals.css'

import PWALayout from '../layouts/PWALayout'
import AdminLayout from '../layouts/AdminLayout'

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

  return (
    <PWALayout>
      <Component {...pageProps} />
    </PWALayout>
  )
}

export default MyApp
