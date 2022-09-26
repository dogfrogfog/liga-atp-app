// import { NativeBaseProvider } from "native-base"
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <NativeBaseProvider>
      <Component {...pageProps} />
    // </NativeBaseProvider>
  )
}

export default MyApp
