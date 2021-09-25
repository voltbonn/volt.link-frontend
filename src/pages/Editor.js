import { useState, useCallback, useEffect } from 'react'

import {
  useParams
} from 'react-router-dom'

import { useApolloClient } from '@apollo/client'
import { getBlockBySlug_Query } from '../graphql/queries'
import { saveBlock_Mutation } from '../graphql/mutations.js'

import { useSnackbar } from 'notistack'

// import Select from 'react-select'

import {
  QrCodeSharp as QrCodeIcon,
  AssessmentSharp as AssessmentIcon,
  PublishSharp as PublishIcon,
  MenuSharp as MenuIcon,
} from '@mui/icons-material'

import classes from './Editor.module.css'
import { Localized, withLocalization } from '../fluent/Localized.js'
import Header from '../components/Header.js'
import BlockMenu from '../components/BlockMenu.js'
import PropertiesEditor from '../components/PropertiesEditor.js'
import ContentEditor from '../components/ContentEditor.js'

// import { OverflowMenu } from '../components/OverflowMenu.js'

// const custom_react_select_styles = {
//   menu: (provided, state) => ({
//     ...provided,
//     background: 'var(--purple)',
//   }),
// }
// const custom_react_select_theme = theme => ({
//   ...theme,
//   borderRadius: 0,
//   colors: {
//     ...theme.colors,
//     primary: 'var(--green)',
//     primary25: 'var(--purple-dark)',
//   },
// })

