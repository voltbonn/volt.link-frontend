import { useState, useCallback } from 'react'

const locales = {
  _: '??',
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

const localesArray = Object.entries(locales)
.map(([code, nativeName]) => ({code, nativeName}))

function LocaleSelect({
  defaultValue,
  onChange,
}) {
  if (
    defaultValue === null
    || defaultValue === undefined
    || defaultValue === ''
    || locales.hasOwnProperty(defaultValue) === false
  ) {
    defaultValue = '_'
  }

  const [changedLocale, setChangedLocale] = useState(defaultValue)

  const handleLocaleChange = useCallback((event) => {
    let newLocale = event.target.value
    setChangedLocale(newLocale)
    
    if (newLocale === '_') {
      newLocale = null
    }

    if (onChange) {
      onChange(newLocale)
    }
  }, [ setChangedLocale, onChange ])
  
  return (
    <div
      className="wrapped_select"
      placeholder={changedLocale === '_' ? locales._ : changedLocale.toUpperCase()}
      style={{
        margin: '0 var(--basis) 0 0',
        flexShrink: 0,
      }}
    >
      <select
        onChange={handleLocaleChange}
        defaultValue={defaultValue}
      >
        {localesArray.map(({ code, nativeName }) => <option key={code} value={code}>{code === '_' ? nativeName : `${code.toUpperCase()} — ${nativeName}`}</option>)}
      </select>
    </div>
  )
}

export default LocaleSelect
