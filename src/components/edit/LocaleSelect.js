import { useState, useCallback } from 'react'

import {
  MenuItem,
} from '@mui/material'

import PopoverMenu from '../PopoverMenu.js'

import MdiIcon from '@mdi/react'
import {
  mdiTranslate,
} from '@mdi/js'

const locales = {
  _: '??',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands', // Dutch
  da: 'Dansk', // Danish
  sv: 'Svenska', // Swedish
  nb: 'Norsk bokmål', // Norwegian
  fi: 'Suomi', // Finish
  se: 'davvisámegiella (Northern Sami)', // Northern Sami
  mt: 'Malti', // Maltese
  pl: 'Język polski', // Polish
  ru: 'русский язык', // Russian
  bg: 'български език', // Bulgarian
  tr: 'Türkçe',
  ar: 'اَلْعَرَبِيَّة', // Arabic
  el: 'ελληνικά', // Greek
  ro: 'limba română', // Romanian
  sl: 'slovenščina', // Slovenian
  // uk: 'украї́нська мо́ва', // Ukrainian
  // cy: 'Cymraeg', // Welsh
}

const localesArray = Object.entries(locales)
.map(([code, nativeName]) => ({code, nativeName}))

const defaultOptions = Object.keys(locales)

function LocaleSelect({
  defaultValue,
  onChange,
  options = defaultOptions,
}) {
  if (
    defaultValue === null
    || defaultValue === undefined
    || defaultValue === ''
    || locales.hasOwnProperty(defaultValue) === false
  ) {
    defaultValue = '_'
  }

  const [changedLocale, setChangedLocale] = useState(defaultValue)

  const handleLocaleChange = useCallback(newLocale => {
    setChangedLocale(newLocale)
    
    if (newLocale === '_') {
      newLocale = null
    }

    if (onChange) {
      onChange(newLocale)
    }
  }, [ setChangedLocale, onChange ])
  
  return (
    <PopoverMenu
      trigger={(triggerProps, { isOpen }) => (
        <button
          {...triggerProps}
          className="default hasIcon"
          style={{
            margin: '0',
            flexShrink: '0',
          }}
        >
          <span style={{ width: '100%', textAlign: 'start' }}>
          {
            changedLocale === '_'
            ? <MdiIcon
              path={mdiTranslate}
              className="icon"
            />
            : changedLocale.toUpperCase()
          }
          </span>
          <span style={{
            marginLeft: 'var(--basis)',
            lineHeight: '1',
            verticalAlign: 'text-top',
          }}>
            { isOpen ? '▴' : '▾' }
          </span>
        </button>
      )}
      paperProps={{
        sx: {
          maxHeight: '300px',
        }
      }}
    >
      {({ close }) => (
        <div style={{
          padding: 'var(--basis_x2) 0',
        }}>
          {
            localesArray
            .filter(({ code }) => options.includes(code))
            .map(({ code, nativeName }) => (
              <MenuItem
                key={code}
                onClick={() => {
                  handleLocaleChange(code)
                  close()
                }}
                className="roundMenuItem"
                selected={code === changedLocale}
              >
                {code === '_' ? nativeName : `${code.toUpperCase()} — ${nativeName}`}
              </MenuItem>
            ))
          }
        </div>
      )}
    </PopoverMenu>    
  )
}

export default LocaleSelect
