import { useState, useCallback, useEffect } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { v4 as uuidv4 } from 'uuid'

import classes from './Repeater.module.css'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function Row({
  subDefaultValue,
  index,
  render,
  handleRowChange,
  isReorderable,
  handleAddRow,
  handleRemoveRow,
  showReorderControls,
  reorderLabel,
  showActionButton,
  hasOnlyOneRow,
  addRowByIndex,
}) {
  return <Draggable
      key={subDefaultValue.tmp_id}
      draggableId={subDefaultValue.tmp_id}
      index={index}
      isDragDisabled={isReorderable === true ? false : true}
      disableInteractiveElementBlocking={true}
      shouldRespectForcePress={true}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}

          key={subDefaultValue.tmp_id}
          className={classes.row}
        >
          {/*
            index !== 0
            ? <div className={classes.middleActions}>
              <div className={classes.trigger}></div>
              <div className={classes.content}>
                <button className={`green ${classes.inlineRowButton}`} data-index={index} onClick={handleAddRow}>+</button>
              </div>
            </div>
            : null
          */}

        <div className={classes.form}>
          {
            isReorderable === true && showReorderControls === true
              ? <button
                  aria-label={reorderLabel}
                  className={`text ${classes.inlineRowButton} ${classes.dragHandleButton}`}
                  {...provided.dragHandleProps}
                >
                  <DragIndicatorIcon />
                </button>
              : null
          }
          {
            render({
              key: subDefaultValue.tmp_id,
              defaultValue: subDefaultValue,
              className: classes.item,
              dataset: {
                'data-index': index,
                'data-id': subDefaultValue.tmp_id,
              },
              onChange: handleRowChange,
              onRemoveRow: () => handleRemoveRow(index),
              addRowBefore: (newValue) => addRowByIndex(index, 0, newValue),
              addRowAfter: (newValue) => addRowByIndex(index, 1, newValue),
              reorderHandle: <button
                  aria-label={reorderLabel}
                  className={`text ${classes.inlineRowButton} ${classes.dragHandleButton}`}
                  {...provided.dragHandleProps}
                >
                  <DragIndicatorIcon />
                </button>,
              actionButton: (
                hasOnlyOneRow
                  ? <button className={`green ${classes.inlineRowButton}`} onClick={handleAddRow}>+</button>
                  : <button className={`red ${classes.inlineRowButton}`} data-index={index} onClick={handleRemoveRow}>–</button>
              ),
            })
          }
          {
            showActionButton === true
            ? (
            hasOnlyOneRow
              ? <button className={`green ${classes.inlineRowButton}`} onClick={handleAddRow}>+</button>
              : <button className={`red ${classes.inlineRowButton}`} data-index={index} onClick={handleRemoveRow}>–</button>
            )
            : null
          }
        </div>
      </div>
    )}
  </Draggable>
}

function getIndex(eventOrIndex) {
  let index = eventOrIndex

  if (!typeof eventOrIndex === 'number') {
    if (typeof eventOrIndex === 'object' && !!eventOrIndex.target.dataset.index) {
      index = parseInt(eventOrIndex.target.dataset.index)
      if (isNaN(index)) {
        index = null
      }
    } else if (typeof eventOrIndex === 'object' && !!eventOrIndex.dataset.index) {
      index = parseInt(eventOrIndex.dataset.index)
      if (isNaN(index)) {
        index = null
      }
    }
  }

  return index
}

