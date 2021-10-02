import React, { useState, useCallback } from 'react'

import { withLocalization } from '../fluent/Localized.js'

// import { v4 as uuidv4 } from 'uuid'

import HtmlInput from '../components/HtmlInput.js'
// import TranslationRepeater from '../components/TranslationRepeater.js'

function InlineEditorBlockTextRaw({
  getString,
  block = {},
  onChange,
  onSaveBlock,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,

  onAddRowAfter,
}) {
  // const defaultLocale = getString('default_locale')

  const properties = block.properties || {}
  const [text, setText] = useState(properties.text || [])
  const [key, setKey] = useState(0)

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
    let newValue = [...text]
    if (text.length > 0) {
      if (newValue.findIndex(t => t.locale === currentLocale) > -1) {
        newValue = newValue.map(t => {
          if (t.locale === currentLocale) {
            t.value = newTextValue
          }
          return t
        })
      } else {
        newValue = [
          ...newValue,
          {locale: currentLocale, value: newTextValue},
        ]
      }
    } else {
      newValue = [{locale: currentLocale, value: newTextValue}]
    }

    setText(newValue)
  }, [setText, text, currentLocale])

  const publishTextChange = useCallback(newTextValue => {
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

  const handleSplitText = useCallback(({ texts })=>{
    if (onAddRowAfter) {
      let firstNewTextValue = text
      if (text.length > 0) {
        if (firstNewTextValue.findIndex(t => t.locale === currentLocale) > -1) {
          firstNewTextValue = firstNewTextValue.map(t => {
            if (t.locale === currentLocale) {
              t.value = texts[0]
            }
            return t
          })
        } else {
          firstNewTextValue = [
            ...firstNewTextValue,
            {locale: currentLocale, value: texts[0]},
          ]
        }
      } else {
        firstNewTextValue = [{locale: currentLocale, value: texts[0]}]
      }

      // const firstBlock = {
      //   ...block,
      //   properties: {
      //     ...block.properties,
      //     text: firstNewTextValue,
      //   },
      // }

      const secondBlock = {
        type: block.type,
        properties: {
          text: [{
            locale: currentLocale,
            value: texts[1],
          }],
        },
      }

      setText(firstNewTextValue)
      setKey(key + 1)

      onSaveBlock(secondBlock, blockId => {
        onAddRowAfter({
          blockId,
        })
      })
    }
  }, [key, setKey, setText, onSaveBlock, onAddRowAfter, block, text, currentLocale])

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
    key={key}
    placeholder={getString('placeholder_text')}
    defaultValue={currentText}
    onChange={handleTextChange}
    onBlur={publishTextChange}
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
