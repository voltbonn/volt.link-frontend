import { useState, useCallback, useEffect } from 'react'

// import { v4 as uuidv4 } from 'uuid'

import classes from './PropertiesEditor.module.css'

import { Localized, withLocalization } from '../../fluent/Localized.js'
// import UrlInput from './UrlInput.js'
import CheckboxInput from './CheckboxInput.js'
import HtmlInput from './HtmlInput.js'
// import FancyInput from './FancyInput.js'
import CoverphotoPicker from './CoverphotoPicker.js'
import IconPicker from './IconPicker.js'
import TriggerInput from './TriggerInput.js'
import ActionInput from './ActionInput.js'

// function stripTmpIds(array){
//   return [...array].map(obj => {
//     const obj_new = { ...obj }
//     delete obj_new._id
//     return obj_new
//   })
// }

// function addTmpIds(array) {
//   return [...(array || [])].map(obj => {
//     if (!obj.tmp_id) {
//       const obj_new = { ...obj }
//       obj_new.tmp_id = uuidv4()
//       return obj_new
//     }
//
//     return obj
//   })
// }

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

  const updateProperty = useCallback((propertyKey, newPropertyValue, silent = false) => {
    const propertyTypes = {
      text: 'string',
      coverphoto: 'string',
      icon: 'string',
      imprint: 'string',
      privacy_policy: 'string',
      tags: 'string',
      checked: 'boolean',
      trigger: 'object',
      action: 'object',
      pronouns: 'string',
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
    }

    if (JSON.stringify(newProperties) !== JSON.stringify(properties)) {
      setProperties(newProperties)
      if (silent === false && onChange) {
        onChange(newProperties)
      }
    }
  }, [
    properties,
    setProperties,
    onChange,
  ])

  const publishProperties = useCallback(() => {
    if (onChange) {
      onChange(properties)
    }
  }, [properties, onChange])

  useEffect(() => {
    setProperties({
      ...defaultProperties,
      text: defaultProperties.text || '',
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
  // if (type === 'page') {
  //   propertiesFrameContent = <>
  //     <div className={classes.properties_row}>
  //     <h3><Localized id="properties_editor_imprint_label" /></h3>
  //     <div>
  //     <FancyInput>
  //       {({ setError }) => (
  //         <UrlInput
  //           onError={setError}
  //           onBlur={newValue => updateProperty('imprint', newValue)}
  //           defaultValue={properties.imprint}
  //           type="text"
  //           style={{
  //             margin: '0',
  //             width: '100%'
  //           }}
  //           // className="show_border_on_active"
  //         />
  //       )}
  //     </FancyInput>
  //     </div>
  //     </div>
  //
  //     <div className={classes.properties_row}>
  //     <h3><Localized id="properties_editor_privacy_policy_label" /></h3>
  //     <div>
  //     <FancyInput>
  //       {({ setError }) => (
  //         <UrlInput
  //           onError={setError}
  //           onBlur={newValue => updateProperty('privacy_policy', newValue)}
  //           defaultValue={properties.privacy_policy}
  //           type="text"
  //           style={{
  //             margin: '0',
  //             width: '100%'
  //           }}
  //           // className="show_border_on_active"
  //         />
  //       )}
  //     </FancyInput>
  //     </div>
  //     </div>
  //   </>
  // // } else if (type === 'redirect') {
  // //   propertiesFrameContent = <>
  // //     <div className={classes.properties_row}>
  // //     <h3><Localized id="path_editor_redirect_label" /></h3>
  // //     <FancyInput>
  // //       {({ setError }) => (
  // //         <UrlInput
  // //           onError={setError}
  // //           onBlur={newValue => updateProperty('link', newValue)}
  // //           type="text"
  // //           placeholder={getString('path_editor_redirect_placeholder')}
  // //           aria-label={getString('path_editor_redirect_label')}
  // //           defaultValue={properties.link}
  // //           style={{
  // //             marginRight: '0',
  // //             marginLeft: '0',
  // //             width: '100%'
  // //           }}
  // //           className="show_border_on_active"
  // //         />
  // //       )}
  // //     </FancyInput>
  // //     </div>
  // //   </>
  // } else if (type === 'person') {
  //   propertiesFrameContent = <>
  //     <div className={classes.properties_row}>
  //       <h3><Localized id="properties_editor_pronouns_label" /></h3>
  //       <HtmlInput
  //         defaultValue={properties.pronouns}
  //         onChange={newValue => updateProperty('pronouns', newValue, true)}
  //         onBlur={publishProperties}
  //         placeholder={'…'}
  //         style={{
  //           margin: '0',
  //           width: '100%',
  //         }}
  //         linebreaks={false}
  //         className={`type_text`}
  //       />
  //     </div>
  //   </>
  // } else
  if (type === 'checkbox') {
    propertiesFrameContent = <>
      <div className={classes.properties_row}>
        <h3><Localized id="properties_editor_checked_label" /></h3>
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
  } else if (type === 'button') {
    propertiesFrameContent = <>
      <div className={classes.properties_row}>
        <h3><Localized id="properties_editor_action_label" /></h3>
        <ActionInput
          onChange={newValue => updateProperty('action', newValue)}
          defaultValue={properties.action || {}}
          style={{
            marginRight: '0',
            marginLeft: '0',
            width: '100%'
          }}
        />
      </div>
    </>
  } else if (type === 'automation') {
    propertiesFrameContent = <>
      <div className={classes.properties_row}>
        <h3><Localized id="properties_editor_trigger_label" /></h3>
        <TriggerInput
          onChange={newValue => updateProperty('trigger', newValue)}
          defaultValue={properties.trigger || {}}
          style={{
            marginRight: '0',
            marginLeft: '0',
            width: '100%'
          }}
        />
      </div>
      <div className={classes.properties_row}>
        <h3><Localized id="properties_editor_action_label" /></h3>
        <ActionInput
          onChange={newValue => updateProperty('action', newValue)}
          defaultValue={properties.action || {}}
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
    {
      type === 'page'
      || type === 'person'
      || type === 'automation'
      ? <>
          <CoverphotoPicker
            coverphotoValue={properties.coverphoto}
            iconValue={properties.icon}
            onChange={newValue => updateProperty('coverphoto', newValue)}
          />
          <IconPicker
            iconValue={properties.icon}
            coverphotoValue={properties.coverphoto}
            onChange={newValue => updateProperty('icon', newValue)}
          />
        </>
      : null
    }

    <div className={classes.main_headline}>
      <HtmlInput
        defaultValue={properties.text}
        onChange={newValue => updateProperty('text', newValue, true)}
        onBlur={publishProperties}

        placeholder={getString('placeholder_main_headline')}
        style={{
          margin: '0 0 0 calc(8 * var(--basis))',
          padding: 'var(--basis) var(--basis_x2)',
        }}
        linebreaks={true}
        className={`type_h1`}
      />
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
