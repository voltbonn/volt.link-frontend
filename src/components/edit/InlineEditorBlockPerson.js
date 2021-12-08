import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockPersonRaw({
  getString,
  block = {},
  onChange,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeFromNextInput,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || '')

  const publishChanges = useCallback(() => {
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

  return <div style={{ display: 'flex' }}>
    <PersonPlaceholderIcon
      style={{
        margin: 'var(--basis)',
      }}
    />

    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}

      placeholder={getString('placeholder_text')}
      style={{
        flexGrow: '1',
        width: '100%',
        margin: '0',
        fontWeight: 'bold',
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
  </div>
}

const InlineEditorBlockPerson = withLocalization(InlineEditorBlockPersonRaw)

export default InlineEditorBlockPerson
