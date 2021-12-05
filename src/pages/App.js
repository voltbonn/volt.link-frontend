import React, { useState, useEffect } from 'react'

import classes from './App.module.css'

import {
  Routes,
  Route,
  useLocation,
  useMatch,
} from 'react-router-dom'

import useUser from '../hooks/useUser.js'
import { SidebarProvider, Sidebar, SidebarContent, Main } from '../components/Sidebar.js'
import Shortcode from './Shortcode.js'
import Editor from './Editor.js'
import Viewer from './Viewer.js'
import LoginScreen from '../components/LoginScreen.js'

function App() {
  const { loggedIn } = useUser()

  const matchesStartpage = useMatch('/')
  const location = useLocation()

  const [customLocation, setCustomLocation] = useState({})

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const real_path = urlParams.get('real_path')

    if (
      customLocation.pathname !== real_path
    ) {
      if (
        typeof real_path === 'string'
        && real_path.length > 0
      ) {
        window.history.replaceState(null, '', location.pathname)
        setCustomLocation({
          pathname: real_path,
        })
      } else {
        setCustomLocation(location)
      }
    }
  }, [ location, customLocation, setCustomLocation ])

  return (<>
    <div className={`${classes.app} ${matchesStartpage ? classes.isStartpage : ''}`}>
      <SidebarProvider>
        {
          matchesStartpage
          ? null
          : <Sidebar />
        }
        <Main>
        {
          loggedIn
          ? <Routes location={customLocation}>
              <Route path="/view/:id" element={<Viewer />} />
              <Route path="/edit/:id" element={<Editor />} />
              <Route path="/shortcode" element={<Shortcode />} />
              <Route path="/" element={<SidebarContent />} />
            </Routes>
          : <Routes location={customLocation}>
              <Route path="/view/:id" element={<Viewer />} />
              <Route path="/edit/:id" element={<LoginScreen />} />
              <Route path="/shortcode" element={<LoginScreen />} />
              <Route path="/" element={<SidebarContent />} />
            </Routes>
        }
        </Main>
      </SidebarProvider>
    </div>
  </>)
}

export default App
