import React, { useState, useCallback } from 'react'

import { withLocalization } from '../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import HtmlInput from '../components/HtmlInput.js'
import UrlInput from '../components/UrlInput.js'

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
  // const defaultLocale = getString('default_locale')

  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])
  const [link, setLink] = useState(properties.link || '')

  const currentLocale = 'en'
  let currentText = text
  .filter(t => t.locale === currentLocale)
  if (text.length > 0) {
    currentText = text[0].value
  } else {
    currentText = ''
  }

  const handleTextChange = useCallback(newTextValue => {
    const newValue = text
    .map(t => {
      if (t.locale === currentLocale) {
        t.value = newTextValue
      }
      return t
    })
    setText(newValue)

    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text: newValue,
        },
      })
    }
  }, [setText, onChange, block, text, currentLocale])

  const handleLinkChange = useCallback(newLinkValue => {
    setLink(newLinkValue)

    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          link: newLinkValue,
        },
      })
    }
  }, [setLink, onChange, block])

  return <div style={{
    padding: 'var(--basis) 0',
  }}>
    <HtmlInput
      placeholder={getString('placeholder_button')}
      defaultValue={currentText}
      onBlur={handleTextChange}
      style={{ margin: '0' }}
      linebreaks={true}
      className="hide_border type_button"

      onInputRef={onInputRef}
      onGoToPrevInput={onGoToPrevInput}
      onGoToNextInput={onGoToNextInput}
    />

    <FancyInput>
      {({ setError }) => (
        <UrlInput
          onError={setError}
          onChange={handleLinkChange}
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
