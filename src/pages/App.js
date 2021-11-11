import React, { useState, useCallback, useEffect } from 'react'

import classes from './App.module.css'

import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import {
  Menu as MenuIcon,
  Email as ContactIcon,
  GitHub as SourceCodeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'

import { withLocalization } from '../fluent/Localized.js'

import Localized from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import Chooser from './Chooser.js'
import Shortcode from './Shortcode.js'
import Editor from './Editor.js'
import Viewer from './Viewer.js'

function App({ getString }) {
  const { loggedIn } = useUser()

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

  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const toggleDrawer = useCallback(() => {
    setDrawerIsOpen(oldOpen => !oldOpen)
  }, [ setDrawerIsOpen ])

  const iOS = (typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent))

  const leftHeaderActions = <>
    <button onClick={toggleDrawer} className="text hasIcon" style={{ margin: '0' }}>
      <MenuIcon className="icon" />
    </button>
    <SwipeableDrawer
      anchor="left"
      open={drawerIsOpen}
      onOpen={toggleDrawer}
      onClose={toggleDrawer}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <List style={{ maxWidth: '100%' }}>
        <a href="mailto:thomas.rosen@volteuropa.org">
          <ListItem button>
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="contact" />} />
          </ListItem>
        </a>
        <a href="https://github.com/voltbonn/edit.volt.link" target="_blank" rel="noopener noreferrer">
          <ListItem button>
            <ListItemIcon>
              <SourceCodeIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="source_code" />} />
          </ListItem>
        </a>
        <br />
        {
          loggedIn
            ? <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <ListItem button>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="logout" />} />
                </ListItem>
              </a>
            : <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <ListItem button>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="login" />} />
                </ListItem>
              </a>
        }
      </List>
    </SwipeableDrawer>
  </>

  return (<>
    <div className={classes.app}>
      {
        loggedIn
        ? <Routes location={customLocation}>
            <Route path="/view/:id" element={<Viewer />} />
            <Route path="/edit/:id" element={<Editor />} />
            <Route path="/shortcode" element={<Shortcode />} />
          </Routes>
        : <Routes location={customLocation}>
            <Route path="/view/:id" element={<Viewer />} />
            <Route path="/" element={<>
              <h1>Login to view content</h1>
              <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <button className="hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
                  <LoginIcon className="icon" />
                  <span>
                    <Localized id="login" />
                  </span>
                </button>
              </a>
            </>} />
          </Routes>
        }
    </div>
  </>)
}

export default withLocalization(App)
