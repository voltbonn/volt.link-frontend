import React, { useState, useCallback, useRef, useEffect } from 'react'
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

  MoreVertSharp as BlockMenuIcon,

  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  WebStoriesSharp as PosterIcon, // WebStories book bookmark ContactPage CropPortrait Layers Note PhotoAlbum Photo ViewCarousel
} from '@mui/icons-material'

import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch, Link } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'
import BlockTree from './BlockTree.js'
import BlocksLoader from './BlocksLoader.js'
import Twemoji from './Twemoji.js'
import ViewerAuto from './view/ViewerAuto.js'
import BlockMenu from './edit/BlockMenu.js'

import LocaleSelect from './edit/LocaleSelect.js'
import { locales } from '../fluent/l10n.js'

import useResizeObserver from '@react-hook/resize-observer'

const typeIcons = {
  redirect: <RedirectIcon />,
  page: <PageIcon />,
  person: <PersonIcon />,
  poster: <PosterIcon />,
}

const useSize = target => {
  const mountedRef = React.useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    if (mountedRef.current === true) {
      setSize(target.current.getBoundingClientRect())
    }
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    if (mountedRef.current === true) {
      setSize(entry.contentRect)
    }
  })
  return size
}

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

  const [favoriteBlocks, setFavoriteBlocks] = useState([])
  const loadBlocks = useLoadBlocks()

  const loadFavoriteBlocks = useCallback(async () => {
    const loadFavoriteBlockIds = (await loadBlocks({
      types: ['reaction'],
      roles: ['owner'],
      archived: false,
    }))
      .filter(block => block.properties?.icon?.emoji === '⭐️')
      .map(block => block.properties.reactionFor)

    const favoriteBlocks = await loadBlocks({
      ids: loadFavoriteBlockIds
    })
    setFavoriteBlocks(favoriteBlocks)
  }, [loadBlocks])
  useEffect(() => {
    if (mounted.current) {
      loadFavoriteBlocks()
    }
  }, [loadFavoriteBlocks])

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

  const searchButtonRef = useRef(null)
  const searchButtonSize = useSize(searchButtonRef)

  const openSearch = () => {
    const event = new CustomEvent('open_search')
    window.dispatchEvent(event)
  }
  // const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) // source: https://stackoverflow.com/questions/10527983/best-way-to-detect-mac-os-x-or-windows-computers-with-javascript-or-jquery?noredirect=1&lq=1
  const isMacLike = /(macintosh|macintel|macppc|mac68k|macos|iphone|ipad|ipod)/i.test(window.navigator.userAgent.toLowerCase())

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

        <MenuItem
          ref={searchButtonRef}
          onClick={openSearch}
          style={{
            width: '100%',
            justifyContent: 'space-between',
            // boxShadow: 'inset 0 0 0 1px rgba(var(--background-rgb), var(--alpha))',
            boxShadow: '0 0 0 1px var(--background)',
            background: 'var(--background)',

            // the following replaces the roundMenuItem-css-class
            borderRadius: 'var(--basis)',
            margin: '0',
            padding: 'var(--basis) var(--basis_x2)',
            // end of the roundMenuItem-css-class stuff
          }}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText
            secondary={<span style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Localized id="search" />

              {
                searchButtonSize?.width > 500
                  ? (
                    isMacLike
                      ? <kbd>⌘ K</kbd>
                      : <kbd>Ctrl+K</kbd>
                  )
                  : null
              }
              {/*
              Command / Cmd: ⌘
              Shift: ⇧
              Option / Alt: ⌥
              Control / Ctrl: ⌃
              Caps Lock: ⇪
            */}
            </span>}
          />
        </MenuItem>

        <br />

        {
          loggedIn
            ? <>
              <h2 style={{ margin: '0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))' }}>
                <Twemoji emojiClassName={classes.emoji} emoji="⭐️" /> <Localized id="favorites_heading" />
              </h2>
              <p className="body2" style={{ opacity: 0.8, margin: '0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))' }}>
                <Localized id="favorites_description" />
              </p>
              {
                favoriteBlocks.length > 0
                  ? favoriteBlocks
                    .map(block => {
                      if (block) {
                        return <div
                          key={block._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 'auto',
                          }}
                          className={classes.blockRow}
                        >
                          <ViewerAuto key={block._id} block={block} />
                          <div className={classes.blockRowActions}>
                            <BlockMenu
                              onReloadContext={loadFavoriteBlocks}
                              {...{
                                block,
                                // createBlock,
                                // saveType,
                              }}
                              trigger={props => (
                                <button
                                  {...props}
                                  className={`text hasIcon`}
                                  style={{
                                    margin: '0',
                                    padding: 'var(--basis) 0',
                                    flexShrink: '0',
                                  }}
                                >
                                  <BlockMenuIcon className="icon" />
                                </button>
                              )}
                            />
                          </div>
                        </div>
                      }
                      return null
                    })
                    .filter(Boolean)
                  : null
              }
              <br />
              <Divider style={{ opacity: 0.2, borderRadius: '10px' }} />
              <br />
            </>
            : null
        }

        {
          ['page', 'redirect', 'person']
            .map(type => (<Link to={`/list/${type}/`}>
              <MenuItem className="clickable_card" style={{
                // the following replaces the roundMenuItem-css-class
                borderRadius: 'var(--basis)',
                margin: '0',
                padding: 'var(--basis) var(--basis_x2)',
                // end of the roundMenuItem-css-class stuff
              }}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {typeIcons[type]}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' }}}
                  primary={<Localized id={`block_menu_type_label_plural_${type}`} />}
                />
              </MenuItem>
            </Link>))
        }

        <br />

        <MenuItem
          className="clickable_card"
          style={{
            // the following replaces the roundMenuItem-css-class
            borderRadius: 'var(--basis)',
            margin: '0',
            padding: 'var(--basis) var(--basis_x2)',
            // end of the roundMenuItem-css-class stuff
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LocaleChooserIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' } }}
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
                  ? <span style={{ marginBottom: '0', whiteSpace: 'normal' }}>
                    <Localized id="choose_locale_information" />
                  </span>
                  : null
              }
            </>}
          />
        </MenuItem>

        {
          loggedIn
            ? <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
              <MenuItem className="clickable_card" style={{
                // the following replaces the roundMenuItem-css-class
                borderRadius: 'var(--basis)',
                margin: '0',
                padding: 'var(--basis) var(--basis_x2)',
                // end of the roundMenuItem-css-class stuff
              }}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' } }}
                  primary={<Localized id="logout" />}
                />
              </MenuItem>
            </a>
            : <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
              <MenuItem className="clickable_card" style={{
                // the following replaces the roundMenuItem-css-class
                borderRadius: 'var(--basis)',
                margin: '0',
                padding: 'var(--basis) var(--basis_x2)',
                // end of the roundMenuItem-css-class stuff
              }}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' } }}
                  primary={<Localized id="login" />}
                />
              </MenuItem>
            </a>
        }

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
      <Divider style={{ opacity: 0.2, borderRadius: '10px' }} />
      <br />

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
