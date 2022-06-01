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
        _id: block._id,
        properties: {
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

  let image_url = ''
  if (typeof url === 'string' && url.length > 0) {
    image_url = `${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=150&h=100&url=${encodeURIComponent(url)}`
  }

  return <div style={{
    margin: '0 0 var(--basis) 0',
    cursor: 'auto',
    ...colorStyles,
  }}
  className="clickable_card active"
  >
    <div style={{
      marginBottom: 'var(--basis)',
    }}>
    {
      image_url !== ''
        ? <img
          src={image_url}
          alt={text}
          title={text}
          style={{
            maxWidth: '150px',
            maxHeight: '100px',
            boxShadow: 'inset 0 0 0 1px rgba(var(--on-background-rgb), var(--alpha-less))',
          }}
        />
        : getString('inline_editor_image_block_explainer_title')
    }
    </div>

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
