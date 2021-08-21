import { useState, useCallback, useRef, useEffect, useMemo } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  useParams
} from 'react-router-dom'

import { Visibility, VisibilityOff } from '@material-ui/icons'

import SVG from 'react-inlinesvg'
import layoutDefault from '../images/layout-default.svg'
import layoutPerson from '../images/layout-person.svg'
import icon_qr_code from '../images/qr_code_24pd.svg'
import icon_assessment from '../images/assessment_24dp.svg'
import icon_publish from '../images/publish_24dp.svg'
import icon_link from '../images/link_24dp.svg'
import icon_title from '../images/title_24dp.svg'
import icon_notes from '../images/notes_24dp.svg'

import plakatschlange_thumb from '../images/coverphotos/thumbs/20200912_Plakatschlange_Koeln_Matteo Sant_Unione_011.png'
import aktion_thumb from '../images/coverphotos/thumbs/Aktion.png'
import volt_bonn_thumb from '../images/coverphotos/thumbs/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.png'
import welcome_to_volt_thumb from '../images/coverphotos/thumbs/Welcome-to-Volt.png'

import classes from './Editor.module.css'
import { Localized, withLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'
import MultiButton from '../components/MultiButton.js'
import InputWithLocal from '../components/InputWithLocal.js'
import PermissionInput from '../components/PermissionInput.js'
import UrlInput from '../components/UrlInput.js'
import EmailInput from '../components/EmailInput.js'
import HtmlInput from '../components/HtmlInput.js'
import FancyInput from '../components/FancyInput.js'
import Repeater from '../components/Repeater.js'

function ItemRaw({ fluentByObject, getString, item, className, onChange, reorderHandle, actionButton, ...props }) {
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
    className={`${classes.item} ${!!type ? '' : classes.chooseTypeScreen} ${className}`}
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

      <span className="hideOnSmallScreen">
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
      <span className="hideOnBigScreen">
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

              <Repeater
                onChange={handleChange_Text}
                defaultValue={type === 'text' ? text : title}
                addDefaultValue={() => ({ _id: uuidv4(), locale: defaultLocale, value: '' })}
                addButtonText={getString('path_editor_add_translation')}
                style={{
                  marginTop: 'var(--basis_x2)'
                }}
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
                      {
                        InputWithLocal_props => <HtmlInput
                          placeholder={
                            type === 'text'
                            ? getString('path_editor_item_text_label')
                            : getString('path_editor_item_title_label')
                          }
                          {...InputWithLocal_props}
                          style={{ ...InputWithLocal_props.style, margin: '0' }}
                          linebreaks={ type === 'text' }
                          className={type_classname}
                        />
                      }
                    </InputWithLocal>
                  }
                }
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
const Item = withLocalization(ItemRaw)

function ItemsRaw({ getString, defaultValue, onChange }){
  const items = defaultValue

  return <Repeater
    onChange={onChange}
    defaultValue={items}
    addDefaultValue={() => ({ _id: uuidv4(), type: null, title: [], link: '', active: true })}
    addButtonText={getString('path_editor_add_row')}
    reorderLabel={getString('path_editor_reorder')}
    prependNewItems={true}
    isReorderable={true}
    showReorderControls={false}
    showActionButton={false}
    render={
      ({ defaultValue, ...repeater_props }) => {
        return <Item
          item={defaultValue}
          {...repeater_props}
        />
      }
    }
  />
}
const Items = withLocalization(ItemsRaw)

