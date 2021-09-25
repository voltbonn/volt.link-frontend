import React, { useCallback, useRef, useState, useEffect } from 'react'

import {
  offset as getCaretOffset,
  getOffset,
} from 'caret-pos'

import classes from './HtmlInput.module.css'


function getRangeLengthWithLinebreaks(element){
  if (!window.getSelection) {
    return 0;
  }

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  if (!range) {
    return 0;
  }

  const clonedRange = range.cloneRange()
  clonedRange.selectNodeContents(element)
  clonedRange.setEnd(range.endContainer, range.endOffset)
  const content = clonedRange.cloneContents()

  let rangeLength = 0
  for (const node of content.childNodes) {
    if (node.nodeType === 3) { // node type = 3 is a text node
      rangeLength += node.textContent.length
    } else if (node.nodeType === 1 && node.nodeName === 'BR') { // node type = 1 is an element node
      rangeLength += 1
    }
  }

  clonedRange.detach()

  return rangeLength
}

function getInLineRangeLength(element, whichLine){
  if (!window.getSelection) {
    return 0;
  }

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  if (!range) {
    return 0;
  }

  const clonedRange = range.cloneRange()
  clonedRange.selectNodeContents(element)
  clonedRange.setEnd(range.endContainer, range.endOffset)
  const content = clonedRange.cloneContents()

  let rangeLength = 0
  if (content.childNodes.length > 0) {
    if (whichLine === 'first') {
      if (content.childNodes[0].nodeType === 3) {
        rangeLength = content.childNodes[0].length
      } else {
        rangeLength = 0
      }
    } else if (whichLine === 'last') {
      if (content.childNodes[content.childNodes.length-1].nodeType === 3) {
        rangeLength = content.childNodes[content.childNodes.length-1].length
      } else {
        if (content.childNodes.length > 1) {
          if (content.childNodes[content.childNodes.length-2].nodeType === 3) {
            rangeLength = content.childNodes[content.childNodes.length-2].length
          } else {
            rangeLength = 0
          }
        } else {
          rangeLength = 0
        }
      }
    }
  }

  clonedRange.detach()

  return rangeLength
}

function getCaretPosition(element){

  // get element height without padding and border
  const cs = getComputedStyle(element)
  const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
  const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
  const elementHeight = element.offsetHeight - paddingY - borderY

  // get caret position
  const offset = getOffset(element)
  const caretOffset = getCaretOffset(element)
  caretOffset.top = caretOffset.top - offset.top
  caretOffset.left = caretOffset.left - offset.left

  // check if caret is in the first line
  let inFirstLine = caretOffset.top < caretOffset.height

  // check if caret is in the last line
  let inLastLine = elementHeight - caretOffset.top < caretOffset.height

  // define caret position from start of text
  const caretPositionFromStart = getRangeLengthWithLinebreaks(element)

  // calc caret position from end of text
  let textLength = element.innerText.length - 1 || 0
  if (textLength < 0) {
    textLength = 0
  }
  const caretPositionFromEnd = textLength - caretPositionFromStart

  return {
    inFirstLine,
    inLastLine,
    left: caretOffset.left,
    top: caretOffset.top,
    height: caretOffset.height,
    positionFromLineStart: getInLineRangeLength(element, (inFirstLine ? 'first' : 'last')),
    positionFromStart: caretPositionFromStart,
    positionFromEnd: caretPositionFromEnd,
  }
}

function HtmlInput({
  defaultValue,
  children,
  className,
  onChange,
  onBlur,
  onError,
  linebreaks,
  style,
  placeholder = '',

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,

  ...props
}) {
  const inputRef = useRef(null)
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
      setText(value)

      if (onChange) {
        onChange(value)
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

  const keyDownHandler = useCallback(event => {
    if (event.key === 'Enter' && event.shiftKey === true) {
      // source: StackOverflow (https://stackoverflow.com/a/61237402)
      if (linebreaks !== false) {
        document.execCommand('insertLineBreak')
      }
      event.preventDefault()
    } else if (event.key === 'Tab') {
      document.execCommand('insertText', false, '\t')
      event.preventDefault()
    } else if (event.key === 'ArrowUp') {
      if (onGoToPrevInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.inFirstLine) {
          onGoToPrevInput({ caretPosition })
          event.preventDefault()
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (onGoToPrevInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.inFirstLine && caretPosition.positionFromStart === 0) {
          onGoToPrevInput({ caretPosition })
          event.preventDefault()
        }
      }
    } else if (event.key === 'ArrowDown') {
      if (onGoToNextInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.inLastLine) {
          onGoToNextInput({ caretPosition })
          event.preventDefault()
        }
      }
    } else if (event.key === 'ArrowRight') {
      if (onGoToNextInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.inLastLine && caretPosition.positionFromEnd === 0) {
          onGoToNextInput({ caretPosition })
          event.preventDefault()
        }
      }
    } else if (event.key === 'Enter') {
      if (onSplitText) {
        const caretPosition = getCaretPosition(inputRef.current)

        const innerText = inputRef.current.innerText
        const start = innerText.slice(0, caretPosition.positionFromStart)
        const end = innerText.slice(caretPosition.positionFromStart)

        onSplitText({
          texts: [start, end],
        })
        event.preventDefault()
      }
    } else if (event.key === 'Backspace') {
      if (onMergeToPrevInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.positionFromStart === 0 && caretPosition.inFirstLine) {
          onMergeToPrevInput({
            caretPosition,
            text: inputRef.current.innerText,
          })
          event.preventDefault()
        }
      }
    } else if (event.key === 'Delete') {
      if (onMergeToNextInput) {
        const caretPosition = getCaretPosition(inputRef.current)
        if (caretPosition.positionFromEnd === 0 && caretPosition.inLastLine) {
          onMergeToNextInput({
            caretPosition,
            text: inputRef.current.innerText,
          })
          event.preventDefault()
        }
      }
    }
  }, [inputRef, linebreaks, onGoToPrevInput, onGoToNextInput, onSplitText, onMergeToPrevInput, onMergeToNextInput])

  useEffect(() => {
    if (onInputRef) {
      onInputRef(inputRef)
    }
  }, [onInputRef, inputRef])

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
    ref={inputRef}
    onKeyDown={keyDownHandler}
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
