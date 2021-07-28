import { useCallback } from 'react'

const email_regex = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})\.?)$/gui

function EmailInput({ defaultValue, onChange, onError, ...props }) {
  const handleTextChange = useCallback((event) => {
    if (onChange || onError) {
      const value = event.target.value || ''
      let isSubmittable = false
      let error = ''

      if (value !== '') {
        if (value.match(email_regex)) {
          isSubmittable = true
        } else {
          error = 'invalid_email'
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
    type="email"
    onChange={handleTextChange}
    defaultValue={defaultValue}
    {...props}
  />
}

export default EmailInput
