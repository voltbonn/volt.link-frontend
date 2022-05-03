import React from 'react'
import {
  Localized as LocalizedOriginal,
  // withLocalization,
} from '@fluent/react'
import { negotiateLanguages } from '@fluent/langneg'

import { FluentContext } from '../../node_modules/@fluent/react/esm/context.js'
import fluentBy from './fluentBy.js'

const Localized = props => (
  <LocalizedOriginal
    key={props.id}
    {...props}
    elems={{
      br: <br />,
      ...props.elems,
    }}
  >
    <React.Fragment>{props.children}</React.Fragment>
  </LocalizedOriginal>
)

// A custom withLocalization to have an empty fallback.
// It is nearly identical to the original.
function withLocalization(Inner) {
  function WithLocalization(props) {
    const l10n = React.useContext(FluentContext)

    const getString = (id, args, fallback) => l10n.getString(id, args, fallback || '')

    const fluentByObject = (object, fallback) => {
      if (!(!!fallback)) {
        fallback = null
      }

      if (!!object) {
        const globalSupportedLocales = l10n.supportedLocales || []
        const thisSupportedLocales = Object.keys(object).filter(locale => globalSupportedLocales.includes(locale))

        const currentLocales = negotiateLanguages(
          l10n.userLocales,
          thisSupportedLocales,
          { defaultLocale: l10n.defaultLocale }
        )

        for (const locale of currentLocales) {
          if (!!object[locale]) {
            return object[locale]
          }
        }

        return fallback
      }

      return fallback
    }

    return React.createElement(Inner, { fluentByObject, getString, ...props })
  }
  return WithLocalization
}


function translateBlock (block, userLocales, fallback) {

  const properties = block.properties || {}
  
  let locale = properties.locale || 'en'
  let text = properties.text || fallback || ''

  if (!userLocales || !Array.isArray(userLocales)) {
    userLocales = [locale]
  }
    
  let translations = properties.translations || []
  if (Array.isArray(translations)) {
    translations = [
      {
        locale,
        text,
      },
      ...translations,
    ]

    const correct_translations = fluentBy.fluentByArray(translations, userLocales, 'locale')
    if (correct_translations.length > 0) {
      text = correct_translations[0].text
    }
  }

  return text
}

function useLocalization() {
  const l10n = React.useContext(FluentContext)

  const getString = (id, args, fallback) => l10n.getString(id, args, fallback || ' ')
  const fluentByAny = (any = [], fallback = '') => fluentBy.fluentByAny(any, l10n.userLocales, fallback)

  return {
    ...l10n,
    userLocales: l10n.userLocales || [],
    getString,
    fluentByAny,
    translateBlock,
  }
}

export {
  negotiateLanguages,
  withLocalization,
  Localized,
  Localized as default,
  useLocalization,
}

/*

import { Localized, withLocalization } from '../Localized/'

<Localized id="translation_id" />
export default withLocalization(componentName)


import Localized from '../Localized/'
<Localized id="translation_id" />

import { withLocalization } from '@fluent/react'
export default withLocalization(componentName)

*/
