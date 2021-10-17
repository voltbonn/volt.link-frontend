import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import HtmlInput from './HtmlInput.js'
import TranslatedInput from './TranslatedInput.js'

function InlineEditorBlockPersonRaw({
  getString,
  block = {},
  onChange,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  // onSplitText,
  // onMergeToPrevInput,
  // onMergeToNextInput,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])

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

    <TranslatedInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
    >
      {(translatedInputProps) => {
        return (
        <HtmlInput
          placeholder={getString('placeholder_text')}
          style={{
            margin: '0',
            fontWeight: 'bold',
          }}
          linebreaks={true}
          className="hide_border type_text"

          onInputRef={onInputRef}
          onGoToPrevInput={onGoToPrevInput}
          onGoToNextInput={onGoToNextInput}

          {...translatedInputProps}
        />
        )
      }
      }
    </TranslatedInput>
  </div>
}

const InlineEditorBlockPerson = withLocalization(InlineEditorBlockPersonRaw)

export default InlineEditorBlockPerson
