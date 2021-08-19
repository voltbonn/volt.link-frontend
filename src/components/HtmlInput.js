import React, { useCallback, useRef } from 'react'

function HtmlInput({ defaultValue, children, style, onChange, onError, ...props }) {
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
        .trim('\n')

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

  const handlePaste = useCallback(event => {
    // only accept plain text

    // cancel paste
    event.preventDefault()

    // get text representation of clipboard
    const text = (event.originalEvent || event).clipboardData.getData('text/plain')

    // insert text manually
    document.execCommand('insertText', false, text)
  }, [])

  return <div
    onKeyDown={addLineBreaks}
    onInput={handleTextChange}
    onPaste={handlePaste}
    style={{
      flexGrow: '1',
      whiteSpace: 'pre-wrap',
      display: 'inline-block',
      paddingBottom: 'var(--basis)',
      ...style,
    }}
    contentEditable={true}
    dangerouslySetInnerHTML={fake_defaultValue.current}
    {...props}
  />
}

export default HtmlInput
