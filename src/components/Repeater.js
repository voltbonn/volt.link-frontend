import { useState, useCallback } from 'react'

import classes from './Repeater.module.css'

function Repeater({ defaultValue, addDefaultValue, addButtonText, render, style, onChange }) {
  if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
    defaultValue = [addDefaultValue()]
  }

  if (!(!!addButtonText)) {
    addButtonText = 'Add Row'
  }

  const [rows, setRows] = useState(defaultValue)

  const handleRemoveRow = useCallback(event => {
    const index = event.target.dataset.index
    const new_rows = [...rows]
    new_rows.splice(index, 1)
    setRows(new_rows)
    onChange(new_rows)
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
    console.log('new_rows', new_rows)
    setRows(new_rows)
    onChange(new_rows)
  }, [rows, setRows, onChange])

  const handleAddRow = useCallback(() => {
    const new_rows = [...rows]
    new_rows.push(addDefaultValue() || null)
    setRows(new_rows)
    onChange(new_rows)
  }, [rows, addDefaultValue, setRows, onChange])

  const hasOnlyOneRow = rows.length === 1

  return <div style={style}>
    {
      rows.map(
        (subDefaultValue, index) => (
          !!subDefaultValue._id
            ? <div key={subDefaultValue._id} className={classes.row}>
              {render({
                key: subDefaultValue._id,
                defaultValue: subDefaultValue,
                className: classes.item,
                'data-index': index,
                'data-id': subDefaultValue._id,
                onChange: handleRowChange
              })}
              {
                hasOnlyOneRow
                  ? <button className={`green ${classes.inlineRowButton}`} onClick={handleAddRow}>+</button>
                  : <button className={`red ${classes.inlineRowButton}`} data-index={index} onClick={handleRemoveRow}>–</button>
              }
            </div>
            : null
        )
      )
      .filter(Boolean)
    }
    {
      hasOnlyOneRow
        ? null
        : <div style={{textAlign: 'right'}}><button className={`green ${classes.addRowButton}`} onClick={handleAddRow}>{addButtonText}</button></div>
    }
  </div>
}

export default Repeater
