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
  BarChartSharp as StatisticsIcon,
} from '@mui/icons-material'

import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'
import BlockTree from './BlockTree.js'

import ViewerAuto from './view/ViewerAuto.js'

import LocaleSelect from './edit/LocaleSelect.js'
import { locales } from '../fluent/l10n.js'

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

  const {
    getString,
    userLocales = [],
  } = useLocalization()

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

  const createBlock = useCallback(({ type }) => {
    if (typeof type === 'string' && type.length > 0) {
      saveBlock({
        type,
      })
        .then(gottenBlock => {
          navigate(`/${gottenBlock._id}/edit`)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [saveBlock, navigate])

  const scrollContainerRef = useRef(null)

  const handleLocaleChange = useCallback(newLocale => {
    const newEvent = new CustomEvent('change_locale', {
      detail: {
        locale: newLocale,
      },
      bubbles: true,
      cancelable: false,
    })
    document.dispatchEvent(newEvent)
  }, [])

  const ui_locales = [
    '_',
    ...Object.keys(locales),
  ]

  const choose_locale_information_string = getString('choose_locale_information')

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

        {
          loggedIn
            ? <div>
              <MenuItem
                component="a"
                target="_blank"
                href='https://volteuropa.workplace.com/groups/voltlink'
                className="roundMenuItem"
              >
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={<Localized id="workplace_group" />} />
              </MenuItem>
              <MenuItem
                component="a"
                target="_blank"
                href='https://umami.qiekub.org/share/s0ZHBZbb/01%20volt.link'
                className="roundMenuItem"
              >
                <ListItemIcon>
                  <StatisticsIcon />
                </ListItemIcon>
                <ListItemText primary={<Localized id="volt_link_statistics" />} />
              </MenuItem>
            </div>
            : null
        }

        <a href="mailto:thomas.rosen@volteuropa.org">
          <MenuItem className="roundMenuItem">
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="contact" />} />
          </MenuItem>
        </a>

        <a href="https://github.com/voltbonn/" target="_blank" rel="noopener noreferrer">
          <MenuItem className="roundMenuItem">
            <ListItemIcon>
              <SourceCodeIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="source_code" />} />
          </MenuItem>
        </a>

      </MenuList>

      <br />
      <Divider style={{ opacity: 0.2 }} />
      <br />

      <div>
        <span style={{
          marginInlineEnd: 'var(--basis_x4)',
        }}>
          <Localized id="choose_locale" />
        </span>
        <LocaleSelect
          onChange={handleLocaleChange}
          defaultValue={userLocales[0]}
          options={ui_locales}
        />
      </div>
      {
        typeof choose_locale_information_string === 'string'
        && choose_locale_information_string !== ''
          ? <p style={{ marginBottom: '0' }}>
            <Localized id="choose_locale_information" />
          </p>
          : null
      }

      <br />
      <Divider style={{ opacity: 0.2 }} />
      <br/>

      {/* Glossar: */}
      {/* TODO: The ID should not be hard-coded. */}
      <ViewerAuto blockId="6270fb12daa76251eb6c0391" />

      {/* All blocks: */}
      {
        showBlockTree
        ? <BlockTree
            showBlockMenu={true}
            scrollContainer={scrollContainerRef}
          />
        : null
      }
    </div>
  </div>
}