function Editor({ getString }) {
  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [_id, setID] = useState(null)

  const { code: slug = '' } = useParams()

  const [loadingContent, setLoadingContent] = useState(true)
  const [canEdit, setCanEdit] = useState(true)

  const [type, setType] = useState('')
  const [properties, setProperties] = useState({})

  const [content, setContent] = useState([])
  const handleChange_Content = useCallback(newContent => { // TODO: remove this, as the set function is enough
    console.log('handleChange_Content-newContent', newContent)
    setContent(newContent)
  }, [setContent])

  const handlePropertiesChange = useCallback(newProperties => { // TODO: remove this, as the set function is enou
    console.log('handlePropertiesChange-newProperties', newProperties)
    setProperties(newProperties)
  }, [setProperties])

  useEffect(() => {
    console.log('loading content')
    let snackbarKey = null

    setCanEdit(true)
    setLoadingContent(true)

    const loadingDataPromise = new Promise(resolve => {
      apollo_client.query({
        query: getBlockBySlug_Query,
        variables: {
          slug,
        },
      })
        .then(async ({ data }) => {
          resolve('got-data')

          if (snackbarKey !== null) {
            closeSnackbar(snackbarKey)
          }

          if (typeof data.error === 'string' || !data.blockBySlug) {
            if (data.error === 'no_edit_permission') {
              setLoadingContent(false)
              setCanEdit(false)
              enqueueSnackbar(getString('path_editor_edit_permission_error'), {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 5000,
              })
            } else {
              enqueueSnackbar('' + data.error, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 5000,
              })
            }
          }else{
            data = data.blockBySlug

            console.log('data', data)
            let {
              _id = '',
              type = '',
              properties = {},
              content = [],
            } = data

            if (slug !== '') {
              properties = { ...properties, slug }
            }

            setID(_id)
            setType(type)
            setProperties(properties)
            setContent(content)

            setLoadingContent(false)
          }
        })
        .catch(async error => {
          console.error(error)
          resolve('got-error')

          if (snackbarKey !== null) {
            closeSnackbar(snackbarKey)
          }

          enqueueSnackbar('[could not load data] '+error.message, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        })
    })

    // Show a loading-info-snackbar if loading the data takes too long.
    Promise.race([
      new Promise(resolve => {
        setTimeout(() => {
          resolve('show-loading')
        }, 300)
      }),
      loadingDataPromise,
    ])
      .then(response => {
        if (response === 'show-loading') {
          snackbarKey = enqueueSnackbar(getString('path_editor_status_started_loading'), {
            persist: true,
            preventDuplicate: true,
          })
        }
      })
      .catch(error => console.error)
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
    setLoadingContent,
    setCanEdit,
    slug,
    setType,
    setContent
  ])

  const handleSave = useCallback(() => {
    let snackbarKey = null

    const block = {
      _id,
      type,
      properties,
      content: content || [],
    }

    const loadingDataPromise = new Promise(resolve => {
      apollo_client.mutate({
        mutation: saveBlock_Mutation,
        variables: {
          block,
        },
      })
        .then(async ({ data }) => {
          resolve('got-data')

          if (snackbarKey !== null) {
            closeSnackbar(snackbarKey)
          }

          if (typeof data.error === 'string') {
            if (data.error === 'no_edit_permission') {
              enqueueSnackbar(getString('path_editor_edit_permission_error'), {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 2000,
              })
            } else {
              enqueueSnackbar('' + data.error, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 2000,
              })
            }
          } else {
            enqueueSnackbar(getString('path_editor_status_saved'), {
              variant: 'success',
              preventDuplicate: false,
              autoHideDuration: 2000,
            })
          }
        })
        .catch(async error => {
          console.error(error)
          resolve('got-error')

          if (snackbarKey !== null) {
            closeSnackbar(snackbarKey)
          }

          enqueueSnackbar(getString('path_editor_status_error_while_saving', {
            error: error.message,
          }), {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        })
    })

    // Show a loading-info-snackbar if loading the data takes too long.
    Promise.race([
      new Promise(resolve => {
        setTimeout(() => {
          resolve('show-loading')
        }, 300)
      }),
      loadingDataPromise,
    ])
      .then(response => {
        if (response === 'show-loading') {
          snackbarKey = enqueueSnackbar(getString('path_editor_status_started_saving'), {
            persist: true,
            preventDuplicate: true,
          })
        }
      })
      .catch(error => console.error)
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
    _id,
    type,
    properties,
    content,
  ])

  const viewStatistics = useCallback(()=>{
    const a = document.createElement('a')
    a.href = `https://umami.qiekub.org/share/s0ZHBZbb/volt.link?url=%2F${slug}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }, [slug])

  const gotoQrcodePage = () => {
    const a = document.createElement('a')
    a.href = `https://qrcode.volt.link/?c=volt.link/${slug}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    {/* <button className="text"><Localized id="path_editor_share"/></button> */}
    <button className="text hasIcon" onClick={gotoQrcodePage}>
      <span style={{pointerEvents: 'none'}}>
        <QrCodeIcon className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_qrcode" /></span>
      </span>
    </button>
    <button className="text hasIcon" onClick={viewStatistics}>
      <span style={{pointerEvents: 'none'}}>
        <AssessmentIcon className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_statistics" /></span>
      </span>
    </button>
    <button className="green hasIcon" onClick={handleSave}>
      <span style={{pointerEvents: 'none'}}>
        <PublishIcon className="icon" />
        <span style={{verticalAlign: 'middle'}}><Localized id="path_editor_save" /></span>
      </span>
    </button>

    <BlockMenu
      {...{
        type,
        setType,
      }}

      trigger={props => (
        <button
          {...props}
          className="white hasIcon"
        >
          <span style={{pointerEvents: 'none'}}>
            <MenuIcon className="icon" />
          </span>
        </button>
      )}
    />
  </div>

  return <div
    className={`hasHeader ${classes.editor} ${loadingContent ? classes.loadingContent : ''}`}
  >
    <Header
      title={<a href={`https://volt.link/${slug}`} target="_blank" rel="noopener noreferrer"><span className="hideOnSmallScreen">volt.link</span>/{slug}</a>}
      rightActions={canEdit ? rightHeaderActions : null}
    />

    {
      canEdit
        ? <>
          {/* <OverflowMenu key="OverflowMenu" /> */}

          <PropertiesEditor
            type={type}
            defaultProperties={properties}
            onChange={handlePropertiesChange}
          />

          <ContentEditor
            onChange={handleChange_Content}
            defaultValue={content}
          />
        </>
        : <p style={{ marginTop: 'var(--basis)' }}><Localized id="path_editor_edit_permission_error" /></p>
    }
  </div>
}

export default withLocalization(Editor)
