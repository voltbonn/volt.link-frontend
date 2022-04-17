import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

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

  let text_style_class = 'type_p'
  if (properties.hasOwnProperty('text_style')) {
    text_style_class = 'type_'+properties.text_style
  }

  const {
    color,
  } = getBlockColor(block)

  const colorStyles = {}
  if (color) {
    colorStyles.color = color
  }

  return <HtmlInput
    defaultValue={text}
    onChange={setText}
    onBlur={publishTextChange}

    placeholder={getString('placeholder_text')}
    style={{
      margin: '0',
      backgroundColor: 'transparent',
      ...colorStyles,
    }}
    linebreaks={true}
    className={`hide_border ${text_style_class}`}

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
