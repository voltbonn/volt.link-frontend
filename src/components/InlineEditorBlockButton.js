import React, { useState, useCallback } from 'react'

import { withLocalization } from '../fluent/Localized.js'

import { v4 as uuidv4 } from 'uuid'

import HtmlInput from '../components/HtmlInput.js'
import TranslationRepeater from '../components/TranslationRepeater.js'

function InlineEditorBlockButtonRaw({
  getString,
  block = {},
  onChange,
}) {
  const defaultLocale = getString('default_locale')

  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])

  const handleChange = useCallback(rows => {
    const newValue = rows
    setText(newValue)

    console.log('handleChange-block', block)

    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text: newValue,
        },
      })
    }
  }, [setText, onChange, block])

  return <TranslationRepeater
    onChange={handleChange}
    defaultValue={text}
    addDefaultValue={() => ({ tmp_id: uuidv4(), locale: defaultLocale, value: '' })}
    addButtonText={getString('path_editor_add_translation')}
    input={InputWithLocal_props => {
      const { onChange, ...InputWithLocal_rest } = InputWithLocal_props
      return <HtmlInput
        placeholder={getString('placeholder_button')}
        {...InputWithLocal_rest}
        onBlur={onChange}
        style={{ ...InputWithLocal_props.style, margin: '0' }}
        linebreaks={true}
        className="hide_border type_button"
      />
    }}
  />
}

const InlineEditorBlockButton = withLocalization(InlineEditorBlockButtonRaw)

export default InlineEditorBlockButton
