import React from 'react'

import classes from './App.module.css'

import {
  Outlet,
  // Routes,
  // Route,
  // useLocation,
  // useMatch,
  // useParams,
  // useNavigate,
} from 'react-router-dom'

import { Helmet } from 'react-helmet'

const title = 'Volt.Link'
const description = 'Volt.Link makes content easily accessible in Volt Europa.'

export default function App() {
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

      <Outlet />

    </div>
  </>)
}
