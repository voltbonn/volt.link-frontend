import React, { useCallback, useRef } from 'react'

function HtmlInput({ defaultValue, children, style, onChange, onError, ...props }) {
  defaultValue = `hello\two\nrld`
  const fake_defaultValue = useRef({__html:
    defaultValue
    // .replace(/\t/g, '&emsp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // .replace(/\n/g, '<br />')
  })

  const handleTextChange = useCallback((event) => {
    try {
      if (onChange) {
        const value = (event.target.innerHTML || '')
        // .replace(/&emsp;/g, '\t')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/<\/? ?br ?\/?>/g, '\n')

        onChange(value)
      }
    } catch (error) {
      if (onError) {
        onError(error)
      }
    }
  }, [onChange, onError])

  const addLineBreaks = useCallback(event => {
    if (event.key === 'Enter') {
      // source: StackOverflow (https://stackoverflow.com/a/61237402)
      document.execCommand ('insertLineBreak')
      event.preventDefault()
    }
  }, [])

  return <div
    onKeyDown={addLineBreaks}
    onInput={handleTextChange}
    style={{
      flexGrow: '1',
      whiteSpace: 'pre-wrap',
      display: 'inline-block',
      ...style,
    }}
    contentEditable={true}
    dangerouslySetInnerHTML={fake_defaultValue.current}
    {...props}
  />
}

export default HtmlInput