import { useState, useCallback, useRef, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  useParams
} from 'react-router-dom'

import classes from './Editor.module.css'
import MultiButton from './MultiButton.js'
import InputWithLocal from './InputWithLocal.js'
import Repeater from './Repeater.js'

function Item({ item, className, onChange, ...props }) {
  const wrapperDiv = useRef(null)

  const [type, setType] = useState(item.type || null)
  const [title, setTitle] = useState(item.title || [{ locale: 'de', value: 'Website' }])
  const [link, setLink] = useState(item.link || '')

  const handleTypeChange = useCallback(newValue => {
    setType(newValue)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type: newValue, title, link }
      onChange({ target })
    }
  }, [setType, onChange, title, link])

  const handleChange_Title = useCallback(rows => {
    const newValue = rows
    setTitle(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title: newValue, link }
      onChange({ target })
    }
  }, [setTitle, onChange, type, link])

  const handleChange_Link = useCallback(event => {
    const newValue = event.target.value
    setLink(newValue)

    if (onChange) {
      const target = wrapperDiv.current
      target.value = { type, title, link: newValue }
      onChange({ target })
    }
  }, [setLink, onChange, type, title])

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
          }}>Choose an item type:</p>
    }

    <MultiButton
      onChange={handleTypeChange}
      ariaLabel="Use as"
      defaultValue={type}
      items={[
        { value: 'link', title: 'Link' },
        { value: 'headline', title: 'Headline' }
      ]}
      style={{
        marginTop: 'calc(-1 * var(--basis))'
      }}
    />

    {
      !!type
        ? <>
          {/*
            type === 'headline'
            ? <p style={{marginBottom: 'var(--basis)'}}>Headline</p>
            : <p style={{marginBottom: 'var(--basis)'}}>Link</p>
          */}

          {
            type === 'link' || type === 'headline'
              ? <Repeater
                onChange={handleChange_Title}
                defaultValue={title}
                addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
                addButtonText="Add Translation"
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
                      {InputWithLocal_props => <input type="text" placeholder="Title" {...InputWithLocal_props} style={{ ...InputWithLocal_props.style, margin: '0' }} />}
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
                placeholder="Link"
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

function Items({ defaultValue, onChange }){
  const items = defaultValue

  return <Repeater
    onChange={onChange}
    defaultValue={items}
    addDefaultValue={() => ({ _id: uuidv4(), type: null, title: [], link: '', active: true })}
    // addButtonText="Add Row"
    prependNewItems={true}
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

function Editor() {
  const { code } = useParams()

  const [loadingContent, setLoadingContent] = useState(true)
  const [savingMessage, setSavingMessage] = useState(null)

  const [useAs, setUseAs] = useState('')
  const handleUseAsChange = useCallback(newValue => setUseAs(newValue), [setUseAs])

  const [title, setTitle] = useState([
    { _id: uuidv4(), locale: 'de', value: 'Volt Bonn' },
  ])
  const handleChange_Title = useCallback(rows => setTitle(rows), [setTitle])

  const [description, setDescription] = useState([
    { _id: uuidv4(), locale: 'en', value: 'hello' },
    { _id: uuidv4(), locale: 'de', value: 'hallo' }
  ])
  const handleChange_Description = useCallback(rows => setDescription(rows), [setDescription])

  const [internal_contact, setInternalContact] = useState('')
  const handleChange_InternalContact = useCallback(event => setInternalContact(event.target.value), [setInternalContact])

  const [coverphoto, setCoverphoto] = useState('')
  const handleChange_Coverphoto = useCallback(event => setCoverphoto(event.target.value), [setCoverphoto])

  const [imprintOverwrite, setImprintOverwrite] = useState('')
  const handleChange_ImprintOverwrite = useCallback(event => setImprintOverwrite(event.target.value), [setImprintOverwrite])

  const [privacyPolicyOverwrite, setPrivacyPolicyOverwrite] = useState('')
  const handleChange_PrivacyPolicyOverwrite = useCallback(event => setPrivacyPolicyOverwrite(event.target.value), [setPrivacyPolicyOverwrite])

  const [redirect, setRedirect] = useState('')
  const handleChange_Redirect = useCallback(event => setRedirect(event.target.value), [setRedirect])

  const [items, setItems] = useState([
    // {
    //   _id: uuidv4(),
    //   type: 'headline',
    //   title: [
    //     { _id: uuidv4(), locale: 'en', value: 'Headline' },
    //     { _id: uuidv4(), locale: 'de', value: 'Titel' }
    //   ]
    // },
    // {
    //   _id: uuidv4(),
    //   type: 'link',
    //   title: [
    //     { _id: uuidv4(), locale: 'en', value: 'Website' },
    //     { _id: uuidv4(), locale: 'de', value: 'Webseite' }
    //   ],
    //   link: 'https://volt-bonn.de',
    // }
  ])
  const handleChange_Items = useCallback(rows => setItems(rows), [setItems])

  useEffect(() => {
    setLoadingContent(true)

    fetch(`https://volt.link/get/${code}`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('data', data)

        let {
          use_as: useAs = '',
          title = [],
          description = [],
          internal_contact = '',
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
        setInternalContact(internal_contact)
        setRedirect(redirect)
        setCoverphoto(coverphoto)
        setImprintOverwrite(imprint)
        setPrivacyPolicyOverwrite(privacy_policy)
        setItems(items)
        setLoadingContent(false)
      })
      .catch(error => console.error(error))
  }, [
    setLoadingContent,
    code,
    setUseAs,
    setTitle,
    setDescription,
    setInternalContact,
    setRedirect,
    setCoverphoto,
    setImprintOverwrite,
    setPrivacyPolicyOverwrite,
    setItems
  ])

  const handleSave = useCallback(() => {
    setSavingMessage('Started saving…')

    const data = {
      use_as: useAs,
      title,
      description,
      internal_contact,
      coverphoto,
      redirect,
      overwrites: {
        imprint: imprintOverwrite,
        privacy_policy: privacyPolicyOverwrite
      },
      items,
      last_modified: new Date()
    }

    fetch(`https://volt.link/set/${code}`, {
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
        setSavingMessage('Saved!')
        await delay(500)
        setSavingMessage(null)
      })
      .catch(async error => {
        console.error(error)
        await delay(500)
        setSavingMessage(`Error while saving! Please try again later. (The error: "${error}")`)
      })
  }, [
    code,
    useAs,
    redirect,
    title,
    description,
    internal_contact,
    items,
    coverphoto,
    imprintOverwrite,
    privacyPolicyOverwrite
  ])

  return <>
    <div className={`${classes.editor} ${loadingContent ? classes.loadingContent : ''}`}>

      <h2>volt.link/{code}</h2>

      <br />
      <br />

      <p style={{marginBottom: 'var(--basis)'}}>Title:</p>
      <Repeater
        onChange={handleChange_Title}
        defaultValue={title}
        addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
        addButtonText="Add Translation"
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
                aria-label="Title"
                type="text"
                placeholder="Volt Bonn"
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
      <p style={{ marginBottom: 'var(--basis)' }}>Short description:</p>
      <Repeater
        onChange={handleChange_Description}
        defaultValue={description}
        addDefaultValue={() => ({ _id: uuidv4(), locale: 'en', value: '' })}
        addButtonText="Add Translation"
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
                aria-label="Short description"
                placeholder="Future Made in Europa"
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
      <p style={{ marginBottom: 'var(--basis)' }}>Main contact for this link:</p>
      <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>(Only used internally. This won't be published.)</em>
      <input
        onChange={handleChange_InternalContact}
        defaultValue={internal_contact}
        type="text"
        placeholder="thomas.rosen@volteuropa.org"
        style={{
          marginRight: '0',
          marginLeft: '0',
          width: 'calc(100% - var(--basis_x2))'
        }}
      />

      <br />
      <br />
      <p>Use as:</p>
      <MultiButton
        onChange={handleUseAsChange}
        ariaLabel="Use as"
        defaultValue={useAs}
        items={[
          { value: 'redirect', title: 'Redirect' },
          { value: 'linklist', title: 'Linklist' },
          { value: '', title: 'Nothing / Deactivated' }
        ]}
      />

      <br />
      <br />

      {
        useAs === 'linklist'
          ? <>
            <p style={{ marginBottom: 'var(--basis)' }}>Coverphoto:</p>
            <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
              A url to use for the coverphoto. The photo needs to be uploaded somewhere else. For example the Volt Europa website.
            </em>
            <input
              onChange={handleChange_Coverphoto}
              defaultValue={coverphoto}
              type="text"
              placeholder="https://"
              style={{
                marginRight: '0',
                marginLeft: '0',
                width: 'calc(100% - var(--basis_x2))'
              }}
            />

            <br />
            <br />
            <p style={{ marginBottom: 'var(--basis)' }}>Custom imprint link:</p>
            <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
              (Leave empty for Volt Europa imprint.)
            </em>
            <input
              onChange={handleChange_ImprintOverwrite}
              defaultValue={imprintOverwrite}
              type="text"
              placeholder="https://"
              style={{
                marginRight: '0',
                marginLeft: '0',
                width: 'calc(100% - var(--basis_x2))'
              }}
            />

            <br />
            <br />
            <p style={{ marginBottom: 'var(--basis)' }}>Custom privacy policy link:</p>
            <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
              (Leave empty for Volt Europa privacy policy.)
            </em>
            <input
              onChange={handleChange_PrivacyPolicyOverwrite}
              defaultValue={privacyPolicyOverwrite}
              type="text"
              placeholder="https://"
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
                <p>Url to redirect to:</p>
                <input
                  onChange={handleChange_Redirect}
                  type="text"
                  placeholder="https://volt-bonn.de"
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

      <div className="buttonRow" style={{ textAlign: 'left' }}>
        <button className="green" onClick={handleSave}>Save</button>
        {/* <button>Share</button> */}
      </div>

      {
        savingMessage === null
        ? null
        : <p>{savingMessage}</p>
      }

    </div>
  </>
}

export default Editor
