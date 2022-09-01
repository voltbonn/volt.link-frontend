import React, { useState, useCallback, useEffect } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import BlockMenu from './BlockMenu.js'
import useSaveBlock from '../../hooks/useSaveBlock.js'

import InlineEditorBlockText from './InlineEditorBlockText.js'
import InlineEditorBlockButton from './InlineEditorBlockButton.js'
import InlineEditorBlockRedirect from './InlineEditorBlockRedirect.js'
import InlineEditorBlockDivider from './InlineEditorBlockDivider.js'
import InlineEditorBlockCheckbox from './InlineEditorBlockCheckbox.js'
import InlineEditorBlockPage from './InlineEditorBlockPage.js'
import InlineEditorBlockImage from './InlineEditorBlockImage.js'
// import InlineEditorBlockCode from './InlineEditorBlockCode.js'

import classes from './InlineEditorBlock.module.css'

// function addIds(array){
//   if (Array.isArray(array)) {
//     return array.map(item => {
//       let new_item = { ...item }
//       if (!new_item.hasOwnProperty('_id')) {
//         new_item._id = uuidv4()
//       }
//       return new_item
//     })
//   }
//   return array
// }

// function stripIDs(array){
//   return [...array].map(obj => {
//     const obj_new = { ...obj }
//     delete obj_new._id
//     return obj_new
//   })
// }

function InlineEditorBlockInbetweenComponent({ type = 'text', ...props }){
  let component = null

  switch (type) {
    case 'button':
      component = <InlineEditorBlockButton {...props} />
      break;
    case 'redirect':
      component = <InlineEditorBlockRedirect {...props} />
      break;
    case 'divider':
      component = <InlineEditorBlockDivider {...props} />
      break;
    case 'checkbox':
      component = <InlineEditorBlockCheckbox {...props} />
      break;
    case 'person':
      component = <InlineEditorBlockPage {...props} />
      break;
    case 'page':
      component = <InlineEditorBlockPage {...props} />
      break;
    case 'poster':
      component = <InlineEditorBlockPage {...props} />
      break;
    case 'image':
      component = <InlineEditorBlockImage {...props} />
      break;
    // case 'code':
    //   component = <InlineEditorBlockCode {...props} />
    //   break;
    default:
      component = <InlineEditorBlockText {...props} />
  }

  return component
}

function InlineEditorBlockRaw({
  fluentByObject,
  getString,
  contentConfig = {},
  className,
  onChange,
  reorderHandle,
  onRemoveRow,
  actionButton,
  dataset = {},
  addRowBefore,
  addRowAfter,
  permissions = [],

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeFromNextInput,
  onRemoveSelf,
}) {
  const saveBlock = useSaveBlock()

  // const defaultLocale = getString('default_locale')

  const [block, setBlock] = useState({
    ...(contentConfig.block || { type: 'text' }),
    _id: contentConfig.blockId || null,
  })
  const properties = block.properties || {}
  const active = typeof properties.active === 'boolean' ? properties.active : true

  useEffect(() => {
    if (contentConfig.block) {
      setBlock(contentConfig.block)
    }
  }, [contentConfig.block])

  const handleBlockChange = useCallback(newBlock => {
    saveBlock(newBlock)
      .then(gottenBlock => {
        setBlock(gottenBlock)
        if (!block._id || block._id !== gottenBlock._id) {
          onChange({
            blockId: gottenBlock._id,
            block: gottenBlock,
          })
        }
      })
  }, [block, onChange, saveBlock])

  const saveType = useCallback(newValue => {
    handleBlockChange({
      _id: block._id,
      type: newValue,
    })
  }, [block, handleBlockChange])

  const saveProperty = useCallback((propertyName, newValue) => {
    if (typeof propertyName === 'string') {
      if (newValue === null || newValue === undefined) {
        newValue = null
      }

      handleBlockChange({
        _id: block._id,
        properties: {
          [propertyName]: newValue,
        },
      })
    }
  }, [block._id, handleBlockChange])

  // const handleChange = useCallback(newBlock => {
  //   setBlock(newBlock)
  //
  //   if (onChange) {
  //     const target = wrapperDiv.current
  //     target.value = newBlock
  //     onChange({ target })
  //   }
  // }, [setBlock, onChange])

  const handleSaveBlock = useCallback((newBlock, callback) => {
    saveBlock(newBlock)
      .then(gottenBlock => {
        if (typeof callback === 'function') {
          callback(gottenBlock)
        }
      })
      .catch(console.error)
  }, [ saveBlock ])

  const onArchiveToggle = useCallback(newArchivedValue => {
    if (typeof onRemoveSelf === 'function') {
      onRemoveSelf()
    }
  }, [onRemoveSelf])

  return <div
    className={`${classes.block} ${className}`}
    {...dataset}
  >

    <BlockMenu
      {...{
        block,
        saveType,
        saveProperty,
        onRemoveRow,
        addRowBefore,
        addRowAfter,
      }}

      onArchivedToggle={onArchiveToggle}

      trigger={props => (
        <div
          {...props}
          className={classes.reorderHandle}
        >
          {reorderHandle}
        </div>
      )}
    />

    <div className={`${classes.block_input} ${(active ? classes.form_active : classes.form_deactivated)}`}>
      <InlineEditorBlockInbetweenComponent
        type={block.type}
        block={block}
        onChange={handleBlockChange}
        onSaveBlock={handleSaveBlock}
        saveProperty={saveProperty}

        onInputRef={onInputRef}
        onGoToPrevInput={onGoToPrevInput}
        onGoToNextInput={onGoToNextInput}
        onSplitText={onSplitText}
        onMergeToPrevInput={onMergeToPrevInput}
        onMergeFromNextInput={onMergeFromNextInput}

        onAddRowAfter={addRowAfter}
      />
    </div>

  </div>
}

const InlineEditorBlock = withLocalization(InlineEditorBlockRaw)

export default InlineEditorBlock
