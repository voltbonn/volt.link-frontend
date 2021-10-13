import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import HtmlInput from './HtmlInput.js'
import TranslatedInput from './TranslatedInput.js'

function InlineEditorBlockHeadlineRaw({
  getString,
  block = {},
  onChange,
  onSaveBlock,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  // onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,

  onAddRowAfter,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState([])

  useEffect(() => {
    setText(properties.text || [])
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

  const handleMergeToPrevInput = useCallback(()=>{
    if (onMergeToPrevInput) {
      onMergeToPrevInput(block)
    }
  }, [onMergeToPrevInput, block])

  const handleMergeToNextInput = useCallback(()=>{
    if (onMergeToNextInput) {
      onMergeToNextInput(block)
    }
  }, [onMergeToNextInput, block])

  return <TranslatedInput
    defaultValue={text}
    onChange={setText}
    onBlur={publishTextChange}
  >
    {(translatedInputProps) => {
      return (
      <HtmlInput
        placeholder={getString('placeholder_headline')}
        style={{ margin: '0' }}
        linebreaks={true}
        className="hide_border type_h2"

        onInputRef={onInputRef}
        onGoToPrevInput={onGoToPrevInput}
        onGoToNextInput={onGoToNextInput}
        onMergeToPrevInput={handleMergeToPrevInput}
        onMergeToNextInput={handleMergeToNextInput}

        {...translatedInputProps}
      />
      )
    }
    }
  </TranslatedInput>
}

const InlineEditorBlockHeadline = withLocalization(InlineEditorBlockHeadlineRaw)

export default InlineEditorBlockHeadline
