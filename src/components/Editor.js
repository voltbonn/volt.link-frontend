import React from 'react'

import classes from './Editor.module.css'

export default function Editor() {

  return (<div className={classes.root}>
    <label>
      URL:
      <input type="url" placeholder="https://volt-bonn.de" />
    </label>
    <br />

    <label>
      Slug:
      <input type="text" placeholder="bonn" />
    </label>
    <br />

    <button className="default green" style={{ margin: 0 }}>Add Redirect</button>
  </div>)
}
