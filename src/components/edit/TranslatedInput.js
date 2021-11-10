import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react'

import { Localized, useLocalization } from '../../fluent/Localized.js'
import { fluentByArray } from '../../fluent/fluentBy.js'

import {
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  List,
  ListSubheader,
} from '@mui/material'

import {
  CloseSharp as CloseIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
} from '@mui/icons-material'

import Popover from '../Popover.js'

import classes from './TranslatedInput.module.css'

const TranslatedInputContext = createContext({
  locale: 'en',
  showTranslations: false,
})


function TranslatedInputProvider({ children }) {
  const {
    userLocales = [],
    defaultLocale = 'en',
  } = useLocalization()

  const thisDefaultLocale = (!!userLocales[0] ? userLocales[0] : defaultLocale)

  const [locales, setLocales] = useState([thisDefaultLocale])
  const [currentLocale, setCurrentLocale] = useState(thisDefaultLocale)

  const setLocalesCallback = useCallback(newLocales => {
    if (Array.isArray(newLocales)) {
      setLocales(newLocales)
      if (currentLocale === null && newLocales.length > 0) {
        setCurrentLocale(newLocales[0])
      }
    }
  }, [
    currentLocale,
    setLocales,
    setCurrentLocale,
  ])

  const filterByLocale = useCallback(textArray => {
    const filtered = fluentByArray(textArray, locales, 'locale')

    if (Array.isArray(filtered)) {
      return filtered
    }

    return []
  }, [
    locales,
  ])

  const [showTranslations, setShowTranslations] = useState(false)

  const toggleShowTranslations = useCallback(() => {
    setShowTranslations(oldShowTranslations => !oldShowTranslations)
  }, [ setShowTranslations ])

  const setCurrentLocaleExternal = useCallback(newLocale => {
    setCurrentLocale(newLocale)
    setShowTranslations(true)
  }, [ setCurrentLocale, setShowTranslations ])

  return (
    <TranslatedInputContext.Provider value={{
      currentLocale,
      setCurrentLocale: setCurrentLocaleExternal,
      locales,
      setLocales: setLocalesCallback,
      filterByLocale,
      showTranslations,
      toggleShowTranslations,
    }}>
      {children}
    </TranslatedInputContext.Provider>
  )
}

function useTranslatedInputContext() {
  return useContext(TranslatedInputContext)
}

function LocalesMenu({ trigger }) {
  const { getString } = useLocalization()

  const {
    locales,
    setLocales,
    currentLocale,
    setCurrentLocale,
    showTranslations,
    toggleShowTranslations,
  } = useTranslatedInputContext()

  const {
    supportedLocales = [],
  } = useLocalization()

  const setLocale = useCallback(newLocale => {
    if (typeof setCurrentLocale === 'function') {
      setCurrentLocale(newLocale)
    }
  }, [ setCurrentLocale ])

  const addLocale = useCallback(newLocale => {
    setLocales([...locales, newLocale])
    setLocale(newLocale)
  }, [
    locales,
    setLocales,
    setLocale,
  ])

  return <>
  <Popover trigger={trigger}>
    {({closePopover, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 380,
            height: 'auto',
            maxHeight: 'calc(100vh - 32px)',
            overflow: 'auto',
            background: 'var(--background-contrast)',
            color: 'var(--on-background)',
          }}
          elevation={8}
        >
          <MenuList
            autoFocus={true}
            style={{
              width: '100%',
              maxWidth: '100%',
              marginTop: '-8px',
            }}
          >
            <List
              style={{
                width: '100%',
                maxWidth: '100%',
                marginTop: '-8px',
              }}
            >
              <ListSubheader
                style={{
                  whiteSpace: 'nowrap',
                  lineHeight: '1',
                  margin: '-4px 0 0 0',
                  padding: '12px 16px 12px',
                  backgroundColor: 'var(--background-contrast)',
                  color: 'var(--on-background)',
                }}
              >
                {/* <Localized id="locale_menu_choose_locale_label" /> */}
                View in Locale…
              </ListSubheader>

              <div style={{height: '4px'}}></div>

              {
                locales
                .map((thisLocale, index) => (
                  <MenuItem
                    key={thisLocale}
                    selected={thisLocale === currentLocale}
                    onClick={() => setLocale(thisLocale)}
                  >
                    {getString('locale_'+thisLocale)}
                  </MenuItem>
              ))}
            </List>

            <Divider style={{opacity: 0.2}} />

            <List
              style={{
                width: '100%',
                maxWidth: '100%',
                // marginTop: '-8px',
              }}
            >
              <ListSubheader
                style={{
                  whiteSpace: 'nowrap',
                  lineHeight: '1',
                  margin: '-4px 0 0 0',
                  padding: '12px 16px 12px',
                  backgroundColor: 'var(--background-contrast)',
                  color: 'var(--on-background)',
                }}
              >
                {/* <Localized id="locale_menu_choose_locale_label" /> */}
                Add Locales
              </ListSubheader>

              {/* <div style={{height: '4px'}}></div> */}

              {
                supportedLocales
                .filter(locale => !locales.includes(locale))
                .map((thisLocale, index) => (
                  <MenuItem
                    key={thisLocale}
                    selected={thisLocale === currentLocale}
                    onClick={() => addLocale(thisLocale)}
                  >
                    {getString('locale_'+thisLocale)}
                  </MenuItem>
              ))}
            </List>

            <Divider style={{opacity: 0.2}} />

            <MenuItem style={{marginTop:'8px'}} onClick={toggleShowTranslations}>
              <ListItemIcon>
                {
                  showTranslations
                  ? <HideIcon />
                  : <ShowIcon />
                }
              </ListItemIcon>
              <ListItemText>
                {
                  showTranslations
                  ? <Localized id="locale_menu_hide_translation_help_label" />
                  : <Localized id="locale_menu_show_translation_help_label" />
                }
              </ListItemText>
            </MenuItem>

            <Divider style={{opacity: 0.2}} />

            <MenuItem style={{marginTop:'8px'}} onClick={closePopover}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText>
                <Localized id="block_menu_close_menu" />
              </ListItemText>
            </MenuItem>

          </MenuList>
        </Paper>
    )}
  </Popover>
  </>
}

