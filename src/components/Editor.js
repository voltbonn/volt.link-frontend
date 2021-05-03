import { useState, useCallback } from 'react'

import {
  useParams
} from 'react-router-dom'

import classes from './Editor.module.css'
import MultiButton from './MultiButton.js'
import InputWithLocal from './InputWithLocal.js'
import Repeater from './Repeater.js'

function Item({ item, style, className }){
  const [type, setType] = useState(item.type)

  const handleTypeClick = useCallback(event => {
    const value = event.target.dataset.value
    setType(value)
  }, [setType])

  if (!!type) {
    return <div className={`${classes.item} ${className}`} style={style}>
      {
        type === 'headline'
        ? <p>Headline:</p>
        : null
      }

      {
        type === 'link' || type === 'headline'
          ? <Repeater
            defaultValue={Object.entries(item.title)}
            addDefaultValue={{ locale: 'en', value: '' }}
            addButtonText="Add Translation"
            render={
              ({ defaultValue, className }) => {
                const locale = defaultValue[0]
                const value = defaultValue[1]
                return <InputWithLocal
                  key={locale}
                  locale={locale}
                  defaultValue={value}
                  style={{
                    maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
                  }}
                  className={className}
                >
                  {props => <input type="text" placeholder="Title" {...props} style={{ ...props.style, margin: '0' }} />}
                </InputWithLocal>
              }
            }
          />
          : null
      }

      {
        type === 'link'
          ? <input
            type="text"
            defaultValue={item.link}
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
    </div>
  } else {
    return <div className={`${classes.item} ${classes.chooseTypeScreen} ${className}`} style={style}>
      <p>Choose an item type:</p>

      <div className="buttonRow">
        <button data-value="link" onClick={handleTypeClick}>Link</button>
        <button data-value="headline" onClick={handleTypeClick}>Headline</button>
      </div>
    </div>
  }
}

function Items({ defaultValue }){
  const [items,] = useState(defaultValue)

  return <Repeater
    defaultValue={items}
    addDefaultValue={{ type: null, title: {}, link: '', active: true }}
    // addButtonText="Add Row"
    render={
      ({ defaultValue, className, onChange }) => {
        const key = JSON.stringify(defaultValue)
        return <Item
          key={key}
          item={defaultValue}
          style={{
            maxWidth: 'calc(100% - calc(var(--basis_x8) + var(--basis_x2)))',
          }}
          className={className}
          onChange={onChange}
        />
      }
    }
  />
}

function Editor() {
  const { code } = useParams()

  const useAsDefault = null // 'linklist'
  const [useAs, setUseAs] = useState(useAsDefault)

  const linklistItemsDefault = [
    // {
    //   type: 'headline',
    //   title: {
    //     en: 'Headline',
    //     de: 'Titel'
    //   }
    // },
    // {
    //   type: 'link',
    //   title: {
    //     en: 'Website',
    //     de: 'Webseite'
    //   },
    //   link: 'https://volt-bonn.de',
    // }
  ]

  const handleUseAsChange = useCallback(newValue => {
    setUseAs(newValue)
  }, [setUseAs])

  return <>
    <div className={`${classes.editor}`}>

      <h2>volt.link/{code}</h2>

      <hr />

      <p style={{marginBottom: 'var(--basis)'}}>Title:</p>
      <Repeater
        defaultValue={[
          { locale: 'de', value: 'Volt Bonn' },
        ]}
        addDefaultValue={{ locale: 'en', value: '' }}
        addButtonText="Add Translation"
        render={
          ({ defaultValue, className, onChange }) => {
            const locale = defaultValue.locale
            const value = defaultValue.value
            return <InputWithLocal
              key={locale}
              locale={locale}
              defaultValue={value}
              style={{
                maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
              }}
              className={className}
              onChange={onChange}
            >
              {props => <input
                aria-label="Title"
                type="text"
                placeholder="Volt Bonn"
                {...props}
                style={{
                  ...props.style,
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
        defaultValue={[
          {locale: 'en', value: 'hello'},
          {locale: 'de', value: 'hallo'}
        ]}
        addDefaultValue={{ locale: 'en', value: '' }}
        addButtonText="Add Translation"
        render={
          ({ defaultValue, className, onChange }) => {
            const locale = defaultValue.locale
            const value = defaultValue.value
            return <InputWithLocal
              key={locale}
              locale={locale}
              defaultValue={value}
              style={{
                maxWidth: 'calc(100% - calc(var(--basis_x4) + var(--basis_x2)))',
              }}
              className={className}
              onChange={onChange}
            >
              {props => <textarea
                aria-label="Short Description"
                placeholder="description"
                {...props}
                style={{
                  ...props.style,
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
        ariaLabel="Use as"
        defaultValue={useAsDefault}
        items={[
          { value: 'redirect', title: 'Redirect' },
          { value: 'linklist', title: 'Linklist' },
          { value: 'deactivated', title: 'Nothing / Deactivated' }
        ]}
        onChange={handleUseAsChange}
      />

      <hr />

      {
        useAs === 'linklist'
          ? <>
              <Items
                defaultValue={linklistItemsDefault}
              />
              <hr />
            </>
          : (
            useAs === 'redirect'
              ? <>
                <p>Url to redirect to:</p>
                <input
                  type="text"
                  placeholder="https://volt-bonn.de"
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

      <div className="buttonRow">
        <button className="green">Save</button>
        {/* <button>Share</button> */}
      </div>

    </div>
  </>
}

export default Editor
