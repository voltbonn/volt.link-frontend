import { useState, useCallback, useEffect } from 'react'

import classes from './Repeater.module.css'

function Repeater({ defaultValue, addDefaultValue, addButtonText, render, style, onChange, prependNewItems }) {
  if (!(!!addButtonText)) {
    addButtonText = 'Add Row'
  }

  const [rows, setRows] = useState(defaultValue)

  useEffect(() => {
    let tmp_defaultValue = defaultValue
    if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
      tmp_defaultValue = [addDefaultValue()]
    }
    setRows(tmp_defaultValue)
  }, [defaultValue, addDefaultValue, setRows])

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
    setRows(new_rows)
    onChange(new_rows)
  }, [rows, setRows, onChange])

  const handleAddRow = useCallback(() => {
    const newValue = addDefaultValue() || null

    let new_rows = null
    if (prependNewItems === true) {
      new_rows = [newValue, ...rows]
    } else {
      new_rows = [...rows, newValue]
    }

    setRows(new_rows)
    onChange(new_rows)
  }, [rows, addDefaultValue, setRows, onChange, prependNewItems])

  const hasOnlyOneRow = rows.length === 1

  const addButton = <div style={{ textAlign: 'right' }}>
    <button className={`green ${classes.addRowButton}`} onClick={handleAddRow}>{addButtonText}</button>
  </div>

  return <div style={style}>
    { !hasOnlyOneRow && prependNewItems ? addButton : null }

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

    {!hasOnlyOneRow && !prependNewItems ? addButton : null}
  </div>
}

export default Repeater
