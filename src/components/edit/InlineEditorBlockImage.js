import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'

function InlineEditorBlockImageRaw({
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

  let og_url = ''
  if (
    properties.hasOwnProperty('coverphoto')
    && properties.coverphoto.hasOwnProperty('type')
  ) {
    if (
      properties.coverphoto.type === 'url'
      && properties.coverphoto.hasOwnProperty('url')
    ) {
      og_url = properties.coverphoto.url
    }
  }
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
        if (newBlock.properties.hasOwnProperty('coverphoto')) {
          delete newBlock.properties.coverphoto
        }
      } else {
        newBlock.properties.coverphoto = {
          type: 'url',
          url,
        }
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
    {
      url !== ''
        ? <img
          src={url}
          alt={text}
          style={{
            maxWidth: '150px',
            maxHeight: '100px',
          }}
        />
        : getString('inline_editor_image_block_explainer_title')
    }

    <FancyInput>
      {({ setError }) => (
        <UrlInput
          onError={setError}
          onChange={setUrl}
          onBlur={publishChanges}
          defaultValue={url}
          placeholder={getString('placeholder_image_url')}
          style={{
            margin: '0',
            width: '100%',
          }}
        />
      )}
    </FancyInput>

    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}

      placeholder={getString('placeholder_image_alt_text')}
      style={{
        margin: 'var(--basis) 0 0 0',
        ...colorStyles,
      }}
      linebreaks={true}
      className="type_p default"
    />
  </div>
}

const InlineEditorBlockImage = withLocalization(InlineEditorBlockImageRaw)

export default InlineEditorBlockImage
