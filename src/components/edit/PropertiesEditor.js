import { useState, useCallback, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import classes from './PropertiesEditor.module.css'

import { Localized, withLocalization } from '../../fluent/Localized.js'
import UrlInput from './UrlInput.js'
import HtmlInput from './HtmlInput.js'
import FancyInput from './FancyInput.js'
import CoverphotoPicker from './CoverphotoPicker.js'
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
      slug: 'string',
      link: 'string',
      description: 'array',
      coverphoto: 'string',
      imprint: 'string',
      privacy_policy: 'string',
      tags: 'string',
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

  return <>
    <CoverphotoPicker
      defaultValue={properties.coverphoto}
      onChange={coverphoto => updateProperty('coverphoto', coverphoto)}
    />

    <div className={classes.main_headline}>
      <TranslatedInput
        defaultValue={properties.text}
        onBlur={(value) => updateProperty('text', value)}
      >
        {(translatedInputProps) => {
          return (
          <HtmlInput
            placeholder={getString('placeholder_main_headline')}
            style={{ margin: '0' }}
            linebreaks={true}
            className={`${classes.main_headline_input} type_h1`}
            {...translatedInputProps}
          />
          )
        }}
      </TranslatedInput>
    </div>

    <div className={classes.propertiesFrame}>

      <div className={classes.properties_row}>
        <h3><Localized id="path_editor_description_label" /></h3>
        <TranslatedInput
          defaultValue={properties.description}
          onBlur={(value) => updateProperty('description', value)}
        >
          {(translatedInputProps) => {
            return (
            <HtmlInput
              aria-label={getString('path_editor_description_label')}
              placeholder={getString('path_editor_description_placeholder')}
              style={{ margin: '0' }}
              linebreaks={true}
              className="type_text"
              {...translatedInputProps}
            />
            )
          }}
        </TranslatedInput>
      </div>

      {/* <div className={classes.properties_row}>
        <h3><Localized id="path_editor_tags_label" /></h3>
        <HtmlInput
          onBlur={(value) => updateProperty('tags', value)}
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

      {
        type === 'page' || type === 'person'
          ? <>
            <div className={classes.properties_row}>
            <h3><Localized id="path_editor_imprint_label" /></h3>
            <div>
            <FancyInput>
              {({ setError }) => (
                <UrlInput
                  onError={setError}
                  onBlur={(value) => updateProperty('imprint', value)}
                  defaultValue={properties.imprint}
                  type="text"
                  style={{
                    margin: '0',
                    width: 'calc(100% - var(--basis_x2))'
                  }}
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
                  onBlur={(value) => updateProperty('privacy_policy', value)}
                  defaultValue={properties.privacy_policy}
                  type="text"
                  style={{
                    margin: '0',
                    width: 'calc(100% - var(--basis_x2))'
                  }}
                />
              )}
            </FancyInput>
            </div>
            </div>
          </>
          : (
            type === 'redirect'
              ? <>
                <div className={classes.properties_row}>
                <h3><Localized id="path_editor_redirect_label" /></h3>
                <FancyInput>
                  {({ setError }) => (
                    <UrlInput
                      onError={setError}
                      onBlur={(value) => updateProperty('link', value)}
                      type="text"
                      placeholder={getString('path_editor_redirect_placeholder')}
                      aria-label={getString('path_editor_redirect_label')}
                      defaultValue={properties.link}
                      style={{
                        marginRight: '0',
                        marginLeft: '0',
                        width: 'calc(100% - var(--basis_x2))'
                      }}
                    />
                  )}
                </FancyInput>
                </div>
              </>
              : null
          )
      }
    </div>
  </>
}

export default withLocalization(PropertiesEditor)
