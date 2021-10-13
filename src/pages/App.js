import React, { useState, useCallback } from 'react'

import classes from './App.module.css'

import {
  Switch,
  Route,
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
        ? <Switch>
            <Route path="/view/:id">
              <Viewer leftHeaderActions={leftHeaderActions} />
            </Route>
            <Route path="/edit/:id">
              <Editor leftHeaderActions={leftHeaderActions} />
            </Route>
            <Route path="/shortcode">
              <Shortcode leftHeaderActions={leftHeaderActions} />
            </Route>
            <Route path="/">
              <Chooser leftHeaderActions={leftHeaderActions} />
            </Route>
          </Switch>
        : <Switch>
            <Route path="/view/:id">
              <Viewer leftHeaderActions={leftHeaderActions} />
            </Route>
            <Route path="/">
              <h1>Login to view content</h1>
              <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <button className="hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
                  <LoginIcon className="icon" />
                  <span>
                    <Localized id="login" />
                  </span>
                </button>
              </a>
            </Route>
          </Switch>
      }
    </div>
  </>)
}

export default withLocalization(App)
