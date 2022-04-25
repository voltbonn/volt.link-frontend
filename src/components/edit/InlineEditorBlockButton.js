import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'

function InlineEditorBlockButtonRaw({
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
  const {
    url: og_url = ''
  } = properties
  const [url, setUrl] = useState(og_url)

  const publishChanges = useCallback(() => {
    if (onChange) {
      const newBlock = {
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      }

      if (url === '') {
        if(newBlock.properties.hasOwnProperty('url')) {
          delete newBlock.properties.url
        }
      } else {
        newBlock.properties.url = url
      }

      onChange(newBlock)
    }
  }, [onChange, block, text, url])
  
  const {
    color,
    colorRGB,
    contrastingColor,
  } = getBlockColor(block)

  const colorStyles = {}
  if (color) {
    colorStyles['--on-background-rgb'] = colorRGB
    colorStyles['--button-background'] = color
    colorStyles['--button-color'] = contrastingColor
  }

  return <div style={{
    margin: '0 0 var(--basis) 0',
    cursor: 'auto',
    ...colorStyles,
  }}
  className="clickable_card active"
  >
    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}

      placeholder={getString('placeholder_button')}
      style={{
        margin: '0',
        ...colorStyles,
      }}
      linebreaks={true}
      className="hide_border type_button default"

      onInputRef={onInputRef}
      onGoToPrevInput={onGoToPrevInput}
      onGoToNextInput={onGoToNextInput}
      onMergeToPrevInput={() => onMergeToPrevInput(block)}
      onMergeFromNextInput={() => onMergeFromNextInput(block)}
      onSplitText={onSplitText}
    />

    <FancyInput>
      {({ setError }) => (
        <UrlInput
          onError={setError}
          onChange={setUrl}
          onBlur={publishChanges}
          type="text"
          defaultValue={url}
          placeholder={getString('action_input_url_placeholder')}
          style={{
            margin: 'var(--basis) 0 0 0',
            width: '100%',
          }}
        />
      )}
    </FancyInput>
  </div>
}

const InlineEditorBlockButton = withLocalization(InlineEditorBlockButtonRaw)

export default InlineEditorBlockButton
