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

  Login as LoginIcon,
  Logout as LogoutIcon,

  LanguageSharp as LocaleChooserIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'
import BlockTree from './BlockTree.js'
import BlocksLoader from './BlocksLoader.js'

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

  const openSearch = () => {
    const event = new CustomEvent('open_search')
    window.dispatchEvent(event)
  }

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
          !matchesStartpage
          ? <button onClick={toggleSidebar} className="text hasIcon" style={{ margin: '0' }}>
              <MenuOpenIcon className="icon" />
            </button>
          : null
        }

          {
            matchesStartpage
              ? <h1>Volt.Link</h1>
              : <h2 style={{ margin: 0 }}>Volt.Link</h2>
          }

          <div>
            {
              matchesStartpage
                ? <button className="text hasIcon" onClick={openSearch} title="Search (???K / Ctrl+K)">
                    <SearchIcon className="icon" />
                  </button>
                : null
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

        <MenuItem
          className="roundMenuItem"
        >
          <ListItemIcon>
            <LocaleChooserIcon />
          </ListItemIcon>
          <ListItemText
            primary={<>
              <span style={{
                marginRight: 'var(--basis_x2)',
                verticalAlign: 'middle',
              }}>
                <Localized id="choose_locale" />
              </span>
              <LocaleSelect
                onChange={handleLocaleChange}
                defaultValue={userLocales[0]}
                options={ui_locales}
                style={{
                  fontSize: 'inherit',
                  padding: '4px 8px',
                  verticalAlign: 'middle',
                }}
              />
            </>}
            secondary={<>
              {
                typeof choose_locale_information_string === 'string'
                  && choose_locale_information_string !== ''
                  ? <span style={{ marginBottom: '0' }}>
                    <Localized id="choose_locale_information" />
                  </span>
                  : null
              }
            </>}
          />
        </MenuItem>

        <br />

        <BlocksLoader slugs={[
          'glossary',
          'vip',
          'tools',
        ]}>
          {({ blocks, slugs }) => {
            return slugs
              .map(slug => {
                const block = blocks.find(block => block?.properties?.slug === slug)
                if (block) {
                  return <ViewerAuto key={block._id} block={block} />
                }
                return null
              })
              .filter(Boolean)
          }}
        </BlocksLoader>

        <br />

        <BlocksLoader slugs={[
          'volt_link_workplace_group',
          'stats',
          'volt_link_source_code',
          'volt_link_contact',
          'imprint',
          'privacy_policy',
        ]}>
          {({ blocks, slugs }) => {
            return slugs
              .map(slug => {
                const block = blocks.find(block => block?.properties?.slug === slug)
                if (block) {
                  return <ViewerAuto key={block._id} block={block} />
                }
                return null
              })
              .filter(Boolean)
          }}
        </BlocksLoader>

      </MenuList>

      <br />
      <Divider style={{ opacity: 0.2 }} />
      <br/>

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
