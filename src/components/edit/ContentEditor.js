import { useState, useRef, useEffect, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  Add as AddIcon,
} from '@mui/icons-material'
import {
  Tooltip,
} from '@mui/material'

import { Localized } from '../../fluent/Localized.js'
import InlineEditorBlock from './InlineEditorBlock.js'
import useLoadBlocks from '../../hooks/useLoadBlocks.js'
import useSaveBlock from '../../hooks/useSaveBlock.js'
import useDeleteBlock from '../../hooks/useDeleteBlock.js'
// import { useTranslatedInputContext } from './TranslatedInput.js'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import classes from './ContentEditor.module.css'

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
  // const [contentConfigs, setContentConfigs] = useState([])
  const contentConfigs_Ref = useRef([])
  const contentConfigs = contentConfigs_Ref.current

  // const [inputRefs, setInputRefs] = useState({})
  const inputRefs_Ref = useRef({})
  const inputRefs = inputRefs_Ref.current

  const [updateCounter, setUpdateCounter] = useState(0)

  const loadBlocks = useLoadBlocks()
  const saveBlock = useSaveBlock()
  const deleteBlock = useDeleteBlock()


  const [autoFocus, setAutoFocus] = useState(null)
  useEffect(()=>{
    if (typeof autoFocus === 'object' && autoFocus !== null) {
      if (
        inputRefs.hasOwnProperty(autoFocus.tmp_id)
      ) {
        const inputRef = inputRefs[autoFocus.tmp_id]
        if (
          typeof inputRef === 'object'
          && inputRef !== null
        ) {
          if (autoFocus.inFirstLine === true) {
            const firstLineStartNode = getFirstLineStartNode(inputRef.current)
            moveCursorToOffsetInLine(inputRef.current, firstLineStartNode, autoFocus.positionFromLineStart)
          } else if (autoFocus.inLastLine === true) {
            const lastLineStartNode = getLastLineStartNode(inputRef.current)
            moveCursorToOffsetInLine(inputRef.current, lastLineStartNode, autoFocus.positionFromLineStart)
          }
          setAutoFocus(null)
        }
      }
    }
  }, [
    autoFocus,
    setAutoFocus,
    inputRefs,
  ])

  useEffect(()=>{
    async function loadMissingBlocks () {
      let newContentConfigs = [...addTmpIds(defaultValue)]

      const ids2load = newContentConfigs
        .filter(contentConfig => !contentConfig.hasOwnProperty('block'))
        .map(contentConfig => contentConfig.blockId)

      let loadedBlocks = []
      if (ids2load.length > 0) {
        loadedBlocks = await loadBlocks({ ids: ids2load })
      }
      
      newContentConfigs = newContentConfigs
        .map(contentConfig => {
          if (!contentConfig.hasOwnProperty('block')) {
            contentConfig.block = loadedBlocks.find(block => block._id === contentConfig.blockId)
          }
          return contentConfig
        })

      contentConfigs_Ref.current = newContentConfigs
      setUpdateCounter(old => old + 1)
    }

    if (contentConfigs.length === 0) {
      if (defaultValue.length > 0) {
        loadMissingBlocks()
      }
    }
  }, [contentConfigs, defaultValue, loadBlocks, contentConfigs_Ref, setUpdateCounter])

  const saveInputRef = useCallback((keys, inputRef) => {
    const newInputRefs = {...inputRefs_Ref.current}

    if (
      !newInputRefs.hasOwnProperty(keys.tmp_id)
      || newInputRefs[keys.tmp_id] !== inputRef
    ) {
      newInputRefs[keys.tmp_id] = inputRef
      inputRefs_Ref.current = newInputRefs
    }
  }, [ inputRefs_Ref ])

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

  const handleRowChange = useCallback((keys, newContentConfig) => {
    const newContentConfigs = [...contentConfigs]
    for (const index in newContentConfigs) {
      const oldContentConfig = newContentConfigs[index]
      if (oldContentConfig.tmp_id === keys.tmp_id) {
        newContentConfigs[index] = {
          ...oldContentConfig,
          ...newContentConfig,
        }
        break
      }
    }

    contentConfigs_Ref.current = newContentConfigs
    onChange(newContentConfigs)

    return new Promise(resolve => {
      resolve(newContentConfigs)
    })
  }, [contentConfigs, contentConfigs_Ref, onChange])

  const addRowByIndex = useCallback((index, offset = 0, newContentConfig) => {
    if (typeof newContentConfig === 'object') {
      newContentConfig = {
        tmp_id: uuidv4(),
        ...newContentConfig,
      }
    } else {
      newContentConfig = newContentConfig || { tmp_id: uuidv4() }
    }

    if (typeof index === 'number' && !isNaN(index)) {
      // saveBlock(newBlock)
      //   .then(newBlock => {
      //     if (callback) {
      //       callback(newBlock)
      //     }
      //   })
      //   .catch(console.error)

      let new_rows = [...contentConfigs]
      new_rows.splice(index + offset, 0, newContentConfig)
      contentConfigs_Ref.current = new_rows
      onChange(new_rows)
    }
  }, [contentConfigs, contentConfigs_Ref, onChange])

  const onMergeToPrevInput = useCallback(keys => {
    const {
      index,
    } = keys

    const clonedContentConfigs = [...contentConfigs]
    if (index > 0) {
      const prev_index = index - 1
      const prev_contentConfig = clonedContentConfigs[prev_index]
      const prev_tmp_id = prev_contentConfig.tmp_id

      const this_block = clonedContentConfigs[index].block
      const prev_block = clonedContentConfigs[prev_index].block

      const new_prev_block = {
        ...prev_block,
        properties: {
          ...prev_block.properties,
          text: prev_block.properties.text + this_block.properties.text,
        },
      }

      const thisRef = inputRefs_Ref.current[prev_tmp_id]
      const textLength = thisRef.current.textContent.length

      saveBlock(new_prev_block)
        .then(savedPrevBlock => {
          const new_tmp_id = uuidv4()
          handleRowChange({
            index: prev_index,
            tmp_id: prev_tmp_id,
          }, {
            ...prev_contentConfig,
            tmp_id: new_tmp_id,
            blockId: savedPrevBlock._id,
            block: savedPrevBlock,
          })
            .then(newContentConfigs => {
              const this_block = newContentConfigs[index].block
              newContentConfigs.splice(index, 1) // delete the block

              deleteBlock({ _id: this_block._id })
                .then(() => {
                  contentConfigs_Ref.current = newContentConfigs
                  setAutoFocus({
                    tmp_id: new_tmp_id,
                    positionFromLineStart: textLength,
                    inFirstLine: false,
                    inLastLine: true,
                  })
                  onChange(newContentConfigs)
                })
            })
        })
        .catch(console.error)
    } else {
      // This is the first row. Nothing to merge into.
    }
  }, [ contentConfigs, inputRefs_Ref, saveBlock, handleRowChange, deleteBlock, contentConfigs_Ref, setAutoFocus, onChange ])

  const onMergeFromNextInput = useCallback(keys => {
    const {
      index,
      tmp_id,
    } = keys

    const clonedContentConfigs = [...contentConfigs]
    if (index < clonedContentConfigs.length - 1) {

      const next_index = index + 1

      const this_old_contentConfig = clonedContentConfigs[index]
      const this_block = clonedContentConfigs[index].block
      const next_block = clonedContentConfigs[next_index].block

      const new_block = {
        ...this_block,
        properties: {
          ...this_block.properties,
          text: this_block.properties.text + next_block.properties.text,
        },
      }

      const thisRef = inputRefs_Ref.current[tmp_id]
      const textLength = thisRef.current.textContent.length

      saveBlock(new_block)
        .then(savedBlock => {
          const new_tmp_id = uuidv4()
          handleRowChange(keys, {
            ...this_old_contentConfig,
            tmp_id: new_tmp_id,
            blockId: savedBlock._id,
            block: savedBlock,
          })
            .then(newContentConfigs => {
              const next_block = newContentConfigs[next_index].block
              newContentConfigs.splice(next_index, 1) // delete the block

              deleteBlock({ _id: next_block._id })
                .then(() => {
                  contentConfigs_Ref.current = newContentConfigs
                  setAutoFocus({
                    tmp_id: new_tmp_id,
                    positionFromLineStart: textLength,
                    inFirstLine: false,
                    inLastLine: true,
                  })
                  onChange(newContentConfigs)
                })
            })
        })
        .catch(console.error)




      // // const firstBlock = rows[index]
      // // const secondBlock = rows[index + 1]

      // // get current text length (we know the caret is at the end of the text)
      // const thisRef = inputRefs[tmp_id]
      // const textLength = thisRef.current.textContent.length

      // // refocus the input at the last caret position
      // const lastLineStartNode = getLastLineStartNode(thisRef.current)
      // moveCursorToOffsetInLine(thisRef.current, lastLineStartNode, textLength) // we can't use a text length of -1, as the text length will be changed after the merge
    } else {
      // This is the last row. Nothing to merge into.
    }
  }, [ contentConfigs, inputRefs_Ref, saveBlock, handleRowChange, deleteBlock, contentConfigs_Ref, setAutoFocus, onChange ])

  const splitText = useCallback((keys, { texts }) => {
    const {
      index,
      tmp_id,
    } = keys

    const newContentConfigs = [...contentConfigs]

    const block = (newContentConfigs.find(block => block.tmp_id === tmp_id)).block || {}

    const firstBlock = {
      ...block,
      properties: {
        ...block.properties,
        text: texts[0],
      },
    }

    const secondBlock = {
      type: block.type,
      properties: {
        text: texts[1],
      },
    }

    saveBlock(firstBlock)
      .then(savedFirstBlock => {
        saveBlock(secondBlock)
          .then(savedSecondBlock => {
            newContentConfigs[index] = {
              ...newContentConfigs[index],
              tmp_id: uuidv4(),
              blockId: savedFirstBlock._id,
              block: savedFirstBlock,
            }

            const nextContentConfig = {
              tmp_id: uuidv4(),
              blockId: savedSecondBlock._id,
              block: savedSecondBlock,
            }
            newContentConfigs.splice(index + 1, 0, nextContentConfig)

            contentConfigs_Ref.current = newContentConfigs
            onChange(newContentConfigs)
            setAutoFocus({
              tmp_id: nextContentConfig.tmp_id,
              positionFromLineStart: 0,
              inFirstLine: true,
              inLastLine: false,
            })
          })
          .catch(console.error)
        })
      .catch(console.error)
  }, [
    contentConfigs,
    saveBlock,
    contentConfigs_Ref,
    onChange,
    setAutoFocus,
  ])

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

    contentConfigs_Ref.current = newContentConfigs
    onChange(newContentConfigs)
  }

  const filteredContentConfigs = contentConfigs
    .filter(Boolean)
    .filter(contentConfig => contentConfig.tmp_id)

  return <>
  <div
    key={updateCounter}
    style={{
      position: 'relative',
      width: '1000px',
      maxWidth: '100%',
      margin: 'var(--basis_x8) auto 0 auto',
    }}
  >
    <div>
      <button
        onClick={() => addRowByIndex(0, 0, { type: 'text' })}
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
          <div ref={provided.innerRef} {...provided.droppableProps} className="inputBorder">
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
                          contentConfig={contentConfig}

                          reorderHandle={
                            <Tooltip title={<div style={{ textAlign: 'center' }}>
                              <strong>Drag</strong> to move.<br />
                              <strong>Click</strong> to open menu.
                            </div>}>
                              <button
                                className={`text ${classes.inlineRowButton} ${classes.dragHandleButton}`}
                                {...provided.dragHandleProps}
                              >
                                <DragIndicatorIcon />
                              </button>
                            </Tooltip>
                          }

                          onRemoveRow={ () => {/*handleRemoveRow(index)*/} }
                          addRowBefore={ (newValue) => addRowByIndex(index, 0, newValue) }
                          addRowAfter={ (newValue) => addRowByIndex(index, 1, newValue) }

                          onInputRef={(inputRef) => saveInputRef(keys, inputRef)}
                          onGoToPrevInput={(attr) => goToPrevInput(keys, attr)}
                          onGoToNextInput={(attr) => goToNextInput(keys, attr)}
                          onSplitText={(attr) => splitText(keys, attr)}
                          onChange={(attr) => handleRowChange(keys, attr)}
                          onMergeToPrevInput={(attr) => onMergeToPrevInput(keys, attr)}
                          onMergeFromNextInput={(attr) => onMergeFromNextInput(keys, attr)}
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
