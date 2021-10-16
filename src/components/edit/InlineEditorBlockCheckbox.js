import React, { useState, useCallback, useRef } from 'react'

import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material'

import { withLocalization } from '../../fluent/Localized.js'

import HtmlInput from './HtmlInput.js'
import TranslatedInput from './TranslatedInput.js'

function InlineEditorBlockCheckboxRaw({
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
  const checked = useRef(Boolean(properties.checked))

  const publishChanges = useCallback(() => {
    if (onChange) {
      onChange({
        ...block,
        properties: {
          ...block.properties,
          text,
          checked: checked.current,
        },
      })
    }
  }, [onChange, block, text])

  const checkBlock = useCallback(() => {
    checked.current = true
    publishChanges()
  }, [ publishChanges ])

  const uncheckBlock = useCallback(() => {
    checked.current = false
    publishChanges()
  }, [ publishChanges ])

  const checkboxStyle = {
    verticalAlign: 'middle',
    padding: 'var(--basis)',
    cursor: 'pointer',
  }

  return <div style={{
    padding: 'var(--basis) 0',
    display: 'flex',
  }}>
    {
      checked.current
      ? <CheckBoxIcon style={checkboxStyle} onClick={uncheckBlock} />
      : <CheckBoxOutlineBlankIcon style={checkboxStyle} onClick={checkBlock} />
    }

    <TranslatedInput
      defaultValue={text}
      onChange={setText}
      onBlur={publishChanges}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
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

          {...translatedInputProps}
        />
        )
      }
      }
    </TranslatedInput>
  </div>
}

const InlineEditorBlockCheckbox = withLocalization(InlineEditorBlockCheckboxRaw)

export default InlineEditorBlockCheckbox
