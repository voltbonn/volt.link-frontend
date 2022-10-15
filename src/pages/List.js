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
  Login as LoginIcon,
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

  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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

const sortableFieldsInfos = {
  'metadate.modified': {
    type: 'date',
  },
  'properties.text': {
    type: 'text',
  },
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
  const [sortedBlocks, setSortedBlocks] = useState([])
  const loadBlocks = useLoadBlocks()
  const [sorting, setSorting] = useState({
    path: 'metadate.modified',
    asc: true,
  })


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

  const sortableFields = Object.keys(sortableFieldsInfos)
  const sortBlocks = useCallback((loadedBlocks) => {
    const sorting_diretion_modifier = sorting.asc === true ? -1 : 1

    let newSortedBlocks = loadedBlocks
      .filter(block => !!block)
      .map(block => {
        if (!block.hasOwnProperty('properties')) {
          block.properties = {}
        }

        let sorting_text = ''
        if (sorting.path === 'metadate.modified') {
          sorting_text = block?.metadata?.modified || ''
        } else if (sorting.path === 'properties.text') {
          sorting_text = block?.properties?.text || block?.properties?.slug || ''
        }

        return {
          ...block,
          sorting_text,
        }
      })
      .sort((a, b) => {
        return a.sorting_text.localeCompare(
          b.sorting_text,
          undefined,
          {
            ignorePunctuation: false,
            numeric: false,
          }
        ) * sorting_diretion_modifier
      })

    const sortable_field_type = sortableFieldsInfos[sorting.path].type
    if (sortable_field_type === 'text') {
      
      const newSortedBlocksWithHeadings = []

      // add first letter starting blocks between the blocks
      for (let i = 0; i <= newSortedBlocks.length-1; i += 1) {

        if (i > 0) {
          newSortedBlocksWithHeadings.push(newSortedBlocks[i])
        }

        const this_block_id = newSortedBlocks[i]?._id || ''

        const thisLetter = (newSortedBlocks[i]?.properties?.text || newSortedBlocks[i]?.properties?.slug || '').slice(0, 1).toUpperCase()

        let nextLetter = ''
        if (newSortedBlocks.length > i + 1) {
          nextLetter = (newSortedBlocks[i + 1]?.properties?.text || newSortedBlocks[i + 1]?.properties?.slug || '').slice(0, 1).toUpperCase()
        }

        if (i === 0 || thisLetter !== nextLetter) {
          if (nextLetter === '') {
            // undefined
            newSortedBlocksWithHeadings.push({
              _id: '???_' + this_block_id,
              type: 'text',
              properties: {
                text: '???',
                text_style: 'h2',
                locale: 'en',
              },
              isSortHeading: true,
            })
          } else {
            // letter
            newSortedBlocksWithHeadings.push({
              _id: nextLetter + '_' + this_block_id,
              type: 'text',
              properties: {
                text: nextLetter,
                text_style: 'h2',
                locale: 'en',
              },
              isSortHeading: true,
            })
          }
        }

        if (i === 0) {
          newSortedBlocksWithHeadings.push(newSortedBlocks[i])
        }
      }
      
      setSortedBlocks(newSortedBlocksWithHeadings)
    } else {
      setSortedBlocks(newSortedBlocks)
    }
  }, [sorting, setSortedBlocks])
  const changeSorting = useCallback(path => {
    setSorting(oldSorting => ({
      ...oldSorting,
      path,
    }))
    sortBlocks(loadedBlocks)
  }, [loadedBlocks, sortBlocks])
  const toggleSortDirection = useCallback(() => {
    setSorting(oldSorting => ({
      ...oldSorting,
      asc: !oldSorting.asc,
    }))
    sortBlocks(loadedBlocks)
  }, [loadedBlocks, sortBlocks])

  const loadList = useCallback(async () => {
    const loadedContentBlocks = await loadBlocks({
      types: [filters.current.type],
      roles: filters.current.roles,
    })
    setLoadedBlocks(loadedContentBlocks)
    sortBlocks(loadedContentBlocks)
  }, [loadBlocks, setLoadedBlocks, sortBlocks])
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

          <div style={{ display: 'flex', gap: 'var(--basis)', flexWrap: 'wrap' }}>
            <button
              className="text hasIcon"
              style={{
                flexShrink: '0',
                margin: '0',
                justifyContent: 'flex-start',
              }}
              onClick={toggleSortDirection}
            >
              {
                sorting.asc === true
                  ? <ArrowUpwardIcon className="icon" />
                  : <ArrowDownwardIcon className="icon" />
              }
            </button>

            <PopoverMenu
              trigger={triggerProps => (
                <button
                  {...triggerProps}
                  className="text"
                  style={{
                    flexShrink: '0',
                    margin: '0',
                    justifyContent: 'flex-start',
                  }}
                >
                  <span style={{ verticalAlign: 'middle' }}>
                    <Localized id={'sort_label_' + sorting.path.replace(/\./g, '_')} />
                  </span>
                </button>
              )}
            >

              <div style={{ marginTop: '8px' }}></div>

              {
                sortableFields
                  .map(path => (
                    <MenuItem
                      className="roundMenuItem"
                      key={path}
                      onClick={() => changeSorting(path)}
                      selected={sorting.path === path}
                      sx={{
                        marginTop: '2px !important',
                        marginBottom: '2px !important',
                      }}
                    >
                      <ListItemText>
                        <Localized id={'sort_label_' + path.replace(/\./g, '_')} />
                      </ListItemText>
                    </MenuItem>
                  ))
              }
            </PopoverMenu>
          </div>
          <hr />

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
            loggedIn && ['redirect', 'page'].includes(filters.current.type)
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
              : <>
                <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                  <button
                    className="default green hasIcon"
                    style={{
                      flexShrink: '0',
                      margin: '0',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <LoginIcon className="icon" />
                    <span style={{ verticalAlign: 'middle' }}>
                      {getString('needs_login_block_type_new_'+ filters.current.type)}
                    </span>
                  </button>
                </a>
                <br />
                <br />
              </>
          }

          <React.Fragment key={sorting}>
          {
            sortedBlocks
              .filter(Boolean)
              .map(block => {
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
                  <ViewerAuto block={block} />
                  {
                    block?.isSortHeading === true
                      ? null
                      : <div className={classes.blockRowActions}>
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
                  }
                </div>
              })                 
          }
          </React.Fragment>
        </div>
      </main>
    </div>
  </div>
}

export default List
