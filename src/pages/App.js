import React from 'react'

import classes from './App.module.css'

// import {
//   Routes,
//   Route,
//   useLocation,
//   useMatch,
//   useParams,
//   // useNavigate,
// } from 'react-router-dom'

import { Helmet } from 'react-helmet'

function App() {
  const fallback_title = 'Volt.Link'
  const fallback_description = 'Volt.Link makes content easily accessible in Volt Europa.'

  return (<>
    <div className={classes.app}>        
              <Helmet>
                <title>{fallback_title}</title>
                <meta name="title" content={fallback_title} />
                <meta name="og:title" content={fallback_title} />
                <meta name="twitter:title" content={fallback_title} />

                <meta name="description" content={fallback_description} />
                <meta name="og:description" content={fallback_description} />
                <meta name="twitter:description" content={fallback_description} />
              </Helmet>

    </div>
  </>)
}

export default App
