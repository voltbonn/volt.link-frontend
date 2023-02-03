import React from 'react'

import classes from './Overview.module.css'

import Editor from './Editor.js'
import List from './List.js'

export default function Overview() {

  return <div className={classes.root}>
    <h1>Volt.Link</h1>
    
    <h2>Redirects</h2>
    <p>Here are all existing redirects, that you have access to.</p>
    <br />

    <div className={classes.card}>
      <h3 style={{ margin: 0 }}>New Redirect</h3>
      <Editor />
    </div>
    <br />

    <List />
  </div>
}
