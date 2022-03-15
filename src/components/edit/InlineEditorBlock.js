import React, { useState, useCallback, useEffect, useRef } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import BlockMenu from './BlockMenu.js'
import useSaveBlock from '../../hooks/useSaveBlock.js'

import InlineEditorBlockText from './InlineEditorBlockText.js'
import InlineEditorBlockButton from './InlineEditorBlockButton.js'
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

  const handleChange_Type = useCallback(newValue => {
    const newBlock = {
      ...block,
      type: newValue,
    }

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
  }, [setBlock, block, saveBlock, onChange])

  // const handleChange = useCallback(newBlock => {
  //   setBlock(newBlock)

  //   if (onChange) {
  //     const target = wrapperDiv.current
  //     target.value = newBlock
  //     onChange({ target })
  //   }
  // }, [setBlock, onChange])

  const toggle_active = useCallback(() => {
    const newBlock = {
      ...block,
      properties: {
        ...block.properties,
        active: !active,
      },
    }

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
  }, [block, active, saveBlock, setBlock, onChange])

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

  const setOpenBlockMenuRef = useRef(null)
  const onArchiveToggle = useCallback(newArchivedValue => {
    if (
      typeof setOpenBlockMenuRef.current === 'function'
      && typeof onRemoveSelf === 'function'
    ) {
      setOpenBlockMenuRef.current(false)
      setTimeout(() => {
        onRemoveSelf()
      }, 200) // The fade-out animation is 200ms. Only rerender after it, for it not to loose the element.
    }
  }, [ setOpenBlockMenuRef, onRemoveSelf ])

  return <div
    className={`${classes.block} ${className}`}
    {...dataset}
  >

    <BlockMenu
      {...{
        block,
        setType: handleChange_Type,
        toggle_active,
        active,
        onRemoveRow,
        addRowBefore,
        addRowAfter,
      }}

      onArchivedToggle={onArchiveToggle}
      setOpenBlockMenuRef={setOpenBlockMenuRef}

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
