import { useState, useCallback, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import classes from './PropertiesEditor.module.css'

import { Localized, withLocalization } from '../../fluent/Localized.js'
import UrlInput from './UrlInput.js'
import CheckboxInput from './CheckboxInput.js'
import HtmlInput from './HtmlInput.js'
import FancyInput from './FancyInput.js'
import CoverphotoPicker from './CoverphotoPicker.js'
import IconPicker from './IconPicker.js'
import TranslatedInput from './TranslatedInput.js'

// function stripTmpIds(array){
//   return [...array].map(obj => {
//     const obj_new = { ...obj }
//     delete obj_new._id
//     return obj_new
//   })
// }

function addTmpIds(array) {
  return [...(array || [])].map(obj => {
    if (!obj.tmp_id) {
      const obj_new = { ...obj }
      obj_new.tmp_id = uuidv4()
      return obj_new
    }

    return obj
  })
}

function PropertiesEditor({ getString, type, defaultProperties = {}, onChange }) {
  const [properties, setProperties] = useState({})

  // const [coverphoto, setCoverphoto] = useState('')
  // const [imprint, setImprint] = useState('')
  // const [privacy_policy, setPrivacyPolicy] = useState('')
  // const [link, setLink] = useState('')

  // let [voltTeams, setVoltTeams] = useState([])
  // voltTeams = voltTeams.map(({ id, name }) => ({ value: id, label: name }))

  // const [voltTeamInfos, setVoltTeamInfos] = useState({
  //   id: null,
  //   name: ''
  // })
  // const setVoltTeamInfosFromSelect = useCallback((data) => {
  //   setVoltTeamInfos({
  //     id: data.value,
  //     name: data.label,
  //   })
  // }, [setVoltTeamInfos])


  const updateProperty = useCallback((propertyKey, newPropertyValue) => {
    const propertyTypes = {
      text: 'array',
      description: 'array',
      coverphoto: 'string',
      icon: 'string',
      imprint: 'string',
      privacy_policy: 'string',
      tags: 'string',
      checked: 'boolean',
      trigger: 'object',
      action: 'object',
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

  useEffect(() => {
    setProperties({
      ...defaultProperties,
      text: addTmpIds(defaultProperties.text || []),
      description: addTmpIds(defaultProperties.description || []),
    })
  }, [
    defaultProperties,
    setProperties,
  ])


  // useEffect(() => {
  //   fetch(`${window.domains.backend}teams_simple.json`, {
  //     mode: 'cors',
  //     credentials: 'include',
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (typeof data.error === 'string') {
  //         setVoltTeams([])
  //       } else {
  //         setVoltTeams(data)
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error)
  //       setVoltTeams([])
  //     })
  // }, [ setVoltTeams ])

  let propertiesFrameContent = null
  if (type === 'page' || type === 'person') {
    propertiesFrameContent = <>
      <div className={classes.properties_row}>
      <h3><Localized id="path_editor_imprint_label" /></h3>
      <div>
      <FancyInput>
        {({ setError }) => (
          <UrlInput
            onError={setError}
            onBlur={newValue => updateProperty('imprint', newValue)}
            defaultValue={properties.imprint}
            type="text"
            style={{
              margin: '0',
              width: '100%'
            }}
            className="show_border_on_active"
          />
        )}
      </FancyInput>
      </div>
      </div>

      <div className={classes.properties_row}>
      <h3><Localized id="path_editor_privacy_policy_label" /></h3>
      <div>
      <FancyInput>
        {({ setError }) => (
          <UrlInput
            onError={setError}
            onBlur={newValue => updateProperty('privacy_policy', newValue)}
            defaultValue={properties.privacy_policy}
            type="text"
            style={{
              margin: '0',
              width: '100%'
            }}
            className="show_border_on_active"
          />
        )}
      </FancyInput>
      </div>
      </div>
    </>
  // } else if (type === 'redirect') {
  //   propertiesFrameContent = <>
  //     <div className={classes.properties_row}>
  //     <h3><Localized id="path_editor_redirect_label" /></h3>
  //     <FancyInput>
  //       {({ setError }) => (
  //         <UrlInput
  //           onError={setError}
  //           onBlur={newValue => updateProperty('link', newValue)}
  //           type="text"
  //           placeholder={getString('path_editor_redirect_placeholder')}
  //           aria-label={getString('path_editor_redirect_label')}
  //           defaultValue={properties.link}
  //           style={{
  //             marginRight: '0',
  //             marginLeft: '0',
  //             width: '100%'
  //           }}
  //           className="show_border_on_active"
  //         />
  //       )}
  //     </FancyInput>
  //     </div>
  //   </>
  } else if (type === 'checkbox') {
    propertiesFrameContent = <>
      <div className={classes.properties_row}>
        <h3><Localized id="path_editor_checked_label" /></h3>
        <CheckboxInput
          onChange={newValue => updateProperty('checked', newValue)}
          defaultValue={Boolean(properties.checked)}
          style={{
            marginRight: '0',
            marginLeft: '0',
            width: '100%'
          }}
        />
      </div>
    </>
  }

  return <>
    <CoverphotoPicker
      defaultValue={properties.coverphoto}
      iconValue={properties.icon}
      onChange={newValue => updateProperty('coverphoto', newValue)}
    />
    <IconPicker
      defaultValue={properties.icon}
      coverphotoValue={properties.coverphoto}
      onChange={newValue => updateProperty('icon', newValue)}
    />

    <div className={classes.main_headline}>
      <TranslatedInput
        defaultValue={properties.text}
        onBlur={newValue => updateProperty('text', newValue)}
      >
        {(translatedInputProps) => {
          return (
          <HtmlInput
            placeholder={getString('placeholder_main_headline')}
            style={{ margin: '0' }}
            linebreaks={true}
            className={`show_border_on_active type_h1`}
            {...translatedInputProps}
          />
          )
        }}
      </TranslatedInput>

      <TranslatedInput
        defaultValue={properties.description}
        onBlur={newValue => updateProperty('description', newValue)}
      >
        {(translatedInputProps) => {
          return (
          <HtmlInput
            aria-label={getString('path_editor_description_label')}
            placeholder={getString('path_editor_description_placeholder')}
            style={{ margin: '0' }}
            linebreaks={true}
            className={`show_border_on_active type_text`}
            {...translatedInputProps}
          />
          )
        }}
      </TranslatedInput>
    </div>

    <div className={classes.propertiesFrame} style={
      propertiesFrameContent === null
        ? { display: 'none' }
        : null
    }>
      {propertiesFrameContent}

      {/* <div className={classes.properties_row}>
        <h3><Localized id="path_editor_tags_label" /></h3>
        <HtmlInput
          onBlur={newValue => updateProperty('tags', newValue)}
          type="text"
          placeholder={getString('path_editor_tags_placeholder')}
          aria-label={getString('path_editor_tags_label')}
          defaultValue={properties.tags}
          style={{
            marginRight: '0',
            marginLeft: '0',
            width: 'calc(100% - var(--basis_x2))'
          }}
        />
      </div> */}

      {/*
        voltTeams && voltTeams.length > 0
        ? <>
          <h3><Localized id="path_editor_belongs_to_team_label" /></h3>
          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_belongs_to_team_info" /></em>
          <Select
            defaultValue={{
              value: voltTeamInfos !== null ? voltTeamInfos.id || null : null,
              label: voltTeamInfos !== null ? voltTeamInfos.name || '' : '',
            }}
            defaultInputValue={voltTeamInfos !== null ? voltTeamInfos.name || '' : ''}
            onChange={setVoltTeamInfosFromSelect}
            ariaLabel={getString('path_editor_belongs_to_team_search_placeholder')}
            label={getString('path_editor_belongs_to_team_search_placeholder')}
            placeholder={getString('path_editor_belongs_to_team_search_placeholder')}
            options={voltTeams}
            styles={custom_react_select_styles}
            theme={custom_react_select_theme}
          />
        </>
        : null
      */}
    </div>
  </>
}

export default withLocalization(PropertiesEditor)
