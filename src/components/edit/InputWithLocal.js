import { useState, useCallback } from 'react'

import classes from './InputWithLocal.module.css'
import LocaleSelect from './LocaleSelect.js'

function InputWithLocal({ reorderHandle, actionButton, locale, defaultValue, children, style, onChange, onBlur, className, dataset = {}, ...props }) {
  const [changedLocale, setChangedLocale] = useState(locale)
  const [changedText, setChangedText] = useState(defaultValue)

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur({
        value: {
          locale: changedLocale,
          text: changedText,
        },
        dataset,
      })
    }
  }, [ onBlur, changedLocale, changedText, dataset ])

  const handleLocaleChange = useCallback(newLocale => {
    setChangedLocale(newLocale)

    const changes = {
      value: {
        locale: newLocale,
        text: changedText,
      },
      dataset,
    }

    if (onChange) {
      onChange(changes)
    }
    if (onBlur) {
      onBlur(changes)
    }
  }, [setChangedLocale, onChange, changedText, dataset, onBlur])

  const handleTextChange = useCallback((event_or_text) => {
    let text = event_or_text
    if (
      !!event_or_text
      && !!event_or_text.target
      && !!event_or_text.target.value
    ) {
      text = event_or_text.target.value
    }

    setChangedText(text)
    if (onChange) {
      onChange({
        value: {
          locale: changedLocale,
          text,
        },
        dataset,
      })
    }
  }, [setChangedText, onChange, changedLocale, dataset])

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
          defaultValue,
          style: {
            flexGrow: '1',
          }
        })
        : null
    }
  </div>
}

export default InputWithLocal
