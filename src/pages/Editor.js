import { useState, useCallback, useRef, useEffect, useMemo } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  useParams
} from 'react-router-dom'

import classes from './Editor.module.css'
import { Localized, withLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'
import MultiButton from '../components/MultiButton.js'
import InputWithLocal from '../components/InputWithLocal.js'
import Repeater from '../components/Repeater.js'

function ItemRaw({ getString, item, className, onChange, ...props }) {
  const wrapperDiv = useRef(null)

  const [type, setType] = useState(item.type || null)
  const [title, setTitle] = useState(item.title || [])
  const [text, setText] = useState(item.text || [])
  const [link, setLink] = useState(item.link || '')

  const handleTypeChange = useCallback(newValue => {
    setType(newValue)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type: newValue, title, text, link }
      onChange({ target })
    }
  }, [setType, onChange, title, text, link])

  const handleChange_Title = useCallback(rows => {
    const newValue = rows
    setTitle(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title: newValue, text, link }
      onChange({ target })
    }
  }, [setTitle, onChange, type, text, link])

  const handleChange_Text = useCallback(rows => {
    const newValue = rows
    setText(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title, text: newValue, link }
      onChange({ target })
    }
  }, [setText, onChange, type, title, link])

  const handleChange_Link = useCallback(event => {
    const newValue = event.target.value
    setLink(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title, text, link: newValue }
      onChange({ target })
    }
  }, [setLink, onChange, type, title, text])

  return <div
    ref={wrapperDiv}
    className={`${classes.item} ${!!type ? '' : classes.chooseTypeScreen} ${className}`}
    {...props}
  >
    {
      !!type
        ? null
        : <p style={{
            marginBottom: 'var(--basis)'
          }}><Localized id="path_editor_item_choose_type_label" /></p>
    }

    <MultiButton
      onChange={handleTypeChange}
      ariaLabel="Use as"
      defaultValue={type}
      items={[
        { value: 'link', title: getString('path_editor_item_choose_type_value_link') },
        { value: 'headline', title: getString('path_editor_item_choose_type_value_headline') }
        { value: 'text', title: getString('path_editor_item_choose_type_value_text') }
      ]}
      style={{
        marginTop: 'calc(-1 * var(--basis))'
      }}
    />

    {
      !!type
        ? <> 
          {
            type === 'link' || type === 'headline'
              ? <Repeater
                onChange={handleChange_Title}
                defaultValue={title}
                addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
                addButtonText={getString('path_editor_add_translation')}
                style={{
                  marginTop: 'var(--basis_x4)'
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
                      {InputWithLocal_props => <input type="text" placeholder={getString('path_editor_item_title_label')} {...InputWithLocal_props} style={{ ...InputWithLocal_props.style, margin: '0' }} />}
                    </InputWithLocal>
                  }
                }
              />
              : null
          }
          {
            type === 'text'
              ? <Repeater
                onChange={handleChange_Text}
                defaultValue={text}
                addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
                addButtonText={getString('path_editor_add_translation')}
                style={{
                  marginTop: 'var(--basis_x4)'
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
                      {InputWithLocal_props => <textarea placeholder={getString('path_editor_item_text_label')} {...InputWithLocal_props} style={{ ...InputWithLocal_props.style, margin: '0' }} />}
                    </InputWithLocal>
                  }
                }
              />
              : null
          }

          {
            type === 'link'
              ? <input
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
              : null
          }
        </>
        : null
    }
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
    render={
      ({ defaultValue, ...repeater_props }) => {
        return <Item
          item={defaultValue}
          style={{
            maxWidth: 'calc(100% - calc(var(--basis_x8) + var(--basis_x2)))',
          }}
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
  const { code } = useParams()
  const [{email = ''} = {}] = useUser() || []

  const [loadingContent, setLoadingContent] = useState(true)
  const [canEdit, setCanEdit] = useState(true)
  const [savingMessage, setSavingMessage] = useState(null)

  const [useAs, setUseAs] = useState('')
  const handleUseAsChange = useCallback(newValue => setUseAs(newValue), [setUseAs])

  const [title, setTitle] = useState([])
  const handleChange_Title = useCallback(rows => setTitle(rows), [setTitle])

  const [description, setDescription] = useState([])
  const handleChange_Description = useCallback(rows => setDescription(rows), [setDescription])

  const permissionsDefault = useMemo(() => (
      typeof email === 'string' && email.length > 0
      ? [{ _id: uuidv4(), value: email }, { _id: uuidv4(), value: '' }]
      : []
  ), [email])
  const [permissions, setPermissions] = useState(permissionsDefault)
  const handleChange_Permissions = useCallback(rows => {
    const filled_rows_length = rows.filter(r => r.value !== '').length

    if (filled_rows_length === 0) {
      rows.unshift({ _id: uuidv4(), value: email })
    }

    setPermissions(rows)
    return rows
  }, [setPermissions, email])

  const [coverphoto, setCoverphoto] = useState('')
  const handleChange_Coverphoto = useCallback(event => setCoverphoto(event.target.value), [setCoverphoto])

  const [imprintOverwrite, setImprintOverwrite] = useState('')
  const handleChange_ImprintOverwrite = useCallback(event => setImprintOverwrite(event.target.value), [setImprintOverwrite])

  const [privacyPolicyOverwrite, setPrivacyPolicyOverwrite] = useState('')
  const handleChange_PrivacyPolicyOverwrite = useCallback(event => setPrivacyPolicyOverwrite(event.target.value), [setPrivacyPolicyOverwrite])

  const [redirect, setRedirect] = useState('')
  const handleChange_Redirect = useCallback(event => setRedirect(event.target.value), [setRedirect])

  const [items, setItems] = useState([])
  const handleChange_Items = useCallback(rows => setItems(rows), [setItems])

  useEffect(() => {
    setCanEdit(true)
    setLoadingContent(true)

    fetch(`https://volt.link/get/${code}`, {
    // fetch(`http://0.0.0.0:4000/get/${code}`, {
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

          setUseAs(useAs)
          setTitle(title)
          setDescription(description)
          setPermissions(permissions)
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

    const data = {
      use_as: useAs,
      title,
      description,
      permissions,
      coverphoto,
      redirect,
      overwrites: {
        imprint: imprintOverwrite,
        privacy_policy: privacyPolicyOverwrite
      },
      items
    }

    fetch(`https://volt.link/set/${code}`, {
    // fetch(`http://0.0.0.0:4000/set/${code}`, {
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
    redirect,
    title,
    description,
    permissions,
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

  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    {/* <button className="text"><Localized id="path_editor_share"/></button> */}
    <button className="text" onClick={viewStatistics}><Localized id="path_editor_statistics" /></button>
    <button className="green" onClick={handleSave}><Localized id="path_editor_save"/></button>
  </div>

  const editor_form = <>
    <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_title_label" /></p>
    <Repeater
      onChange={handleChange_Title}
      defaultValue={title}
      addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
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
    <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_description_label" /></p>
    <Repeater
      onChange={handleChange_Description}
      defaultValue={description}
      addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
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
            {InputWithLocal_props => <textarea
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
    <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_edit_label" /></p>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_edit_info" /></em>
    <Repeater
      onChange={handleChange_Permissions}
      defaultValue={permissions}
      addDefaultValue={() => ({ _id: uuidv4(), value: '' })}
      addButtonText={getString('path_editor_permissions_edit_add_button_label')}
      render={
        ({ defaultValue, ...repeater_props }) => {
          const value = defaultValue.value
          return <input
            defaultValue={value}
            type="text"
            aria-label={getString('path_editor_permissions_edit_label')}
            placeholder={getString('path_editor_permissions_edit_placeholder')}
            style={{
              maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
              margin: '0',
            }}
            {...repeater_props}
          />
        }
      }
    />

    <br />
    <p><Localized id="path_editor_use_as_label" /></p>
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
          <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_coverphoto_label" /></p>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_coverphoto_info" />
          </em>
          <input
            onChange={handleChange_Coverphoto}
            defaultValue={coverphoto}
            type="text"
            placeholder={getString('path_editor_coverphoto_placeholder')}
            aria-label={getString('path_editor_coverphoto_label')}
            style={{
              marginRight: '0',
              marginLeft: '0',
              width: 'calc(100% - var(--basis_x2))'
            }}
          />

          <br />
          <br />
          <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_imprint_overwrite_label" /></p>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_imprint_overwrite_info" />
          </em>
          <input
            onChange={handleChange_ImprintOverwrite}
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

          <br />
          <br />
          <p style={{ marginBottom: 'var(--basis)' }}><Localized id="path_editor_privacy_policy_overwrite_label" /></p>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_privacy_policy_overwrite_info" />
          </em>
          <input
            onChange={handleChange_PrivacyPolicyOverwrite}
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
              <p><Localized id="path_editor_redirect_label" /></p>
              <input
                onChange={handleChange_Redirect}
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
      title={<><span className="hideOnSmallScreen">volt.link</span>/{code}</>}
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
