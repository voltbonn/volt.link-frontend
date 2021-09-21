import React, { useCallback, useRef, useState } from 'react'

import classes from './HtmlInput.module.css'

function HtmlInput({ defaultValue, children, className, onChange, onBlur, onError, linebreaks, style, placeholder = '', ...props }) {
  const fake_defaultValue = useRef({__html:
    defaultValue
    // .replace(/\t/g, '&emsp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // .replace(/\n/g, '<br />')
  })
  const [text, setText] = useState(defaultValue)

  const handleTextChange = useCallback((event) => {
    try {
      if (onChange) {
        let value = event.target.innerHTML || ''
        // .replace(/&emsp;/g, '\t')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')

        if (linebreaks === false) {
          value = value.replace(/<\/? ?br ?\/?>/g, ' ')
        } else {
          value = value.replace(/<\/? ?br ?\/?>/g, '\n')
        }

        value = value.trim()

        onChange(value)
        setText(value)
      }
    } catch (error) {
      if (onError) {
        onError(error)
      }
    }
  }, [onChange, onError, setText, linebreaks])

  const handleTextBlur = useCallback(() => {
    if (onBlur) {
      onBlur(text)
    }
  }, [onBlur, text])

  const addLineBreaks = useCallback(event => {
    if (event.key === 'Enter') {
      // source: StackOverflow (https://stackoverflow.com/a/61237402)
      if (linebreaks !== false) {
        document.execCommand('insertLineBreak')
      }
      event.preventDefault()
    } else if (event.key === 'Tab') {
      document.execCommand('insertText', false, '\t')
      event.preventDefault()
    }
  }, [linebreaks])

  const handlePaste = useCallback(event => {
    // only accept plain text

    // cancel paste
    event.preventDefault()

    // get text representation of clipboard
    let text = (event.originalEvent || event).clipboardData.getData('text/plain')

    if (linebreaks === false) {
      text = text.replace(/\n/g, ' ')
    }

    // insert text manually
    document.execCommand('insertText', false, text)
  }, [linebreaks])

  return <div
    onKeyDown={addLineBreaks}
    onInput={handleTextChange}
    onBlur={handleTextBlur}
    onPaste={handlePaste}
    className={`${classes.rebuild_textarea} ${text.length === 0 ? classes.show_placeholder : ''} ${className}`}
    contentEditable={true}
    dangerouslySetInnerHTML={fake_defaultValue.current}
    style={style}
    placeholder={placeholder}
  />
}

export default HtmlInput
