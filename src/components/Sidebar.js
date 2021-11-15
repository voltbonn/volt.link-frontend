import React, {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react'

import {
  SwipeableDrawer,
} from '@mui/material'

import { useMatch } from 'react-router-dom'

import useMediaQuery from '../hooks/useMediaQuery.js'
import SidebarContent from './SidebarContent.js'

import classes from './Sidebar.module.css'

const SidebarContext = createContext({})

function useSidebarContext() {
  return useContext(SidebarContext)
}

function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true)

  const matchesStartpage = useMatch('/')
  const realOpen = matchesStartpage ? false : open

  const toggleSidebar = useCallback(() => {
    setOpen(oldOpen => !oldOpen)
  }, [ setOpen ])

  return (
    <SidebarContext.Provider value={{
      open: realOpen,
      setOpen,
      toggleSidebar,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarWidth = 320

function Sidebar() {
  const { open, toggleSidebar } = useSidebarContext()

  const iOS = (typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent))
  const isDesktop = useMediaQuery('(min-width: 960px)')

  if (open) {
    return <SwipeableDrawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      anchor="left"
      open={open}
      onOpen={toggleSidebar}
      onClose={toggleSidebar}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: 'border-box',
          backgroundColor: 'var(--background)',
          color: 'var(--on-background)',
        },
      }}
      PaperProps={{
        sx: {
          background: 'var(--background-contrast)',
          color: 'var(--on-background)',
        }
      }}
    >
      <SidebarContent />
    </SwipeableDrawer>
  }

  return null
}
function Main({ children }) {
  const { open } = useSidebarContext()

  return <main
    className={`${classes.main} ${open ? classes.open : ''}`}
    style={{
      '--sidebarWidth': sidebarWidth+'px',
    }}
  >
    {children}
  </main>
}

export {
  SidebarContext,
  useSidebarContext,
  SidebarProvider,
  SidebarContent,
  Sidebar,
  Main,
}

/*
      <Drawer
        variant={isDesktop ? 'permanent' : ''}
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'var(--background)',
            color: 'var(--on-background)',
          },
        }}
        PaperProps={{
          sx: {
            background: 'var(--background-contrast)',
            color: 'var(--on-background)',
          }
        }}
      >
        <Sidebar />
      </Drawer>
      */