function TranslatedInput({
  defaultValue,
  onChange,
  onBlur,
  children = null,
  style = {},
}) {
  const [arrayWithLocales, setArrayWithLocales] = useState([])

  useEffect(() => {
    if (Array.isArray(defaultValue)) {
      setArrayWithLocales(defaultValue)
    } else {
      setArrayWithLocales([])
    }
  }, [defaultValue, setArrayWithLocales])

  // useEffect(() => {
  //   if (defaultValue !== arrayWithLocales) {
  //     setArrayWithLocales(defaultValue)
  //   }
  // }, [ arrayWithLocales, defaultValue, setArrayWithLocales ])

  const {
    currentLocale,
    filterByLocale,
    showTranslations,
  } = useTranslatedInputContext()

  const notEmptyTexts = [...arrayWithLocales].filter(t => t.value !== '')
  let currentText = notEmptyTexts.filter(t => t.locale === currentLocale)
  if (currentText.length > 0) {
    currentText = currentText[0].value
  // } else if (notEmptyTexts.length > 0) {
  //   currentText = notEmptyTexts[0].value
  } else {
    currentText = ''
  }

  const handleChange = useCallback(newTextValue => {
    let newValue = [...arrayWithLocales]
    if (arrayWithLocales.length > 0) {
      if (newValue.findIndex(t => t.locale === currentLocale) > -1) {
        newValue = newValue
          .map(t => {
            if (t.locale === currentLocale) {
              return {
                ...t,
                value: newTextValue,
              }
            }
            return t
          })
          .filter(t => t.value !== '')
      } else {
        newValue = [
          ...newValue,
          {locale: currentLocale, value: newTextValue},
        ]
        .filter(t => t.value !== '')
      }
    } else {
      newValue = [{locale: currentLocale, value: newTextValue}]
    }

    setArrayWithLocales(newValue)

    if (onChange) {
      onChange(newValue)
    }
  }, [setArrayWithLocales, arrayWithLocales, currentLocale, onChange])

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(arrayWithLocales)
    }
  }, [onBlur, arrayWithLocales])

  const best = filterByLocale(arrayWithLocales.filter(t => t.locale !== currentLocale))

  if (typeof children === 'function') {
    return <div className={classes.translatedInput} style={style}>
      {/* <div className={classes.content}> */}
        <div style={{ flexGrow: '1', width: '100%' }}>
          {children({
            key: currentLocale,
            defaultValue: currentText,
            onChange: handleChange,
            onBlur: handleBlur,
          })}
        </div>
        {
          showTranslations === true && best.length > 0
            ? <div className={classes.translationHelp}>
                {
                  best
                  .map(t => <p key={t.locale}>
                    <strong>{t.locale.toUpperCase()}:</strong> {t.value}
                  </p>)
                }
              </div>
            : null
        }
      {/* </div> */}
      {/* {locales_menu} */}
    </div>
  }

  return null
}

export {
  LocalesMenu,
  TranslatedInputContext,
  TranslatedInputProvider,
  useTranslatedInputContext,
  TranslatedInput,
  TranslatedInput as default,
}
