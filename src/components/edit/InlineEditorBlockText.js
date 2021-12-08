import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockTextRaw({
  getString,
  block = {},
  onChange,
  onSaveBlock,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeFromNextInput,

  onAddRowAfter,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState('')

  useEffect(() => {
    setText(properties.text || '')
  }, [properties.text, setText])

  const publishTextChange = useCallback(() => {
    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      })
    }
  }, [onChange, block, text])

  return <HtmlInput
    defaultValue={text}
    onChange={setText}
    onBlur={publishTextChange}

    placeholder={getString('placeholder_text')}
    style={{
      margin: '0',
      backgroundColor: 'transparent',
    }}
    linebreaks={true}
    className="hide_border type_text"

    onInputRef={onInputRef}
    onGoToPrevInput={onGoToPrevInput}
    onGoToNextInput={onGoToNextInput}
    onMergeToPrevInput={() => onMergeToPrevInput(block)}
    onMergeFromNextInput={() => onMergeFromNextInput(block)}
    onSplitText={onSplitText}
  />
}

const InlineEditorBlockText = withLocalization(InlineEditorBlockTextRaw)

export default InlineEditorBlockText
