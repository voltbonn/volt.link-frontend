import { useState, useCallback, useRef, useEffect } from 'react'
import classes from './SidebarContent.module.css'

import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'

import {
  MenuOpen as MenuOpenIcon,
  Add as AddIcon,

  Email as ContactIcon,
  GitHub as SourceCodeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,

  Help as HelpIcon,
} from '@mui/icons-material'

import useSaveBlock from '../hooks/useSaveBlock.js'
import useClickOnBlock from '../hooks/useClickOnBlock.js'

import { useNavigate, useMatch } from 'react-router-dom'

import { Localized } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'
import BlockTree from './BlockTree.js'

function debounce(func, wait, immediate) {
  // Source: underscore.js
	var timeout
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

export default function SidebarContent() {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const [showBlockTree, setShowBlockTree] = useState(false)
  var efficientSetShowBlockTree = useCallback(()=>{
    if (mounted.current) {
      debounce(() => {
        if (mounted.current) {
	        setShowBlockTree(true)
        }
      }, 10)()
    }
  }, [ setShowBlockTree, mounted ])
  useEffect(() => {
    efficientSetShowBlockTree()
  }, [ efficientSetShowBlockTree ])
  
  const { loggedIn } = useUser()
  const { toggleSidebar } = useSidebarContext()

  const matchesStartpage = useMatch('/')

  const saveBlock = useSaveBlock()
  const navigate = useNavigate()

  const createBlock = useCallback(newBlock => {
    saveBlock(newBlock)
      .then(gottenBlock => {
        navigate(`/${gottenBlock._id}/edit`)
      })
      .catch(error => {
        console.error(error)
      })
  }, [ saveBlock, navigate ])

  const { clickOnBlock } = useClickOnBlock()
  const viewBlock = useCallback(block => {
    clickOnBlock({ block })
  }, [ clickOnBlock ])

  const scrollContainerRef = useRef(null)

  return <div ref={scrollContainerRef} className={classes.scrollContainer}>
    <div className={classes.content}>
    <header className={classes.header}>
      <div className={classes.headerBar}>
        {
          matchesStartpage
          ? <h1>VoltLink</h1>
          : <button onClick={toggleSidebar} className="text hasIcon" style={{ margin: '0' }}>
              <MenuOpenIcon className="icon" />
            </button>
        }

        <AddMenu
          trigger={triggerProps => (
            <button className="default hasIcon" {...triggerProps}>
              <AddIcon className="icon" />
              {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Add</span> */}
            </button>
          )}
          createBlock={createBlock}
        />
      </div>
    </header>

      <MenuList style={{ maxWidth: '100%' }}>

        {
          loggedIn
            ? <a href={`${window.domains.frontend}help`}>
                <MenuItem className="roundMenuItem">
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="help_page" />} />
                </MenuItem>
              </a>
            : null
        }

        {
          loggedIn
            ? <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <MenuItem className="roundMenuItem">
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="logout" />} />
                </MenuItem>
              </a>
            : <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <MenuItem className="roundMenuItem">
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="login" />} />
                </MenuItem>
              </a>
        }

        <a href="mailto:thomas.rosen@volteuropa.org">
          <MenuItem className="roundMenuItem">
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="contact" />} />
          </MenuItem>
        </a>

        <a href="https://github.com/voltbonn/edit.volt.link" target="_blank" rel="noopener noreferrer">
          <MenuItem className="roundMenuItem">
            <ListItemIcon>
              <SourceCodeIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="source_code" />} />
          </MenuItem>
        </a>

      </MenuList>

      <br/>
      <Divider style={{ opacity: 0.2 }} />
      <br/>

      {
        showBlockTree
        ? <BlockTree
            onClick={viewBlock}
            createBlock={createBlock}
            showBlockMenu={true}
            scrollContainer={scrollContainerRef}
          />
        : null
      }
    </div>
  </div>
}
