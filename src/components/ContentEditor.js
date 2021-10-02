import { useState, useEffect, useCallback } from 'react'

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

function getFirstLineStartNode(element){
  element.normalize()

  const childNodes = element.childNodes
  if (childNodes.length > 0) {
    return childNodes[0]
  }

  return element
}

function getLastLineStartNode(element) {
  element.normalize()

  const childNodes = [...element.childNodes].reverse()
  if (childNodes.length > 0) {
    let lastLineNode = element
    if (childNodes[0].nodeType === 3) {
      for (const childNode of childNodes) {
        if (childNode.nodeType === 3) {
          lastLineNode = childNode
        } else if (childNode.nodeType === 1) {
          break
        }
      }
    } else {
      if (childNodes.length > 1) {
        if (childNodes[1].nodeType === 3) {
          const thisChildNodes = childNodes.slice(1)
          for (const childNode of thisChildNodes) {
            if (childNode.nodeType === 3) {
              lastLineNode = childNode
            } else if (childNode.nodeType === 1) {
              break
            }
          }
        }
      }
    }

    return lastLineNode
  }

  return element
}

function moveCursorToOffsetInLine(contentEditableElement, lastLineStartNode, offset = 0) {
  contentEditableElement.focus()

  // If this function exists... (IE 9+)
  if (window.getSelection) {
    const lastLineStartNodeLength = (
      lastLineStartNode.nodeType === 3
        ? lastLineStartNode.length
        : lastLineStartNode.innerText.length
    )

    if (offset === -1 || offset > lastLineStartNodeLength) {
      offset = lastLineStartNodeLength
    }

    const range = document.createRange()
    range.setStart(lastLineStartNode, 0)
    range.setEnd(lastLineStartNode, offset)
    range.collapse(false) // false = collapse to end
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

function ContentEditor({ getString, defaultValue, onChange }) {
  const [blocks, setBlocks] = useState([])
  const [inputRefs, setInputRefs] = useState({})

  useEffect(()=>{
    if (blocks.length === 0) {
      let newBlocks = defaultValue || []
      newBlocks = addTmpIds(newBlocks)
      setBlocks(newBlocks)
    }
  }, [blocks, defaultValue, setBlocks])

  const saveInputRef = useCallback((inputRef, dataset) => {
    const newInputRefs = {...inputRefs}
    if (!newInputRefs.hasOwnProperty(dataset['data-id'])) {
      newInputRefs[dataset['data-id']] = inputRef
      setInputRefs(newInputRefs)
    }
  }, [ inputRefs, setInputRefs ])

  const goToPrevInput = useCallback(({ caret }, dataset) => {
    const index = dataset['data-index']

    let prevInputRef = null
    for (let thisIndex = blocks.length-1; thisIndex >= 0; thisIndex--) {
      const tmp_id = blocks[thisIndex].tmp_id
      if (thisIndex < index && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        prevInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (prevInputRef) {
      const lastLineStartNode = getLastLineStartNode(prevInputRef.current)
      moveCursorToOffsetInLine(prevInputRef.current, lastLineStartNode, caret.positionFromLineStart)
    }
  }, [ blocks, inputRefs ])

  const goToNextInput = useCallback(({ caret }, dataset) => {
    const index = dataset['data-index']

    let nextInputRef = null
    for (let thisIndex = 0; thisIndex < blocks.length; thisIndex++) {
      const tmp_id = blocks[thisIndex].tmp_id
      if (thisIndex > index && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        nextInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (nextInputRef) {
      const firstLineStartNode = getFirstLineStartNode(nextInputRef.current)
      moveCursorToOffsetInLine(nextInputRef.current, firstLineStartNode, caret.positionFromLineStart)
    }
  }, [ blocks, inputRefs ])

  const focusLastLine = useCallback(() => {
    let lastInputRef = null
    for (let thisIndex = blocks.length-1; thisIndex >= 0; thisIndex--) {
      const tmp_id = blocks[thisIndex].tmp_id
      if (inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        lastInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (lastInputRef) {
      const lastLineStartNode = getLastLineStartNode(lastInputRef.current)
      moveCursorToOffsetInLine(lastInputRef.current, lastLineStartNode, -1)
    }
  }, [ blocks, inputRefs ])

  const onSplitText = useCallback(({ blocks: replacerBlocks }, dataset) => {
    console.log('replacerBlocks', replacerBlocks)

    const index = dataset['data-index']
    console.log('index', index)

    const newBlocks = [...blocks].splice(index, 0, ...replacerBlocks)
    console.log('newBlocks', newBlocks)
    setBlocks(newBlocks)

    // let nextInputRef = null
    // for (let thisIndex = 0; thisIndex < blocks.length; thisIndex++) {
    //   const tmp_id = blocks[thisIndex].tmp_id
    //   if (thisIndex > index + 1 && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
    //     nextInputRef = inputRefs[tmp_id]
    //     break
    //   }
    // }

    // console.log('nextInputRef', nextInputRef)

    // if (nextInputRef) {
    //   const firstLineStartNode = getFirstLineStartNode(nextInputRef.current)
    //   moveCursorToOffsetInLine(nextInputRef.current, firstLineStartNode, caret.positionFromLineStart)
    // }
  }, [ blocks, setBlocks ]) // blocks, inputRefs

  const handleChange = useCallback((rows) => {
    console.log('rows', rows)
    setBlocks(rows)
    // onChange(
    //   rows
    //   .filter(Boolean)
    //   .map(row => ({
    //     tmp_id: row.tmp_id,
    //     blockId: row.blockId,
    //   }))
    // )
  }, [ setBlocks, onChange ])

  return <>
  <div
    style={{
      width: 'calc(1000px + var(--basis_x8))',
      maxWidth: '100%',
      margin: 'var(--basis_x8) auto 0 auto',
    }}
  >
    <Repeater
      onChange={handleChange}
      defaultValue={blocks}
      addDefaultValue={() => ({ tmp_id: uuidv4(), blockId: null })}
      hideAddButton={true}
      reorderLabel={getString('content_editor_reorderblock_label')}
      showActionButton={false}
      isReorderable={true}
      render={
        ({ defaultValue, ...repeater_props }) => {
          const dataset = repeater_props.dataset || {}
          return <InlineEditorBlock
            defaultContentConfig={defaultValue}
            onInputRef={(inputRef) => saveInputRef(inputRef, dataset)}
            onGoToPrevInput={(attr) => goToPrevInput(attr, dataset)}
            onGoToNextInput={(attr) => goToNextInput(attr, dataset)}
            onSplitText={(attr) => onSplitText(attr, dataset)}
            // onSplitText,
            // onMergeToPrevInput,
            // onMergeToNextInput,
            {...repeater_props}
          />
        }
      }
    />
  </div>
  <div
    style={{
      position: 'relative',
      height: '50vh',
      cursor: 'text',
    }}
    onClick={focusLastLine}
  ></div>
  </>
}

export default withLocalization(ContentEditor)
