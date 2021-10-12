import { useCallback, useState } from 'react'

const url_regex = /^([A-Z0-9+-.]+:(?:\/\/)?)[\w\u00C0-\u00FF_.-]+(?:\.[\w\u00C0-\u00FF_.-]+)+[\w\u00C0-\u00FF_~:/?#[\]!%$&'()@*+,;=.-]+$/gui
const email_regex = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})\.?)$/gui
const is_email_not_url_regex = /^[^:/]+@.+$/gui

function UrlInput({
  defaultValue = '',
  onChange,
  onBlur,
  onError,
  placeholder = 'https://',
  style,
  className
}) {
  const [text, setText] = useState(defaultValue)

  const handleTextChange = useCallback((event) => {
    const value = event.target.value || ''
    // let isSubmittable = false
    let error = ''

    if (value !== '') {
      const schema_parts = value.split(':')
      const schema = schema_parts.shift()
      const after_schema = schema_parts.join(':')

      if (schema === 'tel') {
        // isSubmittable = true
      } else if (schema === 'mailto' || value.match(is_email_not_url_regex)) {
        if (after_schema.match(email_regex)) {
          // isSubmittable = true
        } else {
          error = 'invalid_mailto_url'
        }
      } else {
        if (value.match(url_regex)) {
          // isSubmittable = true
        } else {
          error = 'invalid_url'
        }
      }
    }

    if (onChange) {
      onChange(value)
    }

    if (onError) {
      onError(error)
    }

    setText(value)
  }, [onChange, onError])

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(text)
    }
  }, [onBlur, text])

  return <input
    type="url"
    onChange={handleTextChange}
    onBlur={handleBlur}
    defaultValue={defaultValue}
    placeholder={placeholder}
    style={style}
    className={className}
  />
}

export default UrlInput
