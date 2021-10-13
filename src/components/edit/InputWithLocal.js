import { useState, useCallback } from 'react'

import classes from './InputWithLocal.module.css'

let locales = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands', // Dutch
  da: 'Dansk', // Danish
  sv: 'Svenska', // Swedish
  nb: 'Norsk bokmål', // Norwegian
  fi: 'Suomi', // Finish
  mt: 'Malti', // Maltese
  pl: 'Język polski', // Polish
  ru: 'русский язык', // Russian
  bg: 'български език', // Bulgarian
  tr: 'Türkçe',
  ar: 'اَلْعَرَبِيَّة', // Arabic
  el: 'ελληνικά', // Greek
  ro: 'limba română', // Romanian
  sl: 'slovenščina', // Slovenian
  // uk: 'украї́нська мо́ва', // Ukrainian
  // cy: 'Cymraeg', // Welsh
}
locales = Object.entries(locales)
.map(([code, nativeName]) => ({code, nativeName}))

function InputWithLocal({ reorderHandle, actionButton, locale, defaultValue, children, style, onChange, className, dataset = {}, ...props }) {
  const [changedLocale, setChangedLocale] = useState(locale)
  const [changedValue, setChangedValue] = useState(defaultValue)

  const handleLocaleChange = useCallback((event) => {
    setChangedLocale(event.target.value)
    if (onChange) {
      onChange({
        value: {
          locale: event.target.value,
          value: changedValue,
        },
        dataset,
      })
    }
  }, [setChangedLocale, onChange, changedValue, dataset])

  const handleTextChange = useCallback((event_or_value) => {
    let value = event_or_value
    if (
      !!event_or_value
      && !!event_or_value.target
      && !!event_or_value.target.value
    ) {
      value = event_or_value.target.value
    }

    setChangedValue(value)
    if (onChange) {
      onChange({
        value: {
          locale: changedLocale,
          value,
        },
        dataset,
      })
    }
  }, [setChangedValue, onChange, changedLocale, dataset])

  return <div
    className={classes.input_with_local+' '+className}
    style={style}
  >
    {
      !!children
        ? children({
          onChange: handleTextChange,
          defaultValue: defaultValue,
          style: {
            flexGrow: '1',
          }
        })
        : null
    }
    <div
      className="wrapped_select"
      placeholder={changedLocale.toUpperCase()}
      style={{
        margin: '0 calc(-1 * var(--basis)) 0 var(--basis)',
        flexShrink: 0,
      }}
    >
      <select
        onChange={handleLocaleChange}
        defaultValue={locale}
      >
        {locales.map(({ code, nativeName }) => <option key={code} value={code}>{nativeName}</option>)}
      </select>
    </div>
  </div>
}

export default InputWithLocal
