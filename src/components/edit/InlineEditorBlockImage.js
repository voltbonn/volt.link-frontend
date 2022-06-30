import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import HtmlInput from './HtmlInput.js'
import ImagePicker from './ImagePicker.js'

import {
  ImageSharp as ImageIcon,
} from '@mui/icons-material'

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

  let og_coverphoto = ''
  if (
    properties.hasOwnProperty('coverphoto')
    && properties.coverphoto.hasOwnProperty('type')
  ) {
    og_coverphoto = properties.coverphoto
  }
  const [coverphoto, setCoverphoto] = useState(og_coverphoto)

  const publishChanges = useCallback(() => {
    if (onChange) {
      const newBlock = {
        _id: block._id,
        properties: {
          text,
        },
      }

      if (coverphoto === null) {
        if (newBlock.properties.hasOwnProperty('coverphoto')) {
          delete newBlock.properties.coverphoto
        }
      } else {
        newBlock.properties.coverphoto = coverphoto
      }

      onChange(newBlock)
    }
  }, [onChange, block, text, coverphoto])

  const saveCoverphoto = useCallback(newCoverphoto => {
    setCoverphoto(newCoverphoto)
    publishChanges()
  }, [publishChanges])
  
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

  let imageUrl = ''
  if (coverphoto?.type === 'url') {
    if (typeof coverphoto?.url === 'string' && coverphoto?.url.length > 0) {
      imageUrl = `${window.domains.storage}download_url?f=${window.imageFormat || 'jpg'}&w=150&h=150&url=${encodeURIComponent(coverphoto.url)}`
    }
  } else if (coverphoto?.type === 'file') {
    if (typeof coverphoto?.fileId === 'string' && coverphoto?.fileId.length > 0) {
      imageUrl = `${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=150&h=150&id=${encodeURIComponent(coverphoto.fileId)}`
    }
  }

  const alt = (typeof text === 'string' && text.length > 0) ? text : 'Image Preview'
  const title = alt

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
      imageUrl !== ''
        ? <img
          src={imageUrl}
          alt={alt}
          title={title}
          style={{
            maxWidth: '150px',
            maxHeight: '100px',
            boxShadow: 'inset 0 0 0 1px rgba(var(--on-background-rgb), var(--alpha-less))',
          }}
        />
        : getString('inline_editor_image_block_explainer_title')
    }
    </div>

    <ImagePicker
      imageValue={coverphoto}
      onChange={saveCoverphoto}
      types={['url', 'file']}
      trigger={(triggerProps) => (
        <button {...triggerProps} className="hasIcon default" style={{ margin: 0 }}>
          <ImageIcon className="icon" />
          <span style={{ marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle' }}>Choose an Image</span>
        </button>
      )}
    />

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
