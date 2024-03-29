import React, { useState, useCallback, useRef, useEffect } from 'react'
import classes from './SidebarContent.module.css'

import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  ImageSharp as ImageIcon,
  AbcSharp as DefinitionIcon,

} from '@mui/icons-material'

import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch, Link } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useLoadLastModifiedBlocks from '../hooks/useLoadLastModifiedBlocks.js'
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
  definition: <DefinitionIcon />,
  image: <ImageIcon />,
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

export default function SidebarContent({ oneColumn = false }) {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const loadBlocks = useLoadBlocks()
  const loadLastModifiedBlocks = useLoadLastModifiedBlocks()

  const [favoriteBlocks, setFavoriteBlocks] = useState([])
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
  
  const [recentBlocks, setRecentBlocks] = useState([])
  const loadRecentBlocks = useCallback(async () => {
    const newRecentBlocks = await loadLastModifiedBlocks({
      types: ['page', 'person', 'poster', 'redirect','definition'],
      archived: false,
      first: 5,
    })
    setRecentBlocks(newRecentBlocks)
  }, [loadLastModifiedBlocks])
  useEffect(() => {
    if (mounted.current) {
      loadFavoriteBlocks()
      loadRecentBlocks()
    }
  }, [loadFavoriteBlocks, loadRecentBlocks])

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
                ? <h1 style={{ margin: 0 }}>Volt.Link</h1>
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



      <div className={`${classes.startpage_cards} ${oneColumn === true ? classes.oneColumn : ''}`}>
        <div
          className={`${classes.card} ${classes.full_width}`}
          onClick={openSearch}
          style={{ cursor: 'pointer' }}
        >
          <MenuList className={classes.content} style={{ maxWidth: '100%' }}>

            <MenuItem
              ref={searchButtonRef}
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
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: 'var(--body-font-size)',
                    fontWeight: 'bold',
                  }}>
                    <Localized id="search" />
                  </span>
                 

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

          </MenuList>
        </div>



        {
          loggedIn
            ?
            <div className={classes.card}>
              <MenuList className={classes.content} style={{ maxWidth: '100%' }}>

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
              </MenuList>
            </div>
            : null
        }

        {
          loggedIn && recentBlocks.length > 0
            ?
            <div className={classes.card}>
              <MenuList className={classes.content} style={{ maxWidth: '100%' }}>

                <h2 style={{ margin: '0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))' }}>
                  <Twemoji emojiClassName={classes.emoji} emoji="⏮️" /> <Localized id="recent_heading" />
                </h2>
                <p className="body2" style={{ opacity: 0.8, margin: '0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))' }}>
                  <Localized id="recent_description" />
                </p>
                {
                  recentBlocks.length > 0
                    ? recentBlocks
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
                                onReloadContext={loadRecentBlocks}
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
              </MenuList>
            </div>
            : null
        }

        <div className={classes.card}>
          <MenuList className={classes.content} style={{ maxWidth: '100%' }}>


            {
              loggedIn
                ? <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                  <MenuItem className="clickable_card" style={{
                    // the following replaces the roundMenuItem-css-class
                    borderRadius: 'var(--basis)',
                    margin: '0',
                    padding: 'var(--basis) var(--basis_x2)',
                    // end of the roundMenuItem-css-class stuff
                    background: 'var(--red)',
                    color: 'var(--on-red)',
                  }}>
                    <ListItemIcon>
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
                    background: 'var(--green)',
                    color: 'var(--on-green)',
                  }}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' } }}
                      primary={<Localized id="login" />}
                    />
                  </MenuItem>
                </a>
            }


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
              <ListItemIcon>
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

            <br />

            {
              ['redirect', 'page', 'person', 'image', 'definition', 'poster']
                .map(type => (<Link key={type} to={`/list/${type}/`}>
                  <MenuItem className="clickable_card" style={{
                    // the following replaces the roundMenuItem-css-class
                    borderRadius: 'var(--basis)',
                    margin: '0',
                    padding: 'var(--basis) var(--basis_x2)',
                    // end of the roundMenuItem-css-class stuff
                  }}>
                    <ListItemIcon>
                      {typeIcons[type]}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ style: { fontWeight: 'bold', fontFamily: 'inherit' } }}
                      primary={<Localized id={`block_menu_type_label_plural_${type}`} />}
                    />
                  </MenuItem>
                </Link>))
            }

          </MenuList>
        </div>

        <div className={classes.card}>
          <MenuList className={classes.content} style={{ maxWidth: '100%' }}>

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
              'about',
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
        </div>

        {/* All blocks: */}
        {
          showBlockTree
            ? <div className={classes.card}>
              <BlockTree
                className={classes.content}
                showBlockMenu={true}
                scrollContainer={scrollContainerRef}
              />
            </div>
            : null
        }

      </div>
              
    </div>
  </div>
}
