import { useCallback, useState, useEffect } from 'react'

import HtmlInput from './HtmlInput.js'

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
  const [forbiddenInPath, setForbiddenInPath] = useState({})
  const [text, setText] = useState(defaultValue)

  const checkPath = useCallback(async path => {
    const forbidden_letters_splitted = forbiddenInPath.letters.split('')

    const path_split = path.split('')

    const errors = []

    // TODO: check if path is a blockId
    
    if (path.includes('/')) {
      errors.push(`Cant't contain a slash (/).`)
    }

    if (path.startsWith('volt')) {
      errors.push(`Cant't start with "volt".`)
    }

    if (forbiddenInPath.codes.includes(path)) {
      errors.push(`Can't be a forbidden path.`)
    }

    if (forbidden_letters_splitted.filter(value => !path_split.includes(value)).length < forbidden_letters_splitted.length) {
      errors.push(`Can't contain one or more of these forbidden letter: ${forbidden_letters_splitted.join(' ')}`)
    }

    return errors
  }, [ forbiddenInPath ])

  useEffect(() => {
    fetch(`${window.domains.backend}forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setForbiddenInPath(data)
      })
      .catch(error => {
        console.error('forbidden codes error:', error)
        setForbiddenInPath({})
      })
  }, [setForbiddenInPath])

  const handleTextChange = useCallback(async newText => {
    newText = newText.toLowerCase()
    setText(newText)

    let isSubmittable = true
    let error = ''
    if (newText !== '') {
      const errors = await checkPath(newText)
      if (errors.length > 0) {
        isSubmittable = false
        error = errors.join('\n')
      }
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
