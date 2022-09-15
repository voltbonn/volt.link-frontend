import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Helmet } from 'react-helmet'

import { Localized, useLocalization } from '../fluent/Localized.js'

import Header from '../components/Header.js'
import PopoverMenu from '../components/PopoverMenu.js'
import BlockMenu from '../components/edit/BlockMenu.js'
import ViewerAuto from '../components/view/ViewerAuto.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'
import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate } from 'react-router-dom'

import classes from './List.module.css'

import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  // Divider,
} from '@mui/material'


import {
  Search as SearchIcon,

  MoreVertSharp as BlockMenuIcon,
  // ArrowDropDownSharp as ExpandLessIcon,
  // ArrowRightSharp as ExpandMoreIcon,

  // Replay as RequeryIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  // Archive as ArchiveIcon,

  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // NotesSharp as TextIcon,
  // ImageSharp as ImageIcon,
  // CodeSharp as CodeIcon,
  // Remove as DividerIcon,
  // CheckBox as CheckboxIcon,
  WebStoriesSharp as PosterIcon, // WebStories book bookmark ContactPage CropPortrait Layers Note PhotoAlbum Photo ViewCarousel

  Visibility as ViewerIcon,
  Edit as EditorIcon,
  AdminPanelSettings as OwnerIcon,
  // Lock as NoAccessIcon,
} from '@mui/icons-material'

const typeIcons = {
  // button: <ButtonIcon />,
  // text: <TextIcon />,
  // image: <ImageIcon />,
  // checkbox: <CheckboxIcon />,
  // code: <CodeIcon />,
  // divider: <DividerIcon />,
  redirect: <RedirectIcon />,
  page: <PageIcon />,
  person: <PersonIcon />,
  poster: <PosterIcon />,
}
const possibleTypes = [
  // 'button',
  // 'text',
  // 'image',
  // 'checkbox',
  // 'code',
  // 'divider',
  'redirect',
  'page',
  'person',
  'poster',
]

const roleIcons = {
  owner: <OwnerIcon />,
  editor: <EditorIcon />,
  viewer: <ViewerIcon />,
  // no_access: <NoAccessIcon />,
}

