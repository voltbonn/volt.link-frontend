import { useState, useCallback } from 'react'

import useSaveBlock from '../../hooks/useSaveBlock.js'

import { Helmet } from 'react-helmet'

// import Select from 'react-select'

import {
  // TranslateSharp as TranslateIcon,
  IosShareSharp as ShareIcon,
  SaveSharp as SaveIcon,
  MoreVertSharp as BlockMenuIcon,
} from '@mui/icons-material'

import MdiIcon from '@mdi/react'
import {
  mdiTranslate,
  mdiLockAlert, // mdiLock
  mdiAccountLockOpen, // mdiAccountGroup
  mdiEarth, // mdiLockOpen mdiEarth mdiLockOpenVariant
} from '@mdi/js'

import classes from './PageEditor.module.css'

import { Localized, useLocalization } from '../../fluent/Localized.js'
// import { useTranslatedInputContext, LocalesMenu } from '../edit/TranslatedInput.js'

import Header from '../Header.js'
import BlockMenu from '../edit/BlockMenu.js'
import SharingEditor from '../edit/SharingEditor.js'
import TranslationEditor from '../edit/TranslationEditor.js'
import PermissionsEditor from '../edit/PermissionsEditor.js'
import PropertiesEditor from '../edit/PropertiesEditor.js'
import ContentEditor from '../edit/ContentEditor.js'

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

