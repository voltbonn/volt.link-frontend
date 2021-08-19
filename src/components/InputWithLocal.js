import { useState, useCallback, useRef } from 'react'

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
  // pl: 'Język polski', // Polish
  ru: 'русский язык', // Russian
  // bg: 'български език', // Bulgarian
  tr: 'Türkçe',
  ar: 'اَلْعَرَبِيَّة', // Arabic
  // el: 'ελληνικά', // Greek
  // ro: 'limba română', // Romanian
  // sl: 'slovenščina', // Slovenian
  // uk: 'украї́нська мо́ва', // Ukrainian
  // cy: 'Cymraeg', // Welsh
}
locales = Object.entries(locales)
.map(([code, nativeName]) => ({code, nativeName}))

function InputWithLocal({ reorderHandle, locale, defaultValue, children, style, onChange, ...props }) {
  const wrapperDiv = useRef(null)

  const [changedLocale, setChangedLocale] = useState(locale)
  const [changedValue, setChangedValue] = useState(defaultValue)

  const handleLocaleChange = useCallback((event) => {
    setChangedLocale(event.target.value)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = {
        locale: event.target.value,
        value: changedValue,
      }
      onChange({ target })
    }
  }, [setChangedLocale, onChange, changedValue])

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
      const target = wrapperDiv.current
      target.value = {
        locale: changedLocale,
        value,
      }
      onChange({ target })
    }
  }, [setChangedValue, onChange, changedLocale])

  return <div
    ref={wrapperDiv}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '100%',
      ...style
    }}
    {...props}
  >
    <div
      class="wrapped_select"
      placeholder={changedLocale.toUpperCase()}
      style={{
        margin: '0 var(--basis) 0 0',
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
  </div>
}

export default InputWithLocal