function List({
  preselectedTypes = possibleTypes,
}) {

  const filteredTypes = preselectedTypes.filter(type => possibleTypes.includes(type))
  if (filteredTypes.length === 0) {
    preselectedTypes = possibleTypes
  } else {
    preselectedTypes = filteredTypes
  }

  const { getString } = useLocalization()
  const [loadedBlocks, setLoadedBlocks] = useState([])
  const loadBlocks = useLoadBlocks()

  const filters = useRef({
    type: preselectedTypes[0],
    roles: [],
  })

  const { loggedIn } = useUser()
  const [possibleRoles, setPossibleRoles] = useState([])
  useEffect(() => {
    if (loggedIn) {
      setPossibleRoles(['owner', 'editor', 'viewer'])
      filters.current.roles = ['owner', 'editor', 'viewer']
    } else {
      setPossibleRoles(['viewer'])
      filters.current.roles = ['viewer']
    }
  }, [loggedIn])

  const loadList = useCallback(async () => {
    const loadedContentBlocks = await loadBlocks({
      types: [filters.current.type],
      roles: filters.current.roles,
    })
    setLoadedBlocks(loadedContentBlocks)
    console.log('loadedContentBlocks', loadedContentBlocks)
  }, [loadBlocks, setLoadedBlocks])
  useEffect(() => {
    loadList()
  }, [loadList])

  const setTypeFilter = useCallback(newType => {
    filters.current.type = newType
    loadList()
  }, [loadList])

  const setRoleFilter = useCallback(newRole => {
    if (filters.current.roles.includes(newRole)) {
      filters.current.roles = filters.current.roles.filter(role => role !== newRole)
    } else {
      filters.current.roles.push(newRole)
    }
    loadList()
  }, [loadList])

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

  const openSearch = () => {
    const event = new CustomEvent('open_search')
    window.dispatchEvent(event)
  }

  const title = getString('list_title')
  
  const rightHeaderActions = <>
    <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
      <button className="default hasIcon" onClick={openSearch} title="Search (⌘K / Ctrl+K)">
        <SearchIcon className="icon" />
      </button>
    </div>
  </>

  return <div className={classes.root}>
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta name="description" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:description" content="" />
    </Helmet>

    <Header
      block={{
        type: 'page',
        properties: {
          text: title,
          slug: 'list',
          icon: {
            type: 'emoji',
            emoji: '🗒'
          }
        }
      }}
      title={title}
      rightActions={rightHeaderActions}
    />

    <div className={`basis_0_2 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      <main className={`${classes.contentWrapper}`}>
        <h1
          dir="auto"
          style={{
            whiteSpace: 'pre-wrap',
          }}
        >
          {getString('block_menu_type_label_plural_' + filters.current.type)}
        </h1>
        <div className={classes.items}>

          {
            possibleTypes.length > 1 || possibleRoles.length > 1
            ? <>
                <div style={{
                  display: 'flex',
                  gap: 'var(--basis)',
                  flexWrap: 'wrap',
                }}>

                  {
                    possibleTypes.length <= 1
                      ? null
                      : <PopoverMenu
                        trigger={triggerProps => (
                          <button
                            {...triggerProps}
                            className="text hasIcon"
                            style={{
                              flexShrink: '0',
                              margin: '0',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <FilterListIcon className="icon" />
                            <span style={{ verticalAlign: 'middle' }}>
                              {getString('block_menu_type_label_plural_' + filters.current.type)}
                            </span>
                          </button>
                        )}
                      >

                        <div style={{ marginTop: '8px' }}></div>

                        {
                          possibleTypes
                            .map(type => (
                              <MenuItem
                                className="roundMenuItem"
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                selected={filters.current.type === type}
                                sx={{
                                  marginTop: '2px !important',
                                  marginBottom: '2px !important',
                                }}
                              >
                                <ListItemIcon>
                                  {typeIcons[type]}
                                </ListItemIcon>
                                <ListItemText>
                                  <Localized id={'block_menu_type_label_plural_' + type} />
                                </ListItemText>
                              </MenuItem>
                            ))
                        }
                      </PopoverMenu>
                  }

                  {
                    possibleRoles.length <= 1
                      ? null
                      : <PopoverMenu
                        trigger={triggerProps => (
                          <button
                            {...triggerProps}
                            className="text hasIcon"
                            style={{
                              flexShrink: '0',
                              margin: '0',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <FilterListIcon className="icon" />
                            <span style={{ verticalAlign: 'middle' }}>
                              {
                                filters.current.roles.length === 0
                                  ? getString('path_editor_permissions')
                                  : filters.current.roles.map(role => getString('role_' + role)).join(', ')
                              }
                            </span>
                          </button>
                        )}
                      >

                        <div style={{ marginTop: '8px' }}></div>

                        {
                          possibleRoles
                            .map(role => (
                              <MenuItem
                                className="roundMenuItem"
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                selected={filters.current.roles.includes(role)}
                                sx={{
                                  marginTop: '2px !important',
                                  marginBottom: '2px !important',
                                }}
                              >
                                <ListItemIcon>
                                  {roleIcons[role]}
                                </ListItemIcon>
                                <ListItemText>
                                  <Localized id={'role_' + role} />
                                </ListItemText>
                              </MenuItem>
                            ))
                        }
                      </PopoverMenu>
                  }
                </div>
                <hr />
            </>
            : null
          }

          {
            loggedIn && ['redirect', 'page', 'poster'].includes(filters.current.type)
              ? <>
                <button
                  className="default green hasIcon"
                  style={{
                    flexShrink: '0',
                    margin: '0',
                    justifyContent: 'flex-start',
                  }}
                  onClick={() => createBlock({ type: filters.current.type })}
                >
                  <AddIcon className="icon" />
                  <span style={{ verticalAlign: 'middle' }}>
                    {getString('block_type_new_' + filters.current.type)}
                  </span>
                </button>
                <br />
                <br />
              </>
              : null
          }

          {
            loadedBlocks
              .filter(block => !!block)
              .map(block => <div
                key={block._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 'auto',
                }}
                className={classes.blockRow}
              >
                <ViewerAuto block={block} />
                <div className={classes.blockRowActions}>
                  <BlockMenu
                    onReloadContext={loadList}
                    block={block}
                    trigger={props => (
                      <button
                        {...props}
                        className={`text hasIcon`}
                        style={{
                          margin: '0',
                          padding: 'var(--basis_x0_5) 0',
                          flexShrink: '0',
                        }}
                      >
                        <BlockMenuIcon className="icon" />
                      </button>
                    )}
                  />
                </div>
              </div>  
              )                 
          }
        </div>
      </main>
    </div>
  </div>
}

export default List
