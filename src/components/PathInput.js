import { useCallback, useState } from 'react'

function PathInput({
  defaultValue = '',
  onChange,
  onBlur,
  onSubmit,
  onError,
  allowExisting = false,
  placeholder = 'bonn',
  style,
  className
}) {
  const [forbidden, setForbidden] = useState({})
  const [text, setText] = useState(defaultValue)

  useKeyPress(['Enter'], () => {
    if (onSubmit) {
      onSubmit(text)
    }
  })

  useEffect(() => {
    fetch(`${window.domains.backend}forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setForbidden(data)
      })
      .catch(error => {
        console.error(error)
        setForbidden({})
      })
  }, [setForbidden])

  const handleTextChange = useCallback(newText => {
    newText = newText.toLowerCase()
    setText(newText)

    let error = ''
    if (newText !== '') {
      const forbidden_letters = (forbidden.letters || '').split('')
      const newText_split = newText.split('')
      const forbidden_letters_filtered = forbidden_letters.filter(value => !newText_split.includes(value))

      const forbidden_codes = forbidden.codes || []
      const value_is_a_forbidden_code = forbidden_codes.includes(newText)

      if (value_is_a_forbidden_code) {
        error = 'This path is not allowed.'
      } else if (forbidden_letters_filtered.length < forbidden_letters.length) {
        error = 'This path contains forbidden characters.'
      } else if (newText.startsWith('volt')) {
        error = 'A path can\'t start with "volt".'
      }
    }

    if (onChange) {
      onChange(newText)
    }

    if (onError) {
      onError(error)
    }
  }, [
    setText,
    forbidden.letters,
    forbidden.codes,
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
    style={style}
    className={className}
  />
}

export default PathInput
