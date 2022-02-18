import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

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
    action = {}
  } = properties
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
    padding: 'var(--basis) 0',
  }}>
    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}

      placeholder={getString('placeholder_button')}
      style={{ margin: '0' }}
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
}

const InlineEditorBlockButton = withLocalization(InlineEditorBlockButtonRaw)

export default InlineEditorBlockButton
