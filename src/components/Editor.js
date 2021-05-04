import { useState, useCallback, useRef } from 'react'

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

function Editor() {
  const { code } = useParams()

  const [useAs, setUseAs] = useState(null)
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

  const [redirect, setRedirect] = useState('')
  const handleChange_Redirect = useCallback(event => setRedirect(event.target.value), [setRedirect])

  const [linklist, setLinklist] = useState([
    {
      _id: uuidv4(),
      type: 'headline',
      title: [
        { _id: uuidv4(), locale: 'en', value: 'Headline' },
        { _id: uuidv4(), locale: 'de', value: 'Titel' }
      ]
    },
    {
      _id: uuidv4(),
      type: 'link',
      title: [
        { _id: uuidv4(), locale: 'en', value: 'Website' },
        { _id: uuidv4(), locale: 'de', value: 'Webseite' }
      ],
      link: 'https://volt-bonn.de',
    }
  ])
  const handleChange_Linklist = useCallback(rows => setLinklist(rows), [setLinklist])

  const handleSave = useCallback(() => {
    const data = { useAs, redirect, title, description, linklist }

    fetch('http://0.0.0.0:4000/save/path', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error)
  }, [useAs, redirect, title, description, linklist])

  return <>
    <div className={`${classes.editor}`}>

      <h2>volt.link/{code}</h2>

      <hr />

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
      <p style={{ marginBottom: 'var(--basis)' }}>Short Description:</p>
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
                aria-label="Short Description"
                placeholder="description"
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
      <p>Use as:</p>
      <MultiButton
        onChange={handleUseAsChange}
        ariaLabel="Use as"
        defaultValue={useAs}
        items={[
          { value: 'redirect', title: 'Redirect' },
          { value: 'linklist', title: 'Linklist' },
          { value: 'deactivated', title: 'Nothing / Deactivated' }
        ]}
      />

      <hr />

      {
        useAs === 'linklist'
          ? <>
            <Items
              onChange={handleChange_Linklist}
              defaultValue={linklist}
            />
            <hr />
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
                <hr />
              </>
              : null
          )
      }

      <div className="buttonRow" style={{ textAlign: 'center' }}>
        <button className="green" onClick={handleSave}>Save</button>
        {/* <button>Share</button> */}
      </div>

    </div>
  </>
}

export default Editor
