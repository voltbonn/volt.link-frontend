import { useState, useCallback, useRef } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { Localized, withLocalization } from '../fluent/Localized.js'
import MultiButton from '../components/MultiButton.js'
import SVG from 'react-inlinesvg'
import UrlInput from '../components/UrlInput.js'
import HtmlInput from '../components/HtmlInput.js'
import FancyInput from '../components/FancyInput.js'
import TranslationRepeater from '../components/TranslationRepeater.js'

import classes from './EditorBlock.module.css'

import { Visibility, VisibilityOff } from '@material-ui/icons'

import icon_link from '../images/link_24dp.svg'
import icon_title from '../images/title_24dp.svg'
import icon_notes from '../images/notes_24dp.svg'

function EditorBlockRaw({ fluentByObject, getString, item, className, onChange, reorderHandle, actionButton, ...props }) {
  const defaultLocale = getString('default_locale')

  const wrapperDiv = useRef(null)

  const [type, setType] = useState(item.type || null)
  const [title, setTitle] = useState(item.title || [])
  const [text, setText] = useState(item.text || [])
  const [link, setLink] = useState(item.link || '')
  const [active, setActive] = useState(item.active || true)

  const handleChange_Type = useCallback(newValue => {
    setType(newValue)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type: newValue, title, text, link, active }
      onChange({ target })
    }
  }, [setType, onChange, title, text, link, active])

  const handleChange_Text = useCallback(rows => {
    const newValue = rows
      if (type === 'text') {
    setText(newValue)
      } else {
        setTitle(newValue)
      }

    if (onChange) {
      const target = wrapperDiv.current
      if (type === 'text') {
        target.value = { type, title, text: newValue, link, active }
      } else {
        target.value = { type, title: newValue, text, link, active }
      }
      onChange({ target })
    }
  }, [setText, setTitle, onChange, type, title, text, link, active])

  const handleChange_Link = useCallback(newValue => {
    setLink(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title, text, link: newValue, active }
      onChange({ target })
    }
  }, [setLink, onChange, type, title, text, active])

  const toggle_Active = useCallback(() => {
    const newValue = !active
    setActive(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title, text, link, active: newValue }
      onChange({ target })
    }
  }, [setActive, onChange, type, title, text, link, active])

  let type_classname = ''
  switch (type) {
    case 'text':
      type_classname = 'type_text'
      break
    case 'headline':
      type_classname = 'type_h2'
      break
    case 'headline3':
      type_classname = 'type_h3'
      break
    case 'link':
      type_classname = 'type_text' // 'type_button'
      break
    default:
      type_classname = 'type_text'
  }

  return <div
    ref={wrapperDiv}
    className={`${classes.block} ${!!type ? '' : classes.chooseTypeScreen} ${className}`}
    {...props }
  >
    {
      !!type
        ? null
        : <p style={{
            marginBottom: 'var(--basis)'
          }}><Localized id="path_editor_item_choose_type_label" /></p>
    }

    <div className={classes.itemSettingsRow}>
      <div className={classes.itemSettingsRowLeft}>
      {reorderHandle}

      {
        !!type
        ? <label className={classes.active_toggle_wrapper}>
            <button onClick={toggle_Active} className={active ? 'text' : 'red'}>{
              active
                ? <><Visibility className={`${classes.active_toggle_icon} ${classes.active}`} /> <span className="hideOnSmallScreen"><Localized id="path_editor_item_active" /></span></>
                : <><VisibilityOff className={classes.active_toggle_icon} /> <span className="hideOnSmallScreen"><Localized id="path_editor_item_not_active" /></span></>
            }</button>
          </label>
        : null
      }

      <span className="hideOnScreenSmallerThan1200px">
        <MultiButton
          className={active ? classes.form_active : classes.form_deactivated}
          onChange={handleChange_Type}
          ariaLabel="Use as"
          defaultValue={type}
          items={[
            { value: 'link', icon: <SVG src={icon_link} className="icon" />, title: getString('path_editor_item_choose_type_value_link') },
            { value: 'headline', icon: <SVG src={icon_title} className="icon" />, title: getString('path_editor_item_choose_type_value_headline') },
            // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
            { value: 'text', icon: <SVG src={icon_notes} className="icon" />, title: getString('path_editor_item_choose_type_value_text') }
          ]}
        />
      </span>
      <span className="hideOnScreenBiggerThan1200px">
        <MultiButton
          className={active ? classes.form_active : classes.form_deactivated}
          onChange={handleChange_Type}
          ariaLabel="Use as"
          defaultValue={type}
          items={[
            { value: 'link', icon: <SVG src={icon_link} className="icon" /> },
            { value: 'headline', icon: <SVG src={icon_title} className="icon" /> },
            // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
            { value: 'text', icon: <SVG src={icon_notes} className="icon" /> }
          ]}
        />
      </span>
      </div>

      {actionButton}
    </div>

    <span className={active ? classes.form_active : classes.form_deactivated}>
    {
      !!type
        ? <>
          {
            type === 'text'
            ? <p><Localized id="path_editor_item_text_info" /></p>
            : null
          }

          <TranslationRepeater
            onChange={handleChange_Text}
            defaultValue={type === 'text' ? text : title}
            addDefaultValue={() => ({ _id: uuidv4(), locale: defaultLocale, value: '' })}
            addButtonText={getString('path_editor_add_translation')}
            style={{
              marginTop: 'var(--basis_x2)'
            }}
            input={InputWithLocal_props => <HtmlInput
              placeholder={
                type === 'text'
                ? getString('path_editor_item_text_label')
                : getString('path_editor_item_title_label')
              }
              {...InputWithLocal_props}
              style={{ ...InputWithLocal_props.style, margin: '0' }}
              linebreaks={ type === 'text' }
              className={type_classname}
            />}
          />

          {
            type === 'link'
              ? <FancyInput>
                {({ setError }) => (
                  <UrlInput
                    onError={setError}
                    onChange={handleChange_Link}
                    type="text"
                    defaultValue={link}
                    placeholder={getString('path_editor_item_link_label')}
                    style={{
                      marginRight: '0',
                      marginBottom: '0',
                      marginLeft: '0',
                      width: 'calc(100% - var(--basis_x2))',
                    }}
                  />
                )}
              </FancyInput>
              : null
          }
        </>
        : null
    }
    </span>
  </div>
}

const EditorBlock = withLocalization(EditorBlockRaw)

export default EditorBlock
