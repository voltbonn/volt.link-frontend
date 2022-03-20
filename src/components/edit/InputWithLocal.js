import { useState, useCallback } from 'react'

import classes from './InputWithLocal.module.css'
import LocaleSelect from './LocaleSelect.js'

function InputWithLocal({ reorderHandle, actionButton, locale, defaultValue, children, style, onChange, onBlur, className, dataset = {}, ...props }) {
  const [changedLocale, setChangedLocale] = useState(locale)
  const [changedValue, setChangedValue] = useState(defaultValue)

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur({
        value: {
          locale: changedLocale,
          value: changedValue,
        },
        dataset,
      })
    }
  }, [ onBlur, changedLocale, changedValue, dataset ])

  const handleLocaleChange = useCallback(newLocale => {
    setChangedLocale(newLocale)

    const changes = {
      value: {
        locale: newLocale,
        value: changedValue,
      },
      dataset,
    }

    if (onChange) {
      onChange(changes)
    }
    if (onBlur) {
      onBlur(changes)
    }
  }, [setChangedLocale, onChange, changedValue, dataset, onBlur])

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
    <LocaleSelect
      onChange={handleLocaleChange}
      defaultValue={locale}
    />
    {
      !!children
        ? children({
          onChange: handleTextChange,
          onBlur: handleBlur,
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
