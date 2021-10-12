import { useState, useEffect, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  Add as AddIcon,
} from '@mui/icons-material'

import { Localized } from '../fluent/Localized.js'
import InlineEditorBlock from '../components/InlineEditorBlock.js'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import classes from './Repeater.module.css'

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

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function ContentEditor({ defaultValue = [], onChange }) {
  const [contentConfigs, setContentConfigs] = useState([])
  const [inputRefs, setInputRefs] = useState({})

  useEffect(()=>{
    if (contentConfigs.length === 0) {
      if (defaultValue.length > 0) {
        let newContentConfigs = addTmpIds(defaultValue)
        setContentConfigs(newContentConfigs)
      }
    }
  }, [contentConfigs, defaultValue, setContentConfigs])

  const saveInputRef = useCallback((keys, inputRef) => {
    const newInputRefs = {...inputRefs}

    if (
      !newInputRefs.hasOwnProperty(keys.tmp_id)
      || newInputRefs[keys.tmp_id] !== inputRef
    ) {
      newInputRefs[keys.tmp_id] = inputRef
      setInputRefs(newInputRefs)
    }
  }, [ inputRefs, setInputRefs ])

  const goToPrevInput = useCallback((keys, { caret }) => {
    const index = keys.index

    let prevInputRef = null
    for (let thisIndex = contentConfigs.length-1; thisIndex >= 0; thisIndex--) {
      const tmp_id = contentConfigs[thisIndex].tmp_id
      if (thisIndex < index && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        prevInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (prevInputRef) {
      const lastLineStartNode = getLastLineStartNode(prevInputRef.current)
      moveCursorToOffsetInLine(prevInputRef.current, lastLineStartNode, caret.positionFromLineStart)
    }
  }, [ contentConfigs, inputRefs ])

  const goToNextInput = useCallback((keys, { caret }) => {
    const index = keys.index

    let nextInputRef = null
    for (let thisIndex = 0; thisIndex < contentConfigs.length; thisIndex++) {
      const tmp_id = contentConfigs[thisIndex].tmp_id
      if (thisIndex > index && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        nextInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (nextInputRef) {
      const firstLineStartNode = getFirstLineStartNode(nextInputRef.current)
      moveCursorToOffsetInLine(nextInputRef.current, firstLineStartNode, caret.positionFromLineStart)
    }
  }, [ contentConfigs, inputRefs ])

  const focusLastLine = useCallback(() => {
    let lastInputRef = null
    for (let thisIndex = contentConfigs.length-1; thisIndex >= 0; thisIndex--) {
      const tmp_id = contentConfigs[thisIndex].tmp_id
      if (inputRefs[tmp_id] && inputRefs[tmp_id].current) {
        lastInputRef = inputRefs[tmp_id]
        break
      }
    }

    if (lastInputRef) {
      const lastLineStartNode = getLastLineStartNode(lastInputRef.current)
      moveCursorToOffsetInLine(lastInputRef.current, lastLineStartNode, -1)
    }
  }, [ contentConfigs, inputRefs ])

  /*const splitText = useCallback((keys, { blocks: replacerBlocks }) => {
    // const index = keys.index

    // const newBlocks = [...blocks].splice(index, 0, ...replacerBlocks)
    // setContentConfigs(newBlocks)

    // let nextInputRef = null
    // for (let thisIndex = 0; thisIndex < blocks.length; thisIndex++) {
    //   const tmp_id = blocks[thisIndex].tmp_id
    //   if (thisIndex > index + 1 && inputRefs[tmp_id] && inputRefs[tmp_id].current) {
    //     nextInputRef = inputRefs[tmp_id]
    //     break
    //   }
    // }

    // if (nextInputRef) {
    //   const firstLineStartNode = getFirstLineStartNode(nextInputRef.current)
    //   moveCursorToOffsetInLine(nextInputRef.current, firstLineStartNode, caret.positionFromLineStart)
    // }
  }, []) // blocks, inputRefs
  */

  const handleRowChange = useCallback((keys, newContentConfig) => {
    const newContentConfigs = [...contentConfigs]
      .map(oldContentConfig => {
        if (oldContentConfig.tmp_id === keys.tmp_id) {
          return {
            ...oldContentConfig,
            ...newContentConfig,
          }
        }
        return oldContentConfig
      })

    setContentConfigs(newContentConfigs)
    onChange(newContentConfigs)
  }, [contentConfigs, setContentConfigs, onChange])

  const addRowByIndex = useCallback((index, offset = 0, newValue) => {
    if (typeof newValue === 'object') {
      newValue = {
        tmp_id: uuidv4(),
        ...newValue,
      }
    } else {
      newValue = newValue || { tmp_id: uuidv4() }
    }

    if (typeof index === 'number' && !isNaN(index)) {
      let new_rows = [...contentConfigs]
      new_rows.splice(index + offset, 0, newValue)
      setContentConfigs(new_rows)
      onChange(new_rows)
    }
  }, [contentConfigs, setContentConfigs, onChange])


  function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const newContentConfigs = reorder(
      contentConfigs,
      result.source.index,
      result.destination.index
    )

    setContentConfigs(newContentConfigs)
    onChange(newContentConfigs)
  }

  const filteredContentConfigs = contentConfigs
    .filter(contentConfig => contentConfig.tmp_id)

  return <>
  <div
    style={{
      position: 'relative',
      width: 'calc(1000px + var(--basis_x8))',
      maxWidth: '100%',
      margin: 'var(--basis_x8) auto 0 auto',
    }}
  >
    <div>
      <button
        onClick={() => addRowByIndex(0, 0, {})}
        className="text hasIcon"
        style={{
          margin: '0 0 var(--basis_x2) 0',
        }}
      >
        <span style={{pointerEvents: 'none'}}>
          <AddIcon className="icon" />
          <span style={{marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle'}}>
            <Localized id="add_content_before" />
          </span>
        </span>
      </button>
    </div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="list"
        isDropDisabled={false}
      >
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {
              filteredContentConfigs
              .map(
                (contentConfig, index) => {
                  const tmp_id = contentConfig.tmp_id
                  const keys = {
                    index,
                    tmp_id,
                  }

                  return <Draggable
                    key={tmp_id}
                    draggableId={tmp_id}
                    index={index}
                    isDragDisabled={false}
                    disableInteractiveElementBlocking={true}
                    shouldRespectForcePress={true}
                  >
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}

                        key={tmp_id}
                        className={classes.row}
                      >
                      <div className={classes.form}>
                        <InlineEditorBlock
                          key={tmp_id}
                          className={classes.item}
                          dataset={{
                            'data-index': index,
                            'data-id': tmp_id,
                          }}
                          defaultContentConfig={contentConfig}

                          reorderHandle={
                            <button
                              className={`text ${classes.inlineRowButton} ${classes.dragHandleButton}`}
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                            </button>
                          }

                          onRemoveRow={ () => {/*handleRemoveRow(index)*/} }
                          addRowBefore={ (newValue) => addRowByIndex(index, 0, newValue) }
                          addRowAfter={ (newValue) => addRowByIndex(index, 1, newValue) }

                          onInputRef={(inputRef) => saveInputRef(keys, inputRef)}
                          onGoToPrevInput={(attr) => goToPrevInput(keys, attr)}
                          onGoToNextInput={(attr) => goToNextInput(keys, attr)}
                          // onSplitText={(attr) => splitText(keys, attr)}
                          onChange={(attr) => handleRowChange(keys, attr)}
                          // onSplitText,
                          // onMergeToPrevInput,
                          // onMergeToNextInput,
                          // {...repeater_props}
                        />
                      </div>
                    </div>
                    )}
                  </Draggable>
                }
              )
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>

  <div
    style={{
      position: 'relative',
      height: '50vh',
      cursor: (filteredContentConfigs.length === 0 ? 'default' : 'text'),
    }}
    onClick={filteredContentConfigs.length === 0 ? null : focusLastLine}
  ></div>
  </>
}

export default ContentEditor
