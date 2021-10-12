import { useCallback } from 'react'

const email_regex = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})\.?)$/gui // is surrounded by start and end tags
const emails_regex = /((?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})\.?))/gui // is surrounded by a group

function EmailInput({ multiple = false, onChange, onError, ...props }) {
  const handleTextChange = useCallback((event) => {
    if (onChange || onError) {
      let value = event.target.value || ''
      let isSubmittable = false
      let error = ''

      if (value !== '') {
        if (multiple === true) {
          const emails = value.match(emails_regex)
          if (emails) {
            value = emails
            isSubmittable = true
          } else {
            error = 'Invalid email(s) format'
          }
        } else {
          if (value.match(email_regex)) {
            isSubmittable = true
          } else {
            error = 'invalid_email'
          }
        }
      }

      if (onChange) {
        if (isSubmittable) {
          onChange(value)
        } else {
          if (multiple === true) {
            onChange([])
          } else {
            onChange('')
          }
        }
      }

      if (onError) {
        onError(error)
      }
    }
  }, [multiple, onChange, onError])

  return <input
    type="email"
    onChange={handleTextChange}
    {...props}
  />
}

export default EmailInput
