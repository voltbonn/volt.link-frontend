import { useState, useCallback, useEffect } from 'react'

import FancyInput from './FancyInput.js'
import PathInput from './PathInput.js'
// import HtmlInput from './HtmlInput.js'

import { useLocalization } from '../../fluent/Localized.js'

function TriggerInput({
  defaultValue,
  className,
  style,
  onChange,
}) {
  const { getString } = useLocalization()

  const [properties, setProperties] = useState({})

  useEffect(() => {
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
  if (type === 'click') {
    morePropsInput = null
  } else if (type === 'path') {
    morePropsInput = <>
      <FancyInput
        style={{
          flexGrow: '1',
        }}
      >
        {({ setError }) => (
          <PathInput
            onError={setError}
            placeholder={getString('trigger_input_path_placeholder')}
            defaultValue={properties.path}
            onBlur={newValue => updateProperty('path', newValue)}
            style={{
              flexGrow: '1',
              margin: '0',
              minWidth: '300px',
            }}
            // className="show_border_on_active"
          />
        )}
      </FancyInput>
    </>
  // } else if (type === 'cron') {
  //   morePropsInput = <>cron: String</>
  // } else if (type === 'block_change') {
  //   morePropsInput = <>blockId: ID</>
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
    <select
      key={properties.type}
      onChange={event => updateProperty('type', event.target.value)}
      defaultValue={properties.type || ''}
      style={{
        margin: '0',
      }}
    >
      <option value="">No Trigger</option>
      <option value="path">Path</option>
      <option value="click">Click</option>
      {/* <option value="cron">Cron</option> */}
      {/* <option value="block_change">Block Change</option> */}
    </select>

    {morePropsInput}
  </div>
}

export default TriggerInput
