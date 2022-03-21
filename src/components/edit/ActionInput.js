import { useState, useCallback, useEffect } from 'react'

import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'
import HtmlInput from './HtmlInput.js'

import { useLocalization } from '../../fluent/Localized.js'

function ActionInput({
  defaultValue,
  className,
  style,
  onChange,
}) {
  const { getString } = useLocalization()

  const [properties, setProperties] = useState({})

  useEffect(() => {
    defaultValue.type = 'open_url'
    setProperties(defaultValue)
  }, [
    defaultValue,
    setProperties,
  ])

  const updateProperty = useCallback((propertyKey, newPropertyValue) => {
    const propertyTypes = {
      type: 'string',
      path: 'string',
      url: 'string',
      cron: 'string',
      blockId: 'string',
    }

    const newProperties = { ...properties }

    if (propertyTypes.hasOwnProperty(propertyKey)) {
      switch (propertyTypes[propertyKey]) {
        case 'array':
          if (newPropertyValue.length > 0) {
            newProperties[propertyKey] = newPropertyValue
          } else if (newProperties.hasOwnProperty(propertyKey)) {
            delete newProperties[propertyKey]
          }
        break
        case 'string':
          if (newPropertyValue !== '') {
            newProperties[propertyKey] = newPropertyValue
          } else if (newProperties.hasOwnProperty(propertyKey)) {
            delete newProperties[propertyKey]
          }
        break
        case 'boolean':
          if (newPropertyValue === true) {
            newProperties[propertyKey] = true
          } else if (newProperties.hasOwnProperty(propertyKey)) {
            delete newProperties[propertyKey]
          }
        break
        case 'object':
          if (
            typeof newPropertyValue === 'object'
            && newPropertyValue !== null
            && Object.keys(newPropertyValue).length > 0
          ) {
            newProperties[propertyKey] = newPropertyValue
          } else if (newProperties.hasOwnProperty(propertyKey)) {
            delete newProperties[propertyKey]
          }
        break
        default:
          newProperties[propertyKey] = newPropertyValue
      }

      if (JSON.stringify(newProperties) !== JSON.stringify(properties)) {
        setProperties(newProperties)
        if (onChange) {
          onChange(newProperties)
        }
      }
    }
  }, [
    properties,
    setProperties,
    onChange,
  ])

  const type = properties.type || ''

  let morePropsInput = null
  if (
    type === 'open_url'
    || type === 'send_payload'
  ) {
    morePropsInput = <>
      <FancyInput
        style={{
          flexGrow: '1',
          margin: '0',
          minWidth: '300px',
        }}
      >
        {({ setError }) => (
          <UrlInput
            onError={setError}
            onBlur={newValue => updateProperty('url', newValue)}
            defaultValue={properties.url}
            placeholder={getString('action_input_url_placeholder')}
            type="text"
            style={{
              flexGrow: 1,
              margin: '0',
              width: '100%'
            }}
            // className="show_border_on_active"
          />
        )}
      </FancyInput>
    </>
  } else if (
    type === 'render_block'
    || type === 'run_block'
  ) {
    morePropsInput = <HtmlInput
        placeholder="blockId"
        defaultValue={properties.blockId}
        onBlur={newValue => updateProperty('blockId', newValue)}
        linebreak={false}
        style={{
          flexGrow: '1',
          margin: '0',
          minWidth: '300px',
        }}
        // className="show_border_on_active"
      />
  }

  return <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '100%',
      flexWrap: 'wrap',
      gap: 'var(--basis)',
      ...style
    }}
  >
    {/*
    <select
      key={properties.type}
      onChange={event => updateProperty('type', event.target.value)}
      defaultValue={properties.type || ''}
      style={{
        margin: '0',
      }}
    >
      <option value="">No Action</option>
      <option value="open_url">Open URL</option>
      <option value="render_block">Render Block</option>
      <option value="run_block">Run Block</option>
      <option value="send_payload">Send Payload</option>
    </select>
    */}

    {morePropsInput}
  </div>
}

export default ActionInput


/*

  let morePropsInput = null
  if (
    type === 'open_url'
    || type === 'send_payload'
  ) {
    morePropsInput = <>
      <UrlInput />
    </>
  } else if (
    type === 'render_block'
    || type === 'run_block'
  ) {
    morePropsInput = <>blockId: ID</>
  }


      <option key="editor" value="">…</option>
      <option key="editor" value="open_url">Open URL</option>
      <option key="viewer" value="render_block">Render Block</option>
      <option key="viewer" value="run_block">Run Block</option>
      <option key="viewer" value="send_payload">Send Payload</option>
      */
