import { useState, useCallback, useEffect, useMemo } from 'react'

import { v4 as uuidv4 } from 'uuid'

import classes from './PropertiesEditor.module.css'

import { Localized, withLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import MultiButton from '../components/MultiButton.js'
import PermissionInput from '../components/PermissionInput.js'
import UrlInput from '../components/UrlInput.js'
import EmailInput from '../components/EmailInput.js'
import HtmlInput from '../components/HtmlInput.js'
import FancyInput from '../components/FancyInput.js'
import Repeater from '../components/Repeater.js'
import CoverphotoPicker from '../components/CoverphotoPicker.js'
import TranslationRepeater from '../components/TranslationRepeater.js'

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
  console.log('defaultProperties', defaultProperties)
  const defaultLocale = getString('default_locale')

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

  const [{email = ''} = {}] = useUser() || []

  const permissionsDefault = useMemo(() => (
      typeof email === 'string' && email.length > 0
      ? [{ tmp_id: uuidv4(), value: email, role: 'editor' }, { tmp_id: uuidv4(), value: '', role: 'editor' }]
      : []
  ), [email])
  const [permissions, setPermissions] = useState(permissionsDefault)
  const [viewPermission, setViewPermission] = useState(permissionsDefault)


  const updateProperty = useCallback((propertyKey, newPropertyValue) => {
    const propertyTypes = {
      text: 'array',
      slug: 'string',
      link: 'string',
      description: 'array',
      coverphoto: 'string',
      imprint: 'string',
      privacy_policy: 'string',
      permissions: 'array',
      tags: 'string',
    }

    const newProperties = { ...properties }

    if (propertyTypes.hasOwnProperty(propertyKey)) {
      switch (propertyTypes[propertyKey]) {
        case 'array':
          if (newPropertyValue.length > 0) {
            newProperties[propertyKey] = newPropertyValue
          }
        break
        case 'string':
          if (newPropertyValue !== '') {
            newProperties[propertyKey] = newPropertyValue
          }
        break
        default:
          console.log('nothing (default)')
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

  const handleChange_Permissions = useCallback(rows => {
    const filled_rows_length = rows
      .filter(p =>
        p.value !== ''
        && p.value !== '@volteuropa.org'
        && (!p.role || p.role === 'editor')
      )
      .length

    if (filled_rows_length === 0) {
      rows.unshift({ tmp_id: uuidv4(), value: email, role: 'editor' })
    }

    updateProperty('permissions', [
      ...rows,
      ...(!Array.isArray(viewPermission) && viewPermission !== '' ? [{ tmp_id: uuidv4(), value: viewPermission, role: 'viewer'}] : [])
    ])
  }, [email, updateProperty, viewPermission])

  const handleChange_ViewPermissions = useCallback(newViewPermission => {
    updateProperty('permissions', [
      ...properties.permissions,
      ...(!Array.isArray(newViewPermission) && newViewPermission !== '' ? [{ tmp_id: uuidv4(), value: newViewPermission, role: 'viewer'}] : [])
    ])
  }, [properties, updateProperty])

  useEffect(() => {
    const newProperties = defaultProperties

    newProperties.text = addTmpIds(newProperties.text)
    newProperties.description = addTmpIds(newProperties.description)
    setProperties(newProperties)

    let newPermissions = addTmpIds(newProperties.permissions)

    const filled_rows_length = newPermissions
      .filter(p =>
        p.value !== ''
        && p.value !== '@volteuropa.org'
        && (!p.role || p.role === 'editor')
      )
      .length

    if (filled_rows_length === 0) {
      newPermissions.unshift({ tmp_id: uuidv4(), value: email, role: 'editor' })
    }

    let viewPermissionTmp = newPermissions.filter(p => p.role === 'viewer')
    setPermissions(newPermissions.filter(p => p.value !== '' && p.value !== '@volteuropa.org'))

    viewPermissionTmp = viewPermissionTmp.length > 0 ? viewPermissionTmp[0].value : ''
    setViewPermission(viewPermissionTmp)
  }, [
    email,
    getString,
    defaultProperties,
    setProperties,
    permissionsDefault,
    setPermissions,
    setViewPermission,
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
    {
      type === 'page' || type === 'person'
        ? <CoverphotoPicker
          defaultValue={properties.coverphoto}
          onChange={coverphoto => updateProperty('coverphoto', coverphoto)}
        />
        : null
    }



    <div
      className={classes.properties_row}
      style={{
        width: '1000px',
        maxWidth: 'calc(100% - var(--basis_x8))',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}
    >
    <TranslationRepeater
      onChange={(value) => updateProperty('text', value)}
      defaultValue={properties.text || []}
      addDefaultValue={() => ({ tmp_id: uuidv4(), locale: defaultLocale, value: '' })}
      addButtonText={getString('path_editor_add_translation')}
      input={InputWithLocal_props => <HtmlInput
        type="text"
        {...InputWithLocal_props}
        style={{
          ...InputWithLocal_props.style,
          margin: '0',
        }}
        className="type_h1"
      />}
    />
    </div>

    <div className={classes.propertiesFrame}>

    <div className={classes.properties_row}>
    <h3><Localized id="path_editor_description_label" /></h3>
    <TranslationRepeater
      onChange={(value) => updateProperty('description', value)}
      defaultValue={properties.description || []}
      addDefaultValue={() => ({ tmp_id: uuidv4(), locale: defaultLocale, value: '' })}
      addButtonText={getString('path_editor_add_translation')}
      input={InputWithLocal_props => <HtmlInput
        aria-label={getString('path_editor_description_label')}
        placeholder={getString('path_editor_description_placeholder')}
        {...InputWithLocal_props}
        style={{
          ...InputWithLocal_props.style,
          margin: '0',
        }}
        className="type_text"
      />}
    />
    </div>


      <div className={classes.properties_row}>
      <h3><Localized id="path_editor_tags_label" /></h3>
      <HtmlInput
        onChange={(value) => updateProperty('tags', value)}
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
      </div>

    <div className={classes.properties_row}>
      <h3><Localized id="path_editor_permissions_edit_label" /></h3>
      <div>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_edit_info" /></em>
    <Repeater
      onChange={handleChange_Permissions}
      defaultValue={permissions}
      addDefaultValue={() => ({ tmp_id: uuidv4(), value: '', role: 'editor' })}
      addButtonText={getString('path_editor_permissions_edit_add_button_label')}
      render={
        ({ defaultValue, ...repeater_props }) => {
          return <PermissionInput
              defaultValue={defaultValue}
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
    </div>
    </div>

    <div className={classes.properties_row}>
    <h3><Localized id="path_editor_permissions_view_label" /></h3>
    <div>
    <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}><Localized id="path_editor_permissions_view_info" /></em>
    <MultiButton
      onChange={handleChange_ViewPermissions}
      ariaLabel={getString('path_editor_permissions_view_label')}
      defaultValue={viewPermission}
      items={[
        { value: '', title: getString('path_editor_permissions_view_public') },
        { value: '@volteuropa.org', title: getString('path_editor_permissions_view_volteuropa') },
      ]}
    />
    </div>
    </div>

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
                onChange={(value) => updateProperty('imprint', value)}
                defaultValue={properties.imprint}
                type="text"
                style={{
                  marginRight: '0',
                  marginLeft: '0',
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
                onChange={(value) => updateProperty('privacy_policy', value)}
                defaultValue={properties.privacy_policy}
                type="text"
                style={{
                  marginRight: '0',
                  marginLeft: '0',
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
                    onChange={(value) => updateProperty('link', value)}
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
