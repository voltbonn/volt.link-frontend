import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

// import App from './pages/App.js'
// import reportWebVitals from './reportWebVitals'
import { router } from './router.js';
import {
  RouterProvider,
} from 'react-router-dom'

import 'intl-pluralrules'
// import { AppLocalizationProvider, locales } from './fluent/l10n.js'
// import { TranslatedInputProvider } from './components/edit/TranslatedInput.js'

import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

window.process = {} // BUGFIX for CRA4 error-page after hot-reloading.

window.env = 'dev' // dev / prod
window.domains = {
  frontend: 'https://volt.link/',
  backend: 'https://api.volt.link/',
  storage: 'https://storage.volt.link/',
}
if (window.env === 'dev') {
  window.domains.frontend = 'http://localhost:4003/'
  window.domains.backend = 'http://localhost:4004/'
  window.domains.storage = 'http://localhost:4006/'
}

window.graphql_uri = window.domains.backend + 'graphql/v1/'

const client = new ApolloClient({
  uri: window.graphql_uri,
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

// send pageviews to Umami when the url changes
window.addEventListener('popstate', () => {
  if (window.umami) {
    window.umami.trackView(window.location.pathname + window.location.search + window.location.hash);
  }
});

function Start() {
  // const [userLocales, setUserLocales] = useState(navigator.languages)
  // const [currentLocale, setCurrentLocale] = useState(null)

  /*
  useEffect(() => {
    // get saved locale from localStorage
    const savedLocale = window.localStorage.getItem('locale') || null
    if (typeof savedLocale === 'string' && savedLocale !== '') {
      setUserLocales([savedLocale])
    } else {
      setUserLocales(navigator.languages)
    }
  }, [setUserLocales])

  useEffect(() => {
    if (!!window.umami) {
      let systemLocales = navigator.languages
      if (!!systemLocales || Array.isArray(systemLocales)) {
        for (let locale of systemLocales) {
          locale = locale.toLowerCase() // Not really correct but the system locales sadly don't conform to the standard.

          const language = locale.split('-')[0]
          if (typeof language === 'string' && language !== '') {
            window.umami.trackEvent('L: ' + language) // Log just the language.
          }
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

  useEffect(() => {
    const change_locale = event => {
      const detail = event.detail || {}
      const newLocale = detail.locale || null

      if (newLocale === null) {
        if (!!userLocales && Array.isArray(userLocales) && userLocales.length > 0) { // check that userLocales is not an empty array
          setUserLocales(navigator.languages)
          window.localStorage.removeItem('locale')
        }
      } else {
        setUserLocales([newLocale])
        window.localStorage.setItem('locale', newLocale)
      }
    }

    window.addEventListener('change_locale', change_locale)
    return () => {
      window.removeEventListener('change_locale', change_locale)
    }
  }, [userLocales, setUserLocales])
  */


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        components: {
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: 'inherit',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontFamily: "'Ubuntu', 'Noto Kufi Arabic', 'Geeza Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                // fontWeight: 'bold',
              },
            },
          },
        },
      }),
    [prefersDarkMode],
  )

  return <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <RouterProvider
        router={router}
        fallbackElement="Loading…"
      />
    </ThemeProvider>
  </ApolloProvider>

  // return <AppLocalizationProvider
  //   key="AppLocalizationProvider"
  //   userLocales={userLocales}
  //   onLocaleChange={handleCurrentLocalesChange}
  // >
  //   <ApolloProvider client={client}>
  //     <ThemeProvider theme={theme}>
  //       <RouterProvider
  //         router={router}
  //         fallbackElement="Loading…"
  //       />
  //         {/* <App locales={locales} currentLocale={currentLocale} onLanguageChange={handleLanguageChange} /> */}
  //     </ThemeProvider>
  //   </ApolloProvider>
  // </AppLocalizationProvider>
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Start />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
