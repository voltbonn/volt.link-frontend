import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import HtmlInput from './HtmlInput.js'
import BlockIcon from '../view/BlockIcon.js'

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
  
  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  return <div
    style={{
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 var(--basis) 0',
      cursor: 'auto',
      '--on-background-rgb': colorRGB,
      color: color,
    }}
    className="clickable_card active"
  >
    <BlockIcon block={block} />

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

const InlineEditorBlockPerson = withLocalization(InlineEditorBlockPersonRaw)

export default InlineEditorBlockPerson
