import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockPageRaw({
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
  
  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  return <div
    style={{
      display: 'flex',
      margin: '0 0 var(--basis) 0',
      cursor: 'auto',
      '--on-background-rgb': colorRGB,
      color: color,
    }}
    className="clickable_card active"
  >
    <PagePlaceholderIcon
      style={{
        margin: 'var(--basis)',
      }}
    />

    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}

      placeholder={getString('placeholder_headline_main')}
      style={{
        flexGrow: '1',
        width: '100%',
        margin: '0',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color,
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

const InlineEditorBlockPage = withLocalization(InlineEditorBlockPageRaw)

export default InlineEditorBlockPage
