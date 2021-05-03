import { useState, useCallback } from 'react'

import classes from './Repeater.module.css'

function Repeater({ defaultValue, addDefaultValue, addButtonText, render, style }) {
  if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
    defaultValue = [addDefaultValue]
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
  }, [rows, setRows])

  const handleRowChange = useCallback(event => {
    console.log('handleRowChange', event)
    // const index = event.target.dataset.index
    // const new_rows = [...rows]
    // new_rows.splice(index, 1)
    // setRows(new_rows)
  }, [])

  const handleAddRow = useCallback(() => {
    const new_rows = [...rows]
    new_rows.push(addDefaultValue || null)
    setRows(new_rows)
  }, [rows, addDefaultValue, setRows])

  const hasOnlyOneRow = rows.length === 1

  return <div style={style}>
    {
      rows.map(
        (subDefaultValue, index) =>
          <div className={classes.row} key={index}>
              {render({
                defaultValue: subDefaultValue,
                className: classes.item,
                'data-index': index,
                onChange: handleRowChange
              })}
              {
                hasOnlyOneRow
                  ? <button className={`green ${classes.inlineRowButton}`} onClick={handleAddRow}>+</button>
                  : <button className={`red ${classes.inlineRowButton}`} data-index={index} onClick={handleRemoveRow}>–</button>
              }
          </div>
      )
    }
    {
      hasOnlyOneRow
        ? null
        : <div style={{textAlign: 'right'}}><button className={`green ${classes.addRowButton}`} onClick={handleAddRow}>{addButtonText}</button></div>
    }
  </div>
  // subDefaultValue => <RepeatComponent {...{ [repeatAttributeName]: subDefaultValue }} />
}

export default Repeater
