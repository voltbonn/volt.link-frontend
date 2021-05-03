import { useState, useCallback } from 'react'

function InputWithLocal({ locale, defaultValue, children, style, className, onChange }) {
  const [changedLocale, setChangedLocale] = useState(locale)
  const [changedValue, setChangedValue] = useState(defaultValue)

  const handleLocaleChange = useCallback((event) => {
    setChangedLocale(event.target.value)
    if (onChange) {
      onChange({
        locale: event.target.value,
        value: changedValue,
      })
    }
  }, [setChangedLocale, onChange, changedValue])

  const handleTextChange = useCallback((event) => {
    setChangedValue(event.target.value)
    if (onChange) {
      onChange({
        locale: changedLocale,
        value: event.target.value,
      })
    }
  }, [setChangedValue, onChange, changedLocale])

  return <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '100%',
      ...style
    }}
    className={className}
  >
    <select
      onChange={handleLocaleChange}
      defaultValue={locale}
      style={{
        margin: '0 var(--basis_x0_5) 0 0'
      }}
    >
      <option value="en">English</option>
      <option value="de">German</option>
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
