import React, { useState, useCallback, useRef } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { Menu, MenuItem, Divider, ListItemIcon, ListItemText, List, ListSubheader } from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Link as LinkIcon,
  Title as TitleIcon,
  Notes as NotesIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { Localized, withLocalization } from '../fluent/Localized.js'
import MultiButton from '../components/MultiButton.js'
import UrlInput from '../components/UrlInput.js'
import HtmlInput from '../components/HtmlInput.js'
import FancyInput from '../components/FancyInput.js'
import TranslationRepeater from '../components/TranslationRepeater.js'

import classes from './EditorBlock.module.css'

function RowMenu (props) {

  const {
    type,
    getString,
    handleChange_Type,
    toggle_active,
    active,
    onRemoveRow,
    closeMenu,
    ...rest
  } = props

  return <Menu
                {...rest}
                MenuListProps={{
                  style:{
                    width: '100%',
                    maxWidth: '100%',
                  }
                }}
              >
                <List
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    marginTop: '-8px',
                  }}
                >
                  <ListSubheader style={{
                    whiteSpace:'nowrap',
                    background:'transparent',
                    lineHeight: '1',
                    margin: '0',
                    padding: '8px 16px 12px 16px',
                  }}>
                    <Localized id="path_editor_item_choose_type_label" />
                  </ListSubheader>
                  {
                    [
                      { value: 'link', icon: <LinkIcon />, title: getString('path_editor_item_choose_type_value_link') },
                      { value: 'headline', icon: <TitleIcon />, title: getString('path_editor_item_choose_type_value_headline') },
                      // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
                      { value: 'text', icon: <NotesIcon />, title: getString('path_editor_item_choose_type_value_text') }
                    ]
                    .map((option, index) => (
                      <MenuItem
                        key={option.value}
                        selected={option.value === type}
                        onClick={() => handleChange_Type(option.value)}
                      >
                        <ListItemIcon>
                          {option.icon}
                        </ListItemIcon>
                        <ListItemText>
                          {option.title}
                        </ListItemText>
                      </MenuItem>
                  ))}
                </List>

                <Divider style={{opacity: 0.2}} />

                <MenuItem style={{marginTop:'8px'}} onClick={toggle_active}>
                  <ListItemIcon>
                    {
                      active
                      ? <VisibilityOffIcon />
                      : <VisibilityIcon />
                    }
                  </ListItemIcon>
                  <ListItemText>
                    {
                      active
                      ? <Localized id="path_editor_item_hide_row" />
                      : <Localized id="path_editor_item_show_row" />
                    }
                  </ListItemText>
                </MenuItem>

                <MenuItem style={{marginTop:'8px'}} onClick={onRemoveRow}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Localized id="path_editor_item_delete" />
                  </ListItemText>
                </MenuItem>

                <Divider style={{opacity: 0.2}} />

                <MenuItem style={{marginTop:'8px'}} onClick={closeMenu}>
                  <ListItemIcon>
                    <CloseIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Localized id="path_editor_item_close_menu" />
                  </ListItemText>
                </MenuItem>
              </Menu>
}

function EditorBlockRaw({ fluentByObject, getString, item, className, onChange, reorderHandle, onRemoveRow, actionButton, dataset = {} }) {
  const defaultLocale = getString('default_locale')

  const wrapperDiv = useRef(null)

  const [type, setType] = useState(item.type || null)
  const [title, setTitle] = useState(item.title || [])
  const [text, setText] = useState(item.text || [])
  const [link, setLink] = useState(item.link || '')
  const [active, setActive] = useState(typeof item.active === 'boolean' ? item.active : true)

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

  const toggle_active = useCallback(() => {
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
    {...dataset}
  >
    {
      !!type
        ? null
        : <>
            <p style={{
              marginBottom: 'var(--basis)'
            }}>
              <Localized id="path_editor_item_choose_type_label" />
            </p>
            <span className="hideOnScreenSmallerThan1200px">
              <MultiButton
                className={active ? classes.form_active : classes.form_deactivated}
                onChange={handleChange_Type}
                ariaLabel="Use as"
                defaultValue={type}
                items={[
                  { value: 'link', icon: <LinkIcon className="icon" />, title: getString('path_editor_item_choose_type_value_link') },
                  { value: 'headline', icon: <TitleIcon className="icon" />, title: getString('path_editor_item_choose_type_value_headline') },
                  // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
                  { value: 'text', icon: <NotesIcon className="icon" />, title: getString('path_editor_item_choose_type_value_text') }
                  // { value: 'link', icon: <SVG src={icon_link} className="icon" />, title: getString('path_editor_item_choose_type_value_link') },
                  // { value: 'headline', icon: <SVG src={icon_title} className="icon" />, title: getString('path_editor_item_choose_type_value_headline') },
                  // // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
                  // { value: 'text', icon: <SVG src={icon_notes} className="icon" />, title: getString('path_editor_item_choose_type_value_text') }
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
                  { value: 'link', icon: <LinkIcon className="icon" /> },
                  { value: 'headline', icon: <TitleIcon className="icon" /> },
                  // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
                  { value: 'text', icon: <NotesIcon className="icon" /> }
                ]}
              />
            </span>
          </>
    }

    <div className={classes.itemSettingsRow}>
      <div className={classes.itemSettingsRowLeft}>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <>
              <div {...bindTrigger(popupState)} style={{ cursor: 'pointer' }}>
                {reorderHandle}

                <button className="text" style={{
                  marginLeft: 'calc(-1 * var(--basis_x2))',
                  marginBottom: 'var(--basis_x0_5)',
                  verticalAlign: 'middle',
                }}>
                  {getString('path_editor_item_choose_type_value_'+type)}
                  <KeyboardArrowDownIcon
                    style={{
                      verticalAlign: 'middle',
                      marginBottom: 'var(--basis)',
                    }}
                  />
                </button>
              </div>
              <RowMenu
                {...bindMenu(popupState)}
                {...{
                  type,
                  getString,
                  handleChange_Type,
                  toggle_active,
                  active,
                  onRemoveRow,
                  closeMenu: popupState.close,
                }}
              />
            </>
          )}
        </PopupState>
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
