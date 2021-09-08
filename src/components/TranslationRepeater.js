import React from 'react'

import { withLocalization } from '../fluent/Localized.js'

import Repeater from '../components/Repeater.js'
import InputWithLocal from '../components/InputWithLocal.js'

function TranslationRepeaterRaw ({ onChange, defaultValue, addDefaultValue, addButtonText, style, input }) {
  return <Repeater
    onChange={onChange}
    defaultValue={defaultValue}
    addDefaultValue={addDefaultValue}
    addButtonText={addButtonText}
    style={style}
    render={
      ({ defaultValue, ...repeater_props }) => {
        const locale = defaultValue.locale
        const value = defaultValue.value
        return <InputWithLocal
          locale={locale}
          defaultValue={value}
          style={{
            maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
          }}
          {...repeater_props}
        >
          {InputWithLocal_props => input(InputWithLocal_props)}
        </InputWithLocal>
      }
    }
  />
}


const TranslationRepeater = withLocalization(TranslationRepeaterRaw)

export default TranslationRepeater
