import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockHeadlineRaw({
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

    placeholder={getString('placeholder_headline')}
    style={{ margin: '0' }}
    linebreaks={true}
    className="hide_border type_h2"

    onInputRef={onInputRef}
    onGoToPrevInput={onGoToPrevInput}
    onGoToNextInput={onGoToNextInput}
    onMergeToPrevInput={() => onMergeToPrevInput(block)}
    onMergeFromNextInput={() => onMergeFromNextInput(block)}
    onSplitText={onSplitText}
  />
}

const InlineEditorBlockHeadline = withLocalization(InlineEditorBlockHeadlineRaw)

export default InlineEditorBlockHeadline