function flattenObject(obj, parentKey = null, res = {}) {
  // source: https://jeffdevslife.com/p/flatten-object-with-javascript/
  for (let key in obj) {
    const propName = parentKey ? parentKey + '.' + key : key
    if (typeof (obj[key]) === 'object' && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

function unflattenObject(obj) {
  // source: https://jeffdevslife.com/p/unflatten-object-with-javascript/
  let res = {}
  for (let key in obj) {
    const keys = key.split('.')
    keys.reduce((acc, value, index) => {
      return acc[value] || (acc[value] = keys.length - 1 === index ? obj[key] : {})
    }, res)
  }
  return res
}

function PageEditor({
  block,
  onSaveBlock,
}) {
  const { getString } = useLocalization()

  const saveBlock = useSaveBlock()

  // const { currentLocale, setLocales } = useTranslatedInputContext()

  const [ isSharingEditorOpen, setIsSharingEditorOpen ] = useState(false)
  const openSharingEditor = useCallback(() => setIsSharingEditorOpen(true), [ setIsSharingEditorOpen ])
  const closeSharingEditor = useCallback(() => setIsSharingEditorOpen(false), [ setIsSharingEditorOpen ])

  const [ isTranslationEditorOpen, setIsTranslationEditorOpen ] = useState(false)
  const openTranslationEditor = useCallback(() => setIsTranslationEditorOpen(true), [ setIsTranslationEditorOpen ])
  const closeTranslationEditor = useCallback(() => setIsTranslationEditorOpen(false), [ setIsTranslationEditorOpen ])

  const [ isPermissionsEditorOpen, setIsPermissionsEditorOpen ] = useState(false)
  const openPermissionsEditor = useCallback(() => setIsPermissionsEditorOpen(true), [ setIsPermissionsEditorOpen ])
  const closePermissionsEditor = useCallback(() => setIsPermissionsEditorOpen(false), [ setIsPermissionsEditorOpen ])

  // const [block, setBlock] = useState({
  //   type: defaultType || 'page',
  //   properties: defaultProperties || {},
  //   content: defaultContent || [],
  //   ...defaultBlockRest,
  // })
  const type = block.type
  const properties = block.properties
  const content = block.content
  const permissions = block.permissions

  const saveType = useCallback(newType => {
    if (newType !== block.type) {
      const newBlock = {
        ...block,
        type: newType,
      }

      saveBlock(newBlock)
        .then(gottenBlock => {
          onSaveBlock(gottenBlock)
        })
    }
  }, [block, saveBlock, onSaveBlock])

  const saveProperties = useCallback(newProperties => {
    if (newProperties !== block.properties) {
      const oldPropertiesFlattend = flattenObject(block.properties)
      const newPropertiesFlattend = flattenObject(newProperties)

      let divergingProperties = {}

      for (const key in newPropertiesFlattend) {
        if (newPropertiesFlattend.hasOwnProperty(key)) {
          if (oldPropertiesFlattend[key] !== newPropertiesFlattend[key]) {
            divergingProperties[key] = newPropertiesFlattend[key]
          }
        }
      }

      for (const key in oldPropertiesFlattend) {
        if (
          oldPropertiesFlattend.hasOwnProperty(key)
          && !newPropertiesFlattend.hasOwnProperty(key)
          && !divergingProperties.hasOwnProperty(key)
        ) {
          divergingProperties[key] = null
        }
      }

      divergingProperties = unflattenObject(divergingProperties)

      if (Object.keys(divergingProperties).length > 0) {
        saveBlock({
          _id: block._id,
          properties: divergingProperties,
        })
          .then(gottenBlock => {
            onSaveBlock(gottenBlock)
          })
      }
    }
  }, [block, saveBlock, onSaveBlock])

  const saveProperty = useCallback((propertyName, newValue) => {
    if (typeof propertyName === 'string') {
      saveBlock({
        _id: block._id,
        properties: {
          [propertyName]: newValue
        }
      })
        .then(gottenBlock => {
          onSaveBlock(gottenBlock)
        })
    }
  }, [block, saveBlock, onSaveBlock])

  const saveContent = useCallback(newContent => {
    if (newContent !== block.content) {
      const newBlock = {
        _id: block._id,
        content: newContent,
      }

      saveBlock(newBlock)
        .then(gottenBlock => {
          onSaveBlock(gottenBlock)
        })
    }
  }, [block, saveBlock, onSaveBlock])

  const savePermissions = useCallback(newPermissions => {
    if (newPermissions !== block.permissions) {
      const newBlock = {
        _id: block._id,
        permissions: newPermissions,
      }

      saveBlock(newBlock)
        .then(gottenBlock => {
          onSaveBlock(gottenBlock)
        })
    }
  }, [block, saveBlock, onSaveBlock])

  const manuallySaveEverything = useCallback(() => {
    saveBlock(block)
      .then(gottenBlock => {
        if (gottenBlock._id !== block._id) {
          onSaveBlock(gottenBlock)
        }
      })
  }, [saveBlock, block, onSaveBlock])

  // const isFirstRun = useRef(true)
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false
  //     return;
  //   }
  //
  //   if (
  //     Object.keys(block).length > 0
  //     && JSON.stringify(initialBlock) !== JSON.stringify(block)
  //   ) {
  //   }
  // }, [isFirstRun, initialBlock, block])



  // START permissions icon
  let PermissionsIcon = mdiLockAlert
  if (
    !!block
    && !!block.computed
    && !!block.computed.inherited_block_permissions
    && Array.isArray(block.computed.inherited_block_permissions)
  ) {
    const inherited_block_permissions_obj = block.computed.inherited_block_permissions
      .reduce((acc, curr) => {
        acc[curr.email] = curr.role
        return acc
      }, {})

    if (
      inherited_block_permissions_obj['@public'] === 'viewer'
      || inherited_block_permissions_obj['@public'] === 'editor'
      || inherited_block_permissions_obj['@public'] === 'owner'
    ) {
      PermissionsIcon = mdiEarth
    } else if (
      inherited_block_permissions_obj['@volteuropa.org'] === 'viewer'
      || inherited_block_permissions_obj['@volteuropa.org'] === 'editor'
      || inherited_block_permissions_obj['@volteuropa.org'] === 'owner'
    ) {
      PermissionsIcon = mdiAccountLockOpen
    }
  }
  // END permissions icon



  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    {/* <button className="text"><Localized id="path_editor_share"/></button> */}


    {/*
    <LocalesMenu
      trigger={triggerProps => (
        <button {...triggerProps} className="text hasIcon">
          <TranslateIcon className="icon" />
          <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>
            <Localized id="path_editor_translate" />
            {getString('locale_'+currentLocale)}
          </span>
        </button>
      )}
    />
    */}

    {
      isSharingEditorOpen
      ? <SharingEditor
          defaultBlock={block}
          open={isSharingEditorOpen}
          onClose={closeSharingEditor}
          onChange={saveProperties}
        />
      : null
    }
    <button className="text hasIcon" onClick={openSharingEditor}>
      <ShareIcon className="icon" />
      <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_share" /></span>
    </button>

    {
      type !== 'divider'
      ? <>
        {
          isTranslationEditorOpen
          ? <TranslationEditor
              defaultBlock={block}
              open={isTranslationEditorOpen}
              onClose={closeTranslationEditor}
              onSaveProperty={saveProperty}
            />
          : null
        }
        <button className="text hasIcon" onClick={openTranslationEditor}>
          <MdiIcon
            path={mdiTranslate}
            className="icon"
          />
          <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_translate" /></span>
        </button>
      </>
      : null
    }

    {
      isPermissionsEditorOpen
      ? <PermissionsEditor
          defaultPermissions={permissions}
          open={isPermissionsEditorOpen}
          onClose={closePermissionsEditor}
          onChange={savePermissions}
        />
      : null
    }
    <button className="red hasIcon" onClick={openPermissionsEditor}>
      <MdiIcon
        path={PermissionsIcon}
        className="icon"
      />
      <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_permissions" /></span>
    </button>

    <button className="text hasIcon" onClick={manuallySaveEverything}>
      <SaveIcon className="icon" />
      <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="path_editor_publish" /></span>
    </button>

    <BlockMenu
      {...{
        block,
        saveType,
        saveProperty,
      }}

      typeOptions={[
        'page',
        'redirect',
      ]}

      trigger={props => (
        <button
          {...props}
          className="default hasIcon"
        >
          <BlockMenuIcon className="icon" />
        </button>
      )}
    />
  </div>

  const title = block?.properties?.text || getString('placeholder_headline_empty')
  const helmet_title = `✍️ ${title}`

  return <div key={block._id} className={`hasHeader ${classes.editor} ${typeof type === 'string' && type !== '' ? classes['type_'+type] : ''}`}>
    <Helmet>
      <title>{helmet_title}</title>
      <meta name="title" content={helmet_title} />
      <meta name="og:title" content={helmet_title} />
      <meta name="twitter:title" content={helmet_title} />

      <meta name="description" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:description" content="" />

      <meta property="og:image" content="" />
      <meta name="twitter:image" content="" />

      <meta property="twitter:card" content="summary" />
    </Helmet>
    
    <Header
      block={block}
      // title={<a href={`https://volt.link/${slug}`} target="_blank" rel="noopener noreferrer"><span className="hideOnSmallScreen">volt.link</span>/{slug}</a>}
      title={title}
      rightActions={rightHeaderActions}
    />

    <PropertiesEditor
      type={type}
      defaultProperties={properties}
      onChange={saveProperties}
    />

    <ContentEditor
      parentId={block._id || null}
      onChange={saveContent}
      defaultValue={content}
    />
  </div>
}

export default PageEditor
