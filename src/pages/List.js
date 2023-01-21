import React from 'react'

import classes from './List.module.css'

import { Helmet } from 'react-helmet'

const title = 'Volt.Link'
const description = 'Volt.Link makes content easily accessible in Volt Europa.'

export default function List() {
  return (<>
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <h1>{title}</h1>
      <p>{description}</p>


    </div>
  </>)
}
