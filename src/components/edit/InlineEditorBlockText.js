import React, { useState, useEffect, useCallback } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

// import { v4 as uuidv4 } from 'uuid'

import HtmlInput from './HtmlInput.js'
import TranslatedInput from './TranslatedInput.js'
// import TranslationRepeater from '../TranslationRepeater.js'

function InlineEditorBlockTextRaw({
  getString,
  block = {},
  onChange,
  onSaveBlock,

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  // onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,

  onAddRowAfter,
}) {
  // const defaultLocale = getString('default_locale')
  // const currentLocale = 'en'

  const properties = block.properties || {}
  const [text, setText] = useState([])
  // const [key, setKey] = useState(0)

  useEffect(() => {
    setText(properties.text || [])
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

  // const handleSplitText = useCallback(({ texts })=>{
  //   if (onAddRowAfter) {
  //     let firstNewTextValue = text
  //     if (text.length > 0) {
  //       if (firstNewTextValue.findIndex(t => t.locale === currentLocale) > -1) {
  //         firstNewTextValue = firstNewTextValue.map(t => {
  //           if (t.locale === currentLocale) {
  //             return {
  //               ...t,
  //               value: texts[0],
  //             }
  //           }
  //           return t
  //         })
  //       } else {
  //         firstNewTextValue = [
  //           ...firstNewTextValue,
  //           {locale: currentLocale, value: texts[0]},
  //         ]
  //       }
  //     } else {
  //       firstNewTextValue = [{locale: currentLocale, value: texts[0]}]
  //     }
  //
  //     // const firstBlock = {
  //     //   ...block,
  //     //   properties: {
  //     //     ...block.properties,
  //     //     text: firstNewTextValue,
  //     //   },
  //     // }
  //
  //     const secondBlock = {
  //       type: block.type,
  //       properties: {
  //         text: [{
  //           locale: currentLocale,
  //           value: texts[1],
  //         }],
  //       },
  //     }
  //
  //     setText(firstNewTextValue)
  //     setKey(key + 1)
  //
  //     onSaveBlock(secondBlock, blockId => {
  //       onAddRowAfter({
  //         blockId,
  //       })
  //     })
  //   }
  // }, [key, setKey, setText, onSaveBlock, onAddRowAfter, block, text, currentLocale])

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

  return <TranslatedInput
    defaultValue={text}
    onChange={setText}
    onBlur={publishTextChange}
    // key={key}
  >
    {(translatedInputProps) => {
      return (
      <HtmlInput
        placeholder={getString('placeholder_text')}
        style={{ margin: '0' }}
        linebreaks={true}
        className="hide_border type_text"

        onInputRef={onInputRef}
        onGoToPrevInput={onGoToPrevInput}
        onGoToNextInput={onGoToNextInput}
        onMergeToPrevInput={handleMergeToPrevInput}
        onMergeToNextInput={handleMergeToNextInput}
        // onSplitText={handleSplitText}

        {...translatedInputProps}
      />
      )
    }
    }
  </TranslatedInput>
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
