import { AppProvider, useAppContext } from '@context/app/AppContext'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import MuiTheme from '@theme/MuiTheme'
import Head from 'next/head'
import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React, { Fragment, useEffect } from 'react'
import FirebaseWrapper from '../src/components/FirebaseWrapper'
import {InitializeFirebase} from '../src/components/Firebase-auth'

export const cache = createCache({ key: 'css', prepend: true })

//Binding events.
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())
InitializeFirebase();

nProgress.configure({ showSpinner: false })

const App = ({ Component, pageProps }: any) => {
  const Layout = Component.layout || Fragment

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={cache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <AppProvider>
        <FirebaseWrapper>
          <MuiTheme>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MuiTheme>
        </FirebaseWrapper>
      </AppProvider>
    </CacheProvider>
  )
}




// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default App
