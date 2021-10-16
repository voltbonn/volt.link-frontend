import React, { useState, useCallback, useEffect } from 'react'

import { withLocalization } from '../../fluent/Localized.js'

import BlockMenu from './BlockMenu.js'
import useSaveBlock from '../../hooks/useSaveBlock.js'
import useLoadBlock from '../../hooks/useLoadBlock.js'

import InlineEditorBlockText from './InlineEditorBlockText.js'
import InlineEditorBlockButton from './InlineEditorBlockButton.js'
import InlineEditorBlockHeadline from './InlineEditorBlockHeadline.js'
import InlineEditorBlockDivider from './InlineEditorBlockDivider.js'
import InlineEditorBlockCheckbox from './InlineEditorBlockCheckbox.js'

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
    case 'headline':
      component = <InlineEditorBlockHeadline {...props} />
    break;
    case 'divider':
      component = <InlineEditorBlockDivider {...props} />
    break;
    case 'checkbox':
      component = <InlineEditorBlockCheckbox {...props} />
    break;
    default:
      component = <InlineEditorBlockText {...props} />
  }

  return component
}

function InlineEditorBlockRaw({
  fluentByObject,
  getString,
  defaultContentConfig = {},
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
  onMergeToNextInput,
}) {
  const saveBlock = useSaveBlock()
  const loadBlock = useLoadBlock()

  // const defaultLocale = getString('default_locale')

  const [block, setBlock] = useState({
    _id: defaultContentConfig.blockId || null,
  })
  const properties = block.properties || {}
  const active = typeof properties.active === 'boolean' ? properties.active : true

  useEffect(() => {
    if (Object.keys(block).length === 1 && block.hasOwnProperty('_id')) {
      loadBlock(block._id)
        .then(loadedBlock => {
          setBlock(loadedBlock)
        })
    }
  }, [
    loadBlock,
    setBlock,
    block,
  ])

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
          })
        }
      })
  }, [block, active, saveBlock, setBlock, onChange])

  const handleSaveBlock = useCallback(newBlock => {
    if (JSON.stringify(newBlock) !== JSON.stringify(block)) {
      saveBlock(newBlock)
        .then((newBlock) => {
          setBlock(newBlock)
          if (!block._id || block._id !== newBlock._id) {
            onChange({
              blockId: newBlock._id,
            })
          }
        })
    }
  }, [saveBlock, block, onChange])

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
        onChange={handleSaveBlock}
        onSaveBlock={handleSaveBlock}

        onInputRef={onInputRef}
        onGoToPrevInput={onGoToPrevInput}
        onGoToNextInput={onGoToNextInput}
        onSplitText={onSplitText}
        onMergeToPrevInput={onMergeToPrevInput}
        onMergeToNextInput={onMergeToNextInput}

        onAddRowAfter={addRowAfter}
      />
    </div>

  </div>
}

const InlineEditorBlock = withLocalization(InlineEditorBlockRaw)

export default InlineEditorBlock
