import React from 'react'
import {
  Localized as LocalizedOriginal,
  // withLocalization,
} from '@fluent/react'
import { negotiateLanguages } from '@fluent/langneg'

import { FluentContext } from '../../node_modules/@fluent/react/esm/context.js'

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

    const getString = (id, args, fallback) => l10n.getString(id, args, fallback || ' ')

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

export {
  withLocalization,
  Localized,
  Localized as default,
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