function addIds(array){
  if (Array.isArray(array)) {
    return array.map(item => {
      if (!item.hasOwnProperty('_id')) {
        item._id = uuidv4()
      }
      return item
    })
  }
  return array
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

function Editor({ getString }) {
  const defaultLocale = getString('default_locale')

  const { code } = useParams()
  const [{email = ''} = {}] = useUser() || []

  const [loadingContent, setLoadingContent] = useState(true)
  const [canEdit, setCanEdit] = useState(true)
  const [savingMessage, setSavingMessage] = useState(null)

  const [useAs, setUseAs] = useState('')
  const handleUseAsChange = useCallback(newValue => setUseAs(newValue), [setUseAs])

  const [layout, setLayout] = useState('')
  const handleLayoutChange = useCallback(newValue => setLayout(newValue), [setLayout])

  const [title, setTitle] = useState([])
  const handleChange_Title = useCallback(rows => setTitle(rows), [setTitle])

  const [description, setDescription] = useState([])

  const permissionsDefault = useMemo(() => (
      typeof email === 'string' && email.length > 0
      ? [{ _id: uuidv4(), value: email, role: 'editor' }, { _id: uuidv4(), value: '', role: 'editor' }]
      : []
  ), [email])
  const [permissions, setPermissions] = useState(permissionsDefault)
  const handleChange_Permissions = useCallback(rows => {
    const filled_rows_length = rows
      .filter(p =>
        p.value !== ''
        && p.value !== '@volteuropa.org'
        && (!p.role || p.role === 'editor')
      )
      .length

    if (filled_rows_length === 0) {
      rows.unshift({ _id: uuidv4(), value: email, role: 'editor' })
    }

    setPermissions(rows)
    return rows
  }, [setPermissions, email])

  const [viewPermission, setViewPermission] = useState(permissionsDefault)

  const [coverphoto, setCoverphoto] = useState('')
  const [imprintOverwrite, setImprintOverwrite] = useState('')
  const [privacyPolicyOverwrite, setPrivacyPolicyOverwrite] = useState('')
  const [redirect, setRedirect] = useState('')

  const [items, setItems] = useState([])
  const handleChange_Items = useCallback(rows => setItems(rows), [setItems])

  useEffect(() => {
    setCanEdit(true)
    setLoadingContent(true)

    fetch(`${window.domains.backend}get/${code}`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (typeof data.error === 'string') {
          if (data.error === 'no_edit_permission') {
            setLoadingContent(false)
            setCanEdit(false)
          }
        }else{
          let {
            use_as: useAs = '',
            layout = (code.includes('.') ? 'person' : 'default'),
            title = [],
            description = [],
            permissions = permissionsDefault,
            redirect = '',
            coverphoto = '',
            overwrites = {},
            items = [],
          } = data

          const {
            imprint = '',
            privacy_policy = ''
          } = overwrites

          title = addIds(title)
          description = addIds(description)
          items = items.map(item => {
            if (!item.hasOwnProperty('_id')) {
              item._id = uuidv4()
            }
            if (item.hasOwnProperty('title')) {
              item.title = addIds(item.title)
            }
            if (item.hasOwnProperty('description')) {
              item.description = addIds(item.description)
            }
            return item
          })

          let viewPermissionTmp = permissions.filter(p => p.role === 'viewer')
          viewPermissionTmp = viewPermissionTmp.length > 0 ? viewPermissionTmp[0].value : ''

          setUseAs(useAs)
          setLayout(layout)
          setTitle(title)
          setDescription(description)
          setPermissions(permissions.filter(p => p.value !== '' && p.value !== '@volteuropa.org'))
          setViewPermission(viewPermissionTmp)
          setRedirect(redirect)
          setCoverphoto(coverphoto)
          setImprintOverwrite(imprint)
          setPrivacyPolicyOverwrite(privacy_policy)
          setItems(items)
          setLoadingContent(false)
        }
      })
      .catch(error => console.error(error))
  }, [
    setLoadingContent,
    setCanEdit,
    code,
    permissionsDefault,
    setUseAs,
    setLayout,
    setTitle,
    setDescription,
    setPermissions,
    setRedirect,
    setCoverphoto,
    setImprintOverwrite,
    setPrivacyPolicyOverwrite,
    setItems
  ])

  const handleSave = useCallback(() => {
    setSavingMessage(getString('path_editor_status_started_saving'))

    const permissionsTmp = [
      ...permissions,
      ...(viewPermission !== '' ? [{ _id: uuidv4(), value: viewPermission, role: 'viewer'}] : [])
    ]

    const data = {
      use_as: useAs,
      layout,
      title,
      description,
      permissions: permissionsTmp,
      coverphoto,
      redirect,
      overwrites: {
        imprint: imprintOverwrite,
        privacy_policy: privacyPolicyOverwrite
      },
      items
    }

    fetch(`${window.domains.backend}set/${code}`, {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(async data => {
        await delay(500)
        if (typeof data.error === 'string') {
          if (data.error === 'no_edit_permission') {
            setSavingMessage(getString('path_editor_edit_permission_error'))
            await delay(2000)
            setSavingMessage(null)
          } else {
            setSavingMessage(data.error)
            await delay(2000)
            setSavingMessage(null)
          }
        } else {
          setSavingMessage(getString('path_editor_status_saved'))
          await delay(2000)
          setSavingMessage(null)
        }
      })
      .catch(async error => {
        console.error(error)
        await delay(500)
        setSavingMessage(getString('path_editor_status_error_while_saving', {
          error: error.message
        }))
      })
  }, [
    getString,
    code,
    useAs,
    layout,
    redirect,
    title,
    description,
    permissions,
    viewPermission,
    items,
    coverphoto,
    imprintOverwrite,
    privacyPolicyOverwrite
  ])

  const viewStatistics = useCallback(()=>{
    const a = document.createElement('a')
    a.href = `https://umami.qiekub.org/share/s0ZHBZbb/volt.link?url=%2F${code}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }, [code])

  const gotoQrcodePage = () => {
    const a = document.createElement('a')
    a.href = `https://qrcode.volt.link/?c=https://volt.link/${code}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    {/* <button className="text"><Localized id="path_editor_share"/></button> */}
    <button className="text hasIcon" onClick={gotoQrcodePage}>
      <span style={{pointerEvents: 'none'}}>
        <SVG src={icon_qr_code} className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_qrcode" /></span>
      </span>
    </button>
    <button className="text hasIcon" onClick={viewStatistics}>
      <span style={{pointerEvents: 'none'}}>
        <SVG src={icon_assessment} className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_statistics" /></span>
      </span>
    </button>
    <button className="green hasIcon" onClick={handleSave}>
      <span style={{pointerEvents: 'none'}}>
        <SVG src={icon_publish} className="icon" />
        <span style={{verticalAlign: 'middle'}}><Localized id="path_editor_save" /></span>
      </span>
    </button>
  </div>

  const editor_form = <>
    <h3><Localized id="path_editor_title_label" /></h3>
    <Repeater
      onChange={handleChange_Title}
      defaultValue={title}
      addDefaultValue={() => ({ _id: uuidv4(), locale: defaultLocale, value: '' })}
      addButtonText={getString('path_editor_add_translation')}
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
            {InputWithLocal_props => <input
              aria-label={getString('path_editor_title_label')}
              type="text"
              placeholder={getString('path_editor_title_placeholder')}
              {...InputWithLocal_props}
              style={{
                ...InputWithLocal_props.style,
                margin: '0',
              }}
            />}
          </InputWithLocal>
        }
      }
    />
    <br />
    <h3><Localized id="path_editor_description_label" /></h3>
    <Repeater
      onChange={setDescription}
      defaultValue={description}
      addDefaultValue={() => ({ _id: uuidv4(), locale: defaultLocale, value: '' })}
      addButtonText={getString('path_editor_add_translation')}
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
            {InputWithLocal_props => <HtmlInput
              aria-label={getString('path_editor_description_label')}
              placeholder={getString('path_editor_description_placeholder')}
              {...InputWithLocal_props}
              style={{
                ...InputWithLocal_props.style,
                margin: '0',
              }}
            />}
          </InputWithLocal>
        }
      }
    />

    <br />
    <h3><Localized id="path_editor_permissions_view_label" /></h3>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_view_info" /></em>
    <MultiButton
      onChange={setViewPermission}
      ariaLabel={getString('path_editor_permissions_view_label')}
      defaultValue={viewPermission}
      items={[
        { value: '', title: getString('path_editor_permissions_view_public') },
        { value: '@volteuropa.org', title: getString('path_editor_permissions_view_volteuropa') },
      ]}
    />

    <br />
    <br />
    <h3><Localized id="path_editor_permissions_edit_label" /></h3>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_edit_info" /></em>
    <Repeater
      onChange={handleChange_Permissions}
      defaultValue={permissions}
      addDefaultValue={() => ({ _id: uuidv4(), value: '', role: 'editor' })}
      addButtonText={getString('path_editor_permissions_edit_add_button_label')}
      render={
        ({ defaultValue, ...repeater_props }) => {
          const role = defaultValue.role
          const value = defaultValue.value
          return <PermissionInput
              role={role}
              defaultValue={value}
              style={{
                maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
                margin: '0',
              }}
              {...repeater_props}
            >
              {InputWithLocal_props => <FancyInput 
                    style={{ ...InputWithLocal_props.style, display: 'flex', flexDirection: 'column' }}
                >
                {({ setError }) => (
                  <EmailInput
                    onError={setError}
                    aria-label={getString('path_editor_permissions_edit_label')}
                    placeholder={getString('path_editor_permissions_edit_placeholder')}
                    {...InputWithLocal_props}
                    style={{ flexGrow: '1', margin: '0' }}
                  />
                )}
              </FancyInput>}
            </PermissionInput>
        }
      }
    />

    <br />
    <h3><Localized id="path_editor_use_as_label" /></h3>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_use_as_info" /></em>
    <MultiButton
      onChange={handleUseAsChange}
      ariaLabel={getString('path_editor_use_as_label')}
      defaultValue={useAs}
      items={[
        { value: 'redirect', title: getString('path_editor_use_as_value_redirect') },
        { value: 'linklist', title: getString('path_editor_use_as_value_linklist') },
        { value: '', title: getString('path_editor_use_as_value_nothing') }
      ]}
    />

    <br />
    <br />

    {
      useAs === 'linklist'
        ? <>
          <h3><Localized id="path_editor_layout_label" /></h3>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_layout_info" /></em>
          <MultiButton
            onChange={handleLayoutChange}
            ariaLabel={getString('path_editor_layout_label')}
            defaultValue={layout}
            items={[
              {
                value: 'default',
                title: getString('path_editor_layout_value_default'),
                icon: <SVG src={layoutDefault} className="icon big" />
              },
              {
                value: 'person',
                title: getString('path_editor_layout_value_person'),
                icon: <SVG src={layoutPerson} className="icon big" />
              },
            ]}
          />
          <br />
          <br />

          <h3><Localized id="path_editor_coverphoto_label" /></h3>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_coverphoto_info" vars={{
              width: layout === 'person' ? '400px' : '1200px',
              height: layout === 'person' ? '400px' : '400px',
              ratio: layout === 'person' ? '1/1' : '3/1',
            }}/>
          </em>
          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onChange={setCoverphoto}
                value={coverphoto}
                type="text"
                placeholder={getString('path_editor_coverphoto_placeholder')}
                aria-label={getString('path_editor_coverphoto_label')}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: 'calc(100% - var(--basis_x2))'
                }}
              />
            )}
          </FancyInput>
          {
            layout !== 'person'
              ? <>
                <MultiButton
                  onChange={setCoverphoto}
                  ariaLabel={getString('path_editor_coverphoto_label')}
                  defaultValue={coverphoto}
                  items={[
                    {
                      value: '',
                      title: 'No Coverphoto', // getString('path_editor_layout_value_default'),
                    },
                    ...[
                      {
                        value: 'https://assets.volteuropa.org/styles/scale_2880x/public/inline-images/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.jpg',
                        icon: volt_bonn_thumb,
                      },
                      {
                        value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2020-11/Welcome-to-Volt.jpg',
                        icon: welcome_to_volt_thumb,
                      },
                      {
                        value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-07/20200912_Plakatschlange_Ko%CC%88ln_Matteo%20Sant_Unione_011.jpeg',
                        icon: plakatschlange_thumb,
                      },
                      {
                        value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Aktion.jpeg',
                        icon: aktion_thumb,
                      },
                      // 'https://www.volteuropa.org/stripes/hero-desktop-green.jpg',
                      // 'https://www.volteuropa.org/stripes/hero-desktop-red.jpg',
                      // 'https://www.volteuropa.org/stripes/hero-desktop-blue.jpg',
                      // 'https://www.volteuropa.org/stripes/hero-desktop-yellow.jpg',
                      // 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Colours-Background-Big.jpeg',
                      // 'https://www.volteuropa.org/stripes/intermediate-green.jpg',
                      // 'https://www.volteuropa.org/stripes/intermediate-red.jpg',
                      // 'https://www.volteuropa.org/stripes/intermediate-blue.jpg',
                      // 'https://www.volteuropa.org/stripes/intermediate-yellow.jpg',
                      // 'https://www.volteuropa.org/og-default.png',
                      // 'https://www.volteuropa.org/hero-default.jpg',
                    ]
                    .map(({value = '', icon = ''}) => ({
                      value,
                      icon: <img alt="" src={icon} className="icon image" />
                    }))
                  ]}
                />
                <br />
              </>
              : null
          }
          <br />

          <h3><Localized id="path_editor_imprint_overwrite_label" /></h3>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_imprint_overwrite_info" />
          </em>
          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onChange={setImprintOverwrite}
                defaultValue={imprintOverwrite}
                type="text"
                placeholder={getString('path_editor_imprint_overwrite_placeholder')}
                aria-label={getString('path_editor_imprint_overwrite_label')}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: 'calc(100% - var(--basis_x2))'
                }}
              />
            )}
          </FancyInput>

          <br />
          <h3><Localized id="path_editor_privacy_policy_overwrite_label" /></h3>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_privacy_policy_overwrite_info" />
          </em>
          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onChange={setPrivacyPolicyOverwrite}
                defaultValue={privacyPolicyOverwrite}
                type="text"
                placeholder={getString('path_editor_privacy_policy_overwrite_placeholder')}
                aria-label={getString('path_editor_privacy_policy_overwrite_label')}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: 'calc(100% - var(--basis_x2))'
                }}
              />
            )}
          </FancyInput>

          <br />
          <br />
          <Items
            onChange={handleChange_Items}
            defaultValue={items}
          />
          <br />
          <br />
        </>
        : (
          useAs === 'redirect'
            ? <>
              <h3><Localized id="path_editor_redirect_label" /></h3>
              <FancyInput>
                {({ setError }) => (
                  <UrlInput
                    onError={setError}
                    onChange={setRedirect}
                    type="text"
                    placeholder={getString('path_editor_redirect_placeholder')}
                    aria-label={getString('path_editor_redirect_label')}
                    defaultValue={redirect}
                    style={{
                      marginRight: '0',
                      marginLeft: '0',
                      width: 'calc(100% - var(--basis_x2))'
                    }}
                  />
                )}
              </FancyInput>
              <br />
              <br />
            </>
            : null
        )
    }
    </>

  return <div
    className={`hasHeader ${classes.editor} ${loadingContent ? classes.loadingContent : ''}`}
  >
    <Header
      title={<a href={`https://volt.link/${code}`} target="_blank" rel="noopener noreferrer"><span className="hideOnSmallScreen">volt.link</span>/{code}</a>}
      rightActions={canEdit ? rightHeaderActions : null}
      notificationBanner={
        savingMessage === null
          ? null
          : <p style={{ textAlign: 'center' }}>{savingMessage}</p>
      }
    />

    {
      canEdit
        ? editor_form
        : <p style={{ marginTop: 'var(--basis)' }}><Localized id="path_editor_edit_permission_error" /></p>
    }
  </div>
}

export default withLocalization(Editor)
