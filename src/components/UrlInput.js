import { useCallback } from 'react'

const url_regex = /^([A-Z0-9+-.]+:(?:\/\/)?)?[\w\u00C0-\u00FF_.-]+(?:\.[\w\u00C0-\u00FF_.-]+)+[\w\u00C0-\u00FF_~:/?#[\]!$&'()*+,;=.-]+$/gui
const email_regex = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})\.?)$/gui

function UrlInput({ defaultValue, onChange, onError, ...props }) {
  const handleTextChange = useCallback((event) => {
        console.log('-----')
    if (onChange || onError) {
      const value = event.target.value || ''
      let isSubmittable = false
      let error = ''

      if (value !== '') {
        const schema_parts = value.split(':')
        const schema = schema_parts.shift()
        const after_schema = schema_parts.join(':')

        if (schema === 'mailto' || after_schema.includes('@') === true) {
          if (after_schema.match(email_regex)) {
            isSubmittable = true
          } else {
            error = 'invalid_mailto_url'
          }
        } else {
          if (value.match(url_regex)) {
            isSubmittable = true
          } else {
            error = 'invalid_url'
          }
        }
      }

      if (onChange) {
        if (isSubmittable) {
          onChange(value)
        } else {
          onChange('')
        }
      }

      if (onError) {
        onError(error)
      }
    }
  }, [onChange, onError])

  return <input
    type="url"
    onChange={handleTextChange}
    defaultValue={defaultValue}
    {...props}
  />
}

export default UrlInput