function Repeater({
  defaultValue,
  addDefaultValue,
  addButtonText,
  hideAddButton = false,
  reorderLabel = 'Reorder',
  render,
  style,
  onChange,
  prependNewItems,
  showReorderControls = false,
  showActionButton = true,
  isReorderable = false
}) {
  if (!(!!addButtonText)) {
    addButtonText = 'Add Row'
  }

  const [rows, setRows] = useState([])

  const internalAddDefaultValue = useCallback(() => {
    let tmp_defaultValue = {}
    if (typeof addDefaultValue === 'function') {
      const defaultValue = addDefaultValue()
      if (typeof defaultValue === 'object' && defaultValue !== null) {
        tmp_defaultValue = defaultValue
        if (
          typeof tmp_defaultValue.tmp_id !== 'string'
          || tmp_defaultValue.tmp_id === ''
        ) {
          tmp_defaultValue.tmp_id = uuidv4()
        }
      }
    }
    return tmp_defaultValue
  }, [addDefaultValue])

  useEffect(() => {
    let tmp_defaultValue = defaultValue
    if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
      tmp_defaultValue = [internalAddDefaultValue()]
    }
    tmp_defaultValue = tmp_defaultValue.map(item => {
      if (!item.tmp_id) {
        return { ...item, tmp_id: uuidv4() }
      }
      return item
    })
    setRows(tmp_defaultValue)
  }, [defaultValue, internalAddDefaultValue, setRows])

  const handleRemoveRow = useCallback(eventOrIndex => {
    const index = getIndex(eventOrIndex)

    let new_rows = [...rows]
    new_rows.splice(index, 1)
    const rows_from_onChange = onChange(new_rows)
    if (Array.isArray(rows_from_onChange)) {
      new_rows = rows_from_onChange
    }
    setRows(new_rows)
  }, [rows, setRows, onChange])

  const handleRowChange = useCallback(event => {
    const index = event.dataset.index || event.dataset['data-index']
    const tmp_id = event.dataset.id || event.dataset['data-id']
    const newValue = event.value

    const new_rows = [...rows]
    if (typeof newValue !== 'object' || Array.isArray(newValue)) {
      new_rows[index] = {
        tmp_id,
        value: newValue
      }
    } else if (typeof newValue === 'object') {
      new_rows[index] = {
        tmp_id,
        ...newValue
      }
    }
    setRows(new_rows)
    onChange(new_rows)
  }, [rows, setRows, onChange])

  const addRowByIndex = useCallback((index, offset = 0, newValue) => {
    if (typeof newValue === 'object') {
      newValue = {
        ...(internalAddDefaultValue()),
        ...newValue,
      }
    } else {
      newValue = newValue || internalAddDefaultValue()
    }

    let new_rows = null
    if (index !== null && index >= 0) {
      new_rows = [...rows]
      new_rows.splice(index + offset, 0, newValue)
    }

    setRows(new_rows)
    onChange(new_rows)
  }, [rows, internalAddDefaultValue, setRows, onChange])

  const handleAddRow = useCallback(eventOrIndex => {
    const newValue = internalAddDefaultValue()

    const index = getIndex(eventOrIndex)

    let new_rows = null
    if (index !== null && index >= 0) {
      new_rows = [...rows]
      new_rows.splice(index, 0, newValue)
    } else {
      if (prependNewItems === true) {
        new_rows = [newValue, ...rows]
      } else {
        new_rows = [...rows, newValue]
      }
    }

    setRows(new_rows)
    onChange(new_rows)
  }, [rows, internalAddDefaultValue, setRows, onChange, prependNewItems])

  function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const new_rows = reorder(
      rows,
      result.source.index,
      result.destination.index
    )
    setRows(new_rows)
    onChange(new_rows)
  }

  const hasOnlyOneRow = rows.length === 1

  const addButton = <div style={{ textAlign: 'right' }}>
    <button className={`green ${classes.addRowButton}`} onClick={handleAddRow}>{addButtonText}</button>
  </div>

  return <div style={style}>
    {hideAddButton === false && (!hasOnlyOneRow && prependNewItems) ? <div style={{ marginBottom: 'var(--basis)' }}>{addButton}</div> : null}

    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="list"
        isDropDisabled={isReorderable === true ? false : true}
      >
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {
              rows
              .filter(subDefaultValue => subDefaultValue.tmp_id)
              .map(
                (subDefaultValue, index) => <Row
                  key={subDefaultValue.tmp_id}
                  {...{
                    subDefaultValue,
                    index,
                    render,
                    handleRowChange,
                    isReorderable,
                    handleAddRow,
                    handleRemoveRow,
                    showReorderControls,
                    reorderLabel,
                    showActionButton,
                    hasOnlyOneRow,
                    addRowByIndex,
                  }}
                />
              )
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    {hideAddButton === false && (!hasOnlyOneRow && !prependNewItems) ? addButton : null}
  </div>
}

export default Repeater
