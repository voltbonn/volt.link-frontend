import React, { useState, useCallback, useEffect } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import BlockMenu from './BlockMenu.js'
import useSaveBlock from '../../hooks/useSaveBlock.js'

import InlineEditorBlockText from './InlineEditorBlockText.js'
import InlineEditorBlockButton from './InlineEditorBlockButton.js'
import InlineEditorBlockRedirect from './InlineEditorBlockRedirect.js'
import InlineEditorBlockDivider from './InlineEditorBlockDivider.js'
import InlineEditorBlockCheckbox from './InlineEditorBlockCheckbox.js'
import InlineEditorBlockPerson from './InlineEditorBlockPerson.js'
import InlineEditorBlockPage from './InlineEditorBlockPage.js'
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
      component = <InlineEditorBlockPerson {...props} />
    break;
    case 'page':
      component = <InlineEditorBlockPage {...props} />
    break;
    // case 'code':
    //   component = <InlineEditorBlockCode {...props} />
    // break;
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

  const saveBlockCallback = useCallback(newBlock => {
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
    const newBlock = {
      ...block,
      type: newValue,
    }

    saveBlockCallback(newBlock)
  }, [ block, saveBlockCallback])

  const saveProperty = useCallback((propertyName, newValue) => {
    if (typeof propertyName === 'string') {
      const newProperties = { ...block.properties }
      if (newValue === null || newValue === undefined) {
        newProperties[propertyName] = null
      } else {
        newProperties[propertyName] = newValue
      }

      if (newProperties !== block.properties) {
        const newBlock = {
          ...block,
          properties: newProperties,
        }

        saveBlockCallback(newBlock)
      }
    }
  }, [ block, saveBlockCallback ])

  // const handleChange = useCallback(newBlock => {
  //   setBlock(newBlock)

  //   if (onChange) {
  //     const target = wrapperDiv.current
  //     target.value = newBlock
  //     onChange({ target })
  //   }
  // }, [setBlock, onChange])

  const handleBlockChange = useCallback(newBlock => {
    if (JSON.stringify(newBlock) !== JSON.stringify(block)) {
      saveBlock(newBlock)
        .then((newBlock) => {
          setBlock(newBlock)
          if (!block._id || block._id !== newBlock._id) {
            onChange({
              blockId: newBlock._id,
              block: newBlock,
            })
          }
        })
    }
  }, [saveBlock, block, onChange])

  const handleSaveBlock = useCallback((newBlock, callback) => {
    saveBlock(newBlock)
      .then(newBlock => {
        if (callback) {
          callback(newBlock)
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
