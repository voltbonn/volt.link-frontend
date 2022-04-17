import React, { useState, useEffect, useCallback } from 'react'

import CheckboxInput from './CheckboxInput.js'

import { withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import HtmlInput from './HtmlInput.js'

function InlineEditorBlockTextRaw({
  getString,
  block = {},
  onChange,
  onSaveBlock,
  saveProperty,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeFromNextInput,

  onAddRowAfter,
}) {
  const properties = block.properties || {}
  const [text, setText] = useState('')

  useEffect(() => {
    setText(properties.text || '')
  }, [properties.text, setText])

  const publishTextChange = useCallback(() => {
    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text,
        },
      })
    }
  }, [onChange, block, text])

  let text_style_class = 'type_p'
  if (properties.hasOwnProperty('text_style')) {
    if (properties.text_style === 'text') {
      text_style_class = 'type_p'
    } else {
      text_style_class = 'type_'+properties.text_style
    }
  }

  const {
    color,
  } = getBlockColor(block)

  const colorStyles = {}
  if (color) {
    colorStyles.color = color
  }



  const toggleChecked = useCallback(newCheckedValue => {
    saveProperty('checked', newCheckedValue)
  }, [saveProperty])

  let {
    text_decorations = [],
    checked,
  } = properties
  if (!Array.isArray(text_decorations)) {
    text_decorations = []
  }
  if (typeof checked !== 'boolean') {
    checked = false
  }

  const prefixes = []

  if (text_decorations.includes('checkbox')) {
    const checkbox_component = <CheckboxInput
      key='checkbox'
      defaultValue={checked}
      onChange={toggleChecked}
      style={{
        margin: 'var(--basis_x0_2) var(--basis) 0 0',
        height: 'var(--prefix-icon-size)',
        width: 'var(--prefix-icon-size)',
      }}
    />
    prefixes.push(checkbox_component)
  }



  return <div className={text_style_class} style={{
    display: 'flex',
  }}>
    <div>
      {prefixes}
    </div>
    <HtmlInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishTextChange}

      placeholder={getString('placeholder_text')}
      style={{
        ...colorStyles,
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
      }}
      linebreaks={true}
      className={`hide_border`}

      onInputRef={onInputRef}
      onGoToPrevInput={onGoToPrevInput}
      onGoToNextInput={onGoToNextInput}
      onMergeToPrevInput={() => onMergeToPrevInput(block)}
      onMergeFromNextInput={() => onMergeFromNextInput(block)}
      onSplitText={onSplitText}
    />
  </div>
}

const InlineEditorBlockText = withLocalization(InlineEditorBlockTextRaw)

export default InlineEditorBlockText
