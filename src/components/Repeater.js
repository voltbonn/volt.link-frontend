import { useState, useCallback, useEffect } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import classes from './Repeater.module.css'

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function Repeater({ defaultValue, addDefaultValue, addButtonText, reorderLabel = 'Reorder', render, style, onChange, prependNewItems, isReorderable }) {
  if (!(!!addButtonText)) {
    addButtonText = 'Add Row'
  }

  const [rows, setRows] = useState([])

  useEffect(() => {
    let tmp_defaultValue = defaultValue
    if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
      tmp_defaultValue = [addDefaultValue()]
    }
    setRows(tmp_defaultValue)
  }, [defaultValue, addDefaultValue, setRows])

  const handleRemoveRow = useCallback(event => {
    const index = event.target.dataset.index
    let new_rows = [...rows]
    new_rows.splice(index, 1)
    const rows_from_onChange = onChange(new_rows)
    if (Array.isArray(rows_from_onChange)) {
      new_rows = rows_from_onChange
    }
    setRows(new_rows)
  }, [rows, setRows, onChange])

  const handleRowChange = useCallback(event => {
    const index = event.target.dataset.index
    const _id = event.target.dataset.id
    const newValue = event.target.value

    const new_rows = [...rows]
    new_rows[index] = {
      _id,
      ...newValue
    }
    setRows(new_rows)
    onChange(new_rows)
  }, [rows, setRows, onChange])

  const handleAddRow = useCallback(() => {
    const newValue = addDefaultValue()

    let new_rows = null
    if (prependNewItems === true) {
      new_rows = [newValue, ...rows]
    } else {
      new_rows = [...rows, newValue]
    }

    setRows(new_rows)
    onChange(new_rows)
  }, [rows, addDefaultValue, setRows, onChange, prependNewItems])

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
    {!hasOnlyOneRow && prependNewItems ? <div style={{ marginBottom: 'var(--basis)' }}>{addButton}</div> : null}

    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="list"
        isDropDisabled={isReorderable === true ? false : true}
      >
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {
              rows
              .filter(subDefaultValue => subDefaultValue._id)
              .map(
                (subDefaultValue, index) => <Draggable
                  key={subDefaultValue._id}
                  draggableId={subDefaultValue._id}
                  index={index}
                  isDragDisabled={isReorderable === true ? false : true}
                  disableInteractiveElementBlocking={true}
                >
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}

                      key={subDefaultValue._id}
                      className={classes.row}
                    >
                      {
                        isReorderable === true
                          ? <button aria-label={reorderLabel} className={`text ${classes.inlineRowButton}`} {...provided.dragHandleProps}>☰</button>
                          : null
                      }
                      {
                        render({
                          key: subDefaultValue._id,
                          defaultValue: subDefaultValue,
                          className: classes.item,
                          'data-index': index,
                          'data-id': subDefaultValue._id,
                          onChange: handleRowChange
                        })
                      }
                      {
                        hasOnlyOneRow
                          ? <button className={`green ${classes.inlineRowButton}`} onClick={handleAddRow}>+</button>
                          : <button className={`red ${classes.inlineRowButton}`} data-index={index} onClick={handleRemoveRow}>–</button>
                      }
                    </div>
                  )}
                </Draggable>
              )
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    {!hasOnlyOneRow && !prependNewItems ? addButton : null}
  </div>
}

export default Repeater
