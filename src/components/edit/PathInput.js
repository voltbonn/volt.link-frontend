import { useRef, useCallback, useState, useEffect } from 'react'

import HtmlInput from './HtmlInput.js'
import useCheckPath from '../../hooks/useCheckPath.js'

function PathInput({
  defaultValue = '',
  onChange,
  onBlur,
  onSubmit,
  onError,
  allowExisting = false,
  placeholder = 'de-bonn',
  ...props
}) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const checkPath = useCheckPath()

  const [text, setText] = useState('')

  useEffect(() => {
    if (mountedRef.current) {
      setText(defaultValue)
    }
  }, [setText, defaultValue])

  const handleTextChange = useCallback(async newText => {
    newText = newText.toLowerCase()
    setText(newText)

    let isSubmittable = true
    let error = ''
    if (newText !== '') {
      const {
        isOkay,
        errors
      } = (await checkPath(newText)) || {}
      
      isSubmittable = isOkay
      error = errors.join('\n')
    }

    if (isSubmittable && onChange) {
      onChange(newText)
    }

    if (onError) {
      onError(error)
    }
  }, [
    setText,
    checkPath,
    onChange,
    onError,
  ])

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(text)
    }
  }, [onBlur, text])

  return <HtmlInput
    onChange={handleTextChange}
    onBlur={handleBlur}
    defaultValue={defaultValue}
    placeholder={placeholder}
    linebreaks={false}
    {...props}
  />
}

export default PathInput
