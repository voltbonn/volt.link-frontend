import { useState, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { withLocalization } from '../fluent/Localized.js'
import Repeater from '../components/Repeater.js'
import InlineEditorBlock from '../components/InlineEditorBlock.js'

// function stripTmpIds(array){
//   return [...array].map(obj => {
//     const obj_new = { ...obj }
//     delete obj_new._id
//     return obj_new
//   })
// }

function addTmpIds(array) {
  return [...array].map(obj => {
    const obj_new = { ...obj }
    obj_new.tmp_id = uuidv4()
    return obj_new
  })
}

function ContentEditor({ getString, defaultValue, onChange }) {
  const [blocks, setBlock] = useState([])

  useEffect(()=>{
    let newBlocks = defaultValue || []
    newBlocks = addTmpIds(newBlocks)
    setBlock(newBlocks)
  }, [defaultValue, setBlock])

  return <Repeater
    onChange={onChange}
    defaultValue={blocks}
    addDefaultValue={() => ({ tmp_id: uuidv4(), blockId: null })}
    hideAddButton={true}
    reorderLabel={getString('content_editor_reorderblock_label')}
    showActionButton={false}
    render={
      ({ defaultValue, ...repeater_props }) => {
        return <InlineEditorBlock
          defaultContentConfig={defaultValue}

          // onInputRef,
          // onGoToPrevInput,
          // onGoToNextInput,
          // onSplitText,
          // onMergeToPrevInput,
          // onMergeToNextInput,

          {...repeater_props}
        />
      }
    }
  />
}

export default withLocalization(ContentEditor)
