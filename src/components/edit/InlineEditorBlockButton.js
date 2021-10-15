import React, { useState, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import HtmlInput from './HtmlInput.js'
import UrlInput from './UrlInput.js'
import TranslatedInput from './TranslatedInput.js'

function InlineEditorBlockButtonRaw({
  getString,
  block = {},
  onChange,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  // onSplitText,
  // onMergeToPrevInput,
  // onMergeToNextInput,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])
  const [link, setLink] = useState(properties.link || '')

  const publishChanges = useCallback(() => {
    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text,
          link,
        },
      })
    }
  }, [onChange, block, text, link])

  return <div style={{
    padding: 'var(--basis) 0',
  }}>
    <TranslatedInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}
    >
      {(translatedInputProps) => {
        return (
        <HtmlInput
          placeholder={getString('placeholder_button')}
          style={{ margin: '0' }}
          linebreaks={true}
          className="hide_border type_button"

          onInputRef={onInputRef}
          onGoToPrevInput={onGoToPrevInput}
          onGoToNextInput={onGoToNextInput}

          {...translatedInputProps}
        />
        )
      }
      }
    </TranslatedInput>

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
            width: 'calc(100% - var(--basis_x2))',
          }}
        />
      )}
    </FancyInput>
  </div>
}

const InlineEditorBlockButton = withLocalization(InlineEditorBlockButtonRaw)

export default InlineEditorBlockButton