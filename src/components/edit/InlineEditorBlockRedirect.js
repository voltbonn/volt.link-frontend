import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import {
  // AutoAwesomeSharp as ActionIcon,
  LinkSharp as RedirectIcon,
  ArrowForward as ToIcon,
} from '@mui/icons-material'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'



function contrastingColor(color) {
  // source: https://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript
  // exact answer: https://stackoverflow.com/a/6511606/2387277
  // example: https://jsfiddle.net/thomasrosen/9njo6t7s/20/
  
  return (luma(color) >= 165) ? '000' : 'fff';
}
function luma(color) { 
  // color can be a hex string or an array of RGB values 0-255
  const rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
  return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}
function hexToRGBArray(color) {
  if (color.length === 3) {
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
  } else if (color.length !== 6) {
    throw(new Error('Invalid hex color: ' + color));
  }

  let rgb = [];
  for (var i = 0; i <= 2; i++) {
    rgb[i] = parseInt(color.substr(i * 2, 2), 16);
  }

  return rgb;
}



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
  const [text, setText] = useState(properties.text || '')
  const {
    trigger = {},
    action = {}
  } = properties
  const [triggerPath, setTriggerPath] = useState(trigger.path || '')
  const [link, setLink] = useState(action.url || '')

  const publishChanges = useCallback(() => {
    if (onChange) {
      const newBlock = {
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      }

      if (link === '') {
        if (newBlock.properties.hasOwnProperty('trigger')) {
          delete newBlock.properties.trigger
        }
        if(newBlock.properties.hasOwnProperty('action')) {
          delete newBlock.properties.action
        }
      } else {
        newBlock.properties.trigger = {
          type: 'click'
        }
        newBlock.properties.action = {
				  type: 'open_url',
				  url: link,
			  }
      }

      onChange(newBlock)
    }
  }, [onChange, block, text, link])

  return <div style={{
    ...style,
    margin: '0 0 var(--basis) 0',
    cursor: 'auto',
  }}
  className="clickable_card active"
  >
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', }}>
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
          <UrlInput
            onError={setError}
            onChange={setTriggerPath}
            onBlur={publishChanges}
            type="text"
            defaultValue={triggerPath}
            placeholder={getString('path_editor_item_link_label')}
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
