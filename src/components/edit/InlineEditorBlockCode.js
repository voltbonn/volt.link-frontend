import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockCodeRaw({
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
        _id: block._id,
        properties: {
          text,
        },
      })
    }
  }, [onChange, block, text])

  return <pre class="hljs"><code>
    <HtmlInput
    defaultValue={text}
    onChange={setText}
    onBlur={publishTextChange}

    type="code"
    placeholder={getString('placeholder_code')}
    style={{
      margin: '0',
      whiteSpace: 'pre',
      fontFamily: 'monospace',
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
  </code></pre>
}

const InlineEditorBlockCode = withLocalization(InlineEditorBlockCodeRaw)

export default InlineEditorBlockCode
