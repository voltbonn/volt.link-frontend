import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import snackbarClasses from './Snackbar.module.css'

import App from './pages/App.js'
// import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'

import 'intl-pluralrules'
import { AppLocalizationProvider, locales } from './fluent/l10n.js'
// import { TranslatedInputProvider } from './components/edit/TranslatedInput.js'

import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { SnackbarProvider } from 'notistack'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

window.process = {} // BUGFIX for CRA4 error-page after hot-reloading.

window.domains = {
  // frontend: 'http://localhost:3000/',
  backend: 'https://api.volt.link/',
  // backend: 'http://localhost:4004/',
  frontend: 'https://beta.volt.link/',
}

const client = new ApolloClient({
  uri: window.domains.backend+'graphql/v1/',
  cache: new InMemoryCache(),
  credentials: 'include',
  defaultOptions: {
    watchQuery: {
      // fetchPolicy: 'cache-and-network',
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

// client
//   .query({
//     query: gql`
//       query GetRates {
//         rates(currency: "USD") {
//           currency
//         }
//       }
//     `
//   })
//   .then(result => console.info(result));

function Start() {
  // const [userLocales, setUserLocales] = useState(['de'])
  const [userLocales, setUserLocales] = useState(navigator.languages)
  const [currentLocale, setCurrentLocale] = useState(null)

  useEffect(() => {
    if (!!window.umami) {
      let systemLocales = navigator.languages
      if (!!systemLocales || Array.isArray(systemLocales)) {
        for (let locale of systemLocales) {
          locale = locale.toLowerCase() // Not really correct but the system locales sadly don't conform to the standard.

          const language = locale.split('-')[0]
          if (language !== locale) {
            window.umami.trackEvent('L: ' + language) // Log just the language.
          }
          window.umami.trackEvent('L: ' + locale) // Log the full locale.
        }
      }
    }
  }, [])

  const handleLanguageChange = useCallback(event => {
    setUserLocales([event.target.dataset.locale])
  }, [setUserLocales])

  const handleCurrentLocalesChange = useCallback(currentLocales => {
    setCurrentLocale(currentLocales.length > 0 ? currentLocales[0] : '')
  }, [setCurrentLocale])


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )

  return <>
  <div
    id="react-notification"
    key="react-notification"
    style={{zIndex: '10000'}}
  ></div>

  <AppLocalizationProvider
    key="AppLocalizationProvider"
    userLocales={userLocales}
    onLocaleChange={handleCurrentLocalesChange}
  >
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          style={{ minWidth: 'unset' }}
          classes={{
            variantSuccess: `${snackbarClasses.snackbar} ${snackbarClasses.success}`,
            variantError: `${snackbarClasses.snackbar} ${snackbarClasses.error}`,
            variantWarning: `${snackbarClasses.snackbar} ${snackbarClasses.warning}`,
            variantInfo: `${snackbarClasses.snackbar} ${snackbarClasses.info}`,
          }}
          domRoot={document.getElementById('react-notification')}
        >
          {/* <TranslatedInputProvider> */}
            <Router>
              <App locales={locales} currentLocale={currentLocale} onLanguageChange={handleLanguageChange} />
            </Router>
          {/* </TranslatedInputProvider> */}
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  </AppLocalizationProvider>
  </>
}

ReactDOM.render(<Start />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
