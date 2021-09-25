import React, { useState, useCallback } from 'react'

import { withLocalization } from '../fluent/Localized.js'

// import { v4 as uuidv4 } from 'uuid'

import HtmlInput from '../components/HtmlInput.js'
// import TranslationRepeater from '../components/TranslationRepeater.js'

function InlineEditorBlockTextRaw({
  getString,
  block = {},
  onChange,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,
}) {
  // const defaultLocale = getString('default_locale')

  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])

  const currentLocale = 'en'
  let currentText = text
  .filter(t => t.locale === currentLocale)
  if (text.length > 0) {
    currentText = text[0].value
  } else {
    currentText = ''
  }

  // const handleChange = useCallback(rows => {
  //   const newValue = rows
  //   setText(newValue)
  //
  //   if (onChange) {
  //     onChange({
  //       ...block,
  //       properties: {
  //         ...block.properties,
  //         text: newValue,
  //       },
  //     })
  //   }
  // }, [setText, onChange, block])

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

  const handleSplitText = useCallback(()=>{
    if (onSplitText) {
      // const newValue = text
      //   .map(t => {
      //     if (t.locale === currentLocale) {
      //       t.value = newTextValue
      //     }
      //     return t
      //   })

      onSplitText(block)
    }
  }, [onSplitText, block])

  const handleMergeToPrevInput = useCallback(()=>{
    if (onMergeToPrevInput) {
      onMergeToPrevInput(block)
    }
  }, [onMergeToPrevInput, block])

  const handleMergeToNextInput = useCallback(()=>{
    if (onMergeToNextInput) {
      onMergeToNextInput(block)
    }
  }, [onMergeToNextInput, block])

  return <HtmlInput
    placeholder={getString('placeholder_text')}
    defaultValue={currentText}
    onBlur={handleTextChange}
    style={{ margin: '0' }}
    linebreaks={true}
    className="hide_border type_text"

    onInputRef={onInputRef}
    onGoToPrevInput={onGoToPrevInput}
    onGoToNextInput={onGoToNextInput}
    onSplitText={handleSplitText}
    onMergeToPrevInput={handleMergeToPrevInput}
    onMergeToNextInput={handleMergeToNextInput}
  />
}

const InlineEditorBlockText = withLocalization(InlineEditorBlockTextRaw)

export default InlineEditorBlockText

/*
return <TranslationRepeater
    onChange={handleChange}
    defaultValue={text}
    addDefaultValue={() => ({ tmp_id: uuidv4(), locale: defaultLocale, value: '' })}
    addButtonText={getString('path_editor_add_translation')}
    input={InputWithLocal_props => {
      const { onChange, ...InputWithLocal_rest } = InputWithLocal_props
      return <HtmlInput
        placeholder={getString('placeholder_text')}
        {...InputWithLocal_rest}
        onBlur={onChange}
        style={{ ...InputWithLocal_props.style, margin: '0' }}
        linebreaks={true}
        className="hide_border type_text"
      />
    }}
  />
*/
