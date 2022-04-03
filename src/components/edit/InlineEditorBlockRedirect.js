import React, { useRef, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import {
  // AutoAwesomeSharp as ActionIcon,
  LinkSharp as RedirectIcon,
  ArrowForward as ToIcon,
} from '@mui/icons-material'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'
import PathInput from './PathInput.js'


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
    trigger = {},
    action = {}
  } = properties

  const textRef = useRef(properties.text || '')
  const text = textRef.current
  const setText = newValue => textRef.current = newValue

  const triggerPathRef = useRef(trigger.path || '')
  const triggerPath = triggerPathRef.current
  const setTriggerPath = newValue => triggerPathRef.current = newValue

  const linkRef = useRef(action.url || '')
  const link = linkRef.current
  const setLink = newValue => linkRef.current = newValue

  const publishChanges = useCallback(() => {
    if (onChange) {
      const text = textRef.current
      const triggerPath = triggerPathRef.current
      const link = linkRef.current

      const newBlock = {
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      }

      if (triggerPath === '') {
        if (newBlock.properties.hasOwnProperty('trigger')) {
          delete newBlock.properties.trigger
        }
      } else {
        newBlock.properties.trigger = {
          type: 'path',
          path: triggerPath,
        }
      }

      if (link === '') {
        if(newBlock.properties.hasOwnProperty('action')) {
          delete newBlock.properties.action
        }
      } else {
        newBlock.properties.action = {
				  type: 'open_url',
				  url: link,
			  }
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
      <RedirectIcon
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

    <div style={{ paddingInlineStart: 'var(--basis_x8)', width: '100%', display: 'flex', alignItems: 'center', }}>
      volt.link/
      <FancyInput style={{ width: '100%', marginInlineStart: 'var(--basis)' }}>
        {({ setError }) => (
          <PathInput
            onError={setError}
            onChange={setTriggerPath}
            onBlur={publishChanges}
            defaultValue={triggerPath}
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
            onChange={setLink}
            onBlur={publishChanges}
            type="text"
            defaultValue={link}
            placeholder={getString('path_editor_item_link_label')}
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
