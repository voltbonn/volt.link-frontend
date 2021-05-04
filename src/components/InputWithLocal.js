import { useState, useCallback, useRef } from 'react'

import ISO6391 from 'iso-639-1'

const locales = ISO6391.getLanguages('en de es fr it nl pt'.split(' '))

function InputWithLocal({ locale, defaultValue, children, style, onChange, ...props }) {
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

  const handleTextChange = useCallback((event) => {
    setChangedValue(event.target.value)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = {
        locale: changedLocale,
        value: event.target.value,
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
    <select
      onChange={handleLocaleChange}
      defaultValue={locale}
      style={{
        margin: '0 var(--basis) 0 0'
      }}
    >
      {locales.map(({ code, nativeName }) => <option key={code} value={code}>{nativeName}</option>) }
    </select>
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
