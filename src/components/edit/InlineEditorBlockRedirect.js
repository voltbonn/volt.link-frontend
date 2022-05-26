import React, { useRef, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import {
  ArrowForward as ToIcon,
} from '@mui/icons-material'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'
import SlugInput from './SlugInput.js'
import BlockIcon from '../view/BlockIcon.js'


function InlineEditorBlockRedirectRaw({
  getString,
  block = {},
  onChange,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeFromNextInput,

  style = {},
}) {
  const properties = block.properties || {}
  const {
    slug: og_slug = '',
    url: og_url = ''
  } = properties

  const textRef = useRef(properties.text || '')
  const text = textRef.current
  const setText = newValue => textRef.current = newValue

  const slugRef = useRef(og_slug || '')
  const slug = slugRef.current
  const setSlug = newValue => slugRef.current = newValue

  const urlRef = useRef(og_url || '')
  const url = urlRef.current
  const setUrl = newValue => urlRef.current = newValue

  const publishChanges = useCallback(() => {
    if (onChange) {
      const text = textRef.current
      const slug = slugRef.current
      const url = urlRef.current

      const newBlock = {
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      }

      if (slug === '') {
        if (newBlock.properties.hasOwnProperty('slug')) {
          delete newBlock.properties.slug
        }
      } else {
        newBlock.properties.slug = slug
      }

      if (url === '') {
        if (newBlock.properties.hasOwnProperty('url')) {
          delete newBlock.properties.url
        }
      } else {
        newBlock.properties.url = url
      }

      onChange(newBlock)
    }
  }, [ onChange, block ])
  
  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  return <div style={{
    ...style,
    margin: '0 0 var(--basis) 0',
    cursor: 'auto',
    '--on-background-rgb': colorRGB,
  }}
  className="clickable_card active"
  >
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', color }}>
      <BlockIcon block={block} />

      <HtmlInput
        defaultValue={text}
        onChange={setText}
        onBlur={publishChanges}

        placeholder={getString('placeholder_headline')}
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

    <div style={{ paddingInlineStart: 'var(--basis_x8)', width: '100%', display: 'flex', alignItems: 'center', }}>
      volt.link/
      <FancyInput style={{ width: '100%', marginInlineStart: 'var(--basis)' }}>
        {({ setError }) => (
          <SlugInput
            onError={setError}
            onChange={setSlug}
            onBlur={publishChanges}
            defaultValue={slug}
            placeholder={getString('trigger_input_path_placeholder')}
            style={{
              margin: 'var(--basis) 0',
              width: '100%',
            }}
          />
        )}
      </FancyInput>
    </div>

    <div style={{ paddingInlineStart: 'var(--basis_x8)', width: '100%', display: 'flex', alignItems: 'center', }}>
      <ToIcon
        style={{
          flexShrink: 0,
          margin: '0 var(--basis) 0 0',
        }}
      />

      <FancyInput style={{ width: '100%' }}>
        {({ setError }) => (
          <UrlInput
            onError={setError}
            onChange={setUrl}
            onBlur={publishChanges}
            defaultValue={url}
            placeholder={getString('action_input_url_placeholder')}
            style={{
              margin: 'var(--basis) 0',
              width: '100%',
            }}
          />
        )}
      </FancyInput>
    </div>
  </div>
}

const InlineEditorBlockRedirect = withLocalization(InlineEditorBlockRedirectRaw)

export default InlineEditorBlockRedirect
