import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './pages/App.js'
// import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'

import 'intl-pluralrules'
import { AppLocalizationProvider, locales } from './fluent/l10n.js'

function AppLanguageWrapper() {
  // const [userLocales, setUserLocales] = useState(['de'])
  const [userLocales, setUserLocales] = useState(navigator.languages)
  const [currentLocale, setCurrentLocale] = useState(null)

  useEffect(() => {
    if (!!window.umami) {
      let systemLocales = navigator.languages
      if (!!systemLocales || Array.isArray(systemLocales)) {
        for (let locale of systemLocales) {
          locale = locale.toLowerCase() // Not really correct but the system locales sadly don't conform to the standard.

          window.umami.trackEvent('L: ' + locale.split('-')[0]) // Log just the language.
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

  return <AppLocalizationProvider
    key="AppLocalizationProvider"
    userLocales={userLocales}
    onLocaleChange={handleCurrentLocalesChange}
  >
    <App locales={locales} currentLocale={currentLocale} onLanguageChange={handleLanguageChange} />
  </AppLocalizationProvider>
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppLanguageWrapper />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
