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
  ImageSharp as ImageIcon,
  // CodeSharp as CodeIcon,
  // Remove as DividerIcon,
  // CheckBox as CheckboxIcon,
  WebStoriesSharp as PosterIcon, // WebStories book bookmark ContactPage CropPortrait Layers Note PhotoAlbum Photo ViewCarousel
  AbcSharp as DefinitionIcon,
  PublicSharp as WebsiteIcon,

  Visibility as ViewerIcon,
  Edit as EditorIcon,
  AdminPanelSettings as OwnerIcon,
  // Lock as NoAccessIcon,

  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  // Segment as GroupingIcon,

  ViewStreamSharp as ListLayoutIcon, // ViewStreamSharp ViewListSharp ViewHeadlineSharp
  GridViewSharp as GridLayoutIcon, // GridViewSharp ViewCompactSharp
} from '@mui/icons-material'

const typeIcons = {
  // button: <ButtonIcon />,
  // text: <TextIcon />,
  image: <ImageIcon />,
  // checkbox: <CheckboxIcon />,
  // code: <CodeIcon />,
  // divider: <DividerIcon />,
  redirect: <RedirectIcon />,
  page: <PageIcon />,
  person: <PersonIcon />,
  poster: <PosterIcon />,
  definition: <DefinitionIcon />,
  website: <WebsiteIcon />,
}
const possibleTypes = [
  // 'button',
  // 'text',
  'image',
  // 'checkbox',
  // 'code',
  // 'divider',
  'redirect',
  'page',
  'person',
  'poster',
  'definition',
  'website',
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
  'properties.locale': {
    type: 'text',
  },
}


const defaultSorting = {
  path: 'metadate.modified',
  asc: false,
}
export function ListView({
  preselectedTypes = possibleTypes,
  preselectedSorting = defaultSorting,
}) {

  const filteredTypes = preselectedTypes.filter(type => possibleTypes.includes(type))
  if (filteredTypes.length === 0) {
    preselectedTypes = possibleTypes
  } else {
    preselectedTypes = filteredTypes
  }

  const { getString, translateBlock, userLocales } = useLocalization()
  const [loadedBlocks, setLoadedBlocks] = useState([])
  const [sortedBlockGroups, setSortedBlockGroups] = useState([])
  const loadBlocks = useLoadBlocks()
  const [sorting, setSorting] = useState(preselectedSorting)
  const [layout, setLayout] = useState('list') // 'grid' or 'list'
  const isGrid = layout === 'grid'

  const filters = useRef({
    type: preselectedTypes[0],
    roles: [],
  })
  const changeLayout = useCallback(() => {
    setLayout(currentLayout => currentLayout === 'grid' ? 'list' : 'grid')
  }, [])

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

  const getFirstLetter = text => {
    // todo: should i group emojis and special characters in groups or should each letter/emoji stay as their own group?

    const matches = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|.)/i.exec(text) // source of the emoji part: https://melvingeorge.me/blog/check-if-string-contain-emojis-javascript
    if (matches) {
      return matches[0].toUpperCase()
    }
    return ''
  }

  const getText = useCallback(block => {
    if (!block) {
      return ''
    }

    const fallback_text = block?.properties?.text || block?.properties?.slug || ''
    const text = translateBlock(block, userLocales, fallback_text)

    if (text.toLowerCase().startsWith('volt ')) {
      return text.slice(5)
    }
    return text
  }, [translateBlock, userLocales])

  const sortableFields = Object.keys(sortableFieldsInfos)
  const sortBlocks = useCallback((loadedBlocks) => {

    let newSortedBlocks = loadedBlocks
      .filter(block => !!block)
      .map(block => {
        if (!block.hasOwnProperty('properties')) {
          block.properties = {}
        }

        let sorting_text = ''
        let sorting_display_text = ''
        if (sorting.path === 'metadate.modified') {
          sorting_text = block?.metadata?.modified || ''
          sorting_display_text = sorting_text
        } else if (sorting.path === 'properties.text') {
          sorting_text = getText(block) || ''
          sorting_display_text = getFirstLetter(sorting_text)
        } else if (sorting.path === 'properties.locale') {
          sorting_text = String(block?.properties?.locale || 'en').toUpperCase()
          sorting_display_text = sorting_text
        }

        return {
          ...block,
          sorting_text,
          sorting_display_text,
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
        )
      })

    if (sorting.asc === false) {
      newSortedBlocks = newSortedBlocks.reverse()
    }

    const sortable_field_type = sortableFieldsInfos[sorting.path].type
    if (sortable_field_type === 'text') {

      const newSortedBlocksWithHeadings = {}

      // add the days between the blocks
      if (Array.isArray(newSortedBlocks) && newSortedBlocks.length > 0) {
        let currentHeading = '???'
        for (let i = -1; i <= newSortedBlocks.length - 2; i += 1) {

        // const this_block_id = newSortedBlocks[i]?._id || ''

        let thisLetter = ''
        if (i >= 0 && newSortedBlocks.length >= i) {
          thisLetter = newSortedBlocks[i]?.sorting_display_text || ''
        }

        let nextLetter = ''
        if (i + 1 >= 0 && newSortedBlocks.length >= i + 1) {
          nextLetter = newSortedBlocks[i + 1]?.sorting_display_text || ''
        }

        if (i <= newSortedBlocks.length - 2 && (i === -1 || thisLetter !== nextLetter)) {
          if (nextLetter === '') {
            // undefined
            currentHeading = '???'
            // newSortedBlocksWithHeadings.push({
            //   _id: '???_' + this_block_id,
            //   type: 'text',
            //   properties: {
            //     text: '???',
            //     text_style: 'h2',
            //     locale: 'en',
            //   },
            //   isSortHeading: true,
            // })
          } else {
            // letter
            currentHeading = nextLetter
            // newSortedBlocksWithHeadings.push({
            //   _id: nextLetter + '_' + this_block_id,
            //   type: 'text',
            //   properties: {
            //     text: nextLetter,
            //     text_style: 'h2',
            //     locale: 'en',
            //   },
            //   isSortHeading: true,
            // })
          }
        }

          if (!newSortedBlocksWithHeadings.hasOwnProperty(currentHeading)) {
            newSortedBlocksWithHeadings[currentHeading] = {
              heading: currentHeading,
              blocks: [],
            }
          }

          newSortedBlocksWithHeadings[currentHeading].blocks.push(newSortedBlocks[i + 1])
        }
      }

      setSortedBlockGroups(Object.values(newSortedBlocksWithHeadings))
    } else if (sortable_field_type === 'date') {

      const newSortedBlocksWithHeadings = {}

      if (Array.isArray(newSortedBlocks) && newSortedBlocks.length > 0) {
        // add first letter starting blocks between the blocks
        let currentHeading = '???'
        for (let i = -1; i <= newSortedBlocks.length - 2; i += 1) {

        // const this_block_id = newSortedBlocks[i]?._id || ''

        let thisDateString = ''
        if (i >= 0 && newSortedBlocks.length >= i) {
          thisDateString = (newSortedBlocks[i]?.metadata?.modified || '').slice(0, 10) // the first 10 letters are the date (YYYY-MM-DD)
        }

        let nextDateString = ''
        if (i + 1 >= 0 && newSortedBlocks.length >= i + 1) {
          nextDateString = (newSortedBlocks[i + 1]?.metadata?.modified || '').slice(0, 10) // the first 10 letters are the date (YYYY-MM-DD)
        }

        if (i <= newSortedBlocks.length - 2 && (i === -1 || thisDateString !== nextDateString)) {
          if (nextDateString === '') {
            // undefined
            currentHeading = '???'
            // newSortedBlocksWithHeadings.push({
            //   _id: '???_' + this_block_id,
            //   type: 'text',
            //   properties: {
            //     text: '???',
            //     text_style: 'h2',
            //     locale: 'en',
            //   },
            //   isSortHeading: true,
            // })
          } else {
            // letter
            currentHeading = nextDateString
            // newSortedBlocksWithHeadings.push({
            //   _id: nextDateString + '_' + this_block_id,
            //   type: 'text',
            //   properties: {
            //     text: nextDateString,
            //     text_style: 'h2',
            //     locale: 'en',
            //   },
            //   isSortHeading: true,
            // })
          }
        }

          if (!newSortedBlocksWithHeadings.hasOwnProperty(currentHeading)) {
            newSortedBlocksWithHeadings[currentHeading] = {
              heading: currentHeading,
              blocks: [],
            }
          }

        newSortedBlocksWithHeadings[currentHeading].blocks.push(newSortedBlocks[i + 1])
        }
      }

      setSortedBlockGroups(Object.values(newSortedBlocksWithHeadings))
    } else {
      setSortedBlockGroups(newSortedBlocks)
    }
  }, [sorting, setSortedBlockGroups, getText])
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
      archived: false,
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

  return <div style={{
    margin: 'var(--basis_x2) 0',
  }}>

    <div style={{
      display: 'flex',
      gap: 'var(--basis)',
      flexWrap: 'wrap',
      justifyItems: 'flex-start',
    }}>

      <button
        className={`${layout === 'list' ? 'default' : 'text'} hasIcon`}
        style={{
          width: 'auto',
          margin: '0 calc(-1 * var(--basis)) 0 0',
          '--borderRadius': (
            layout === 'list'
            ? '0'
            : 'calc(0.3 * var(--body-font-size)) 0 0 calc(0.3 * var(--body-font-size))'
          ),
        }}
        onClick={changeLayout}
      >
        <ListLayoutIcon className="icon" />
      </button>
      <button
        className={`${layout === 'grid' ? 'default' : 'text'} hasIcon`}
        style={{
          width: 'auto',
          margin: '0',
          '--borderRadius': (
            layout === 'grid'
            ? '0'
            : '0 calc(0.3 * var(--body-font-size)) calc(0.3 * var(--body-font-size)) 0'
          ),
        }}
        onClick={changeLayout}
      >
        <GridLayoutIcon className="icon" />
      </button>
      
      <button
        className="text hasIcon"
        style={{
          width: 'auto',
          margin: '0 calc(-1 * var(--basis)) 0 0',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingInlineEnd: 'var(--basis_x0_5)',
          '--borderRadius': 'calc(0.3 * var(--body-font-size)) 0 0 calc(0.3 * var(--body-font-size))',
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
              width: 'auto',
              display: 'flex',
              margin: '0',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingInlineStart: 'var(--basis_x0_5)',
              '--borderRadius': '0 calc(0.3 * var(--body-font-size)) calc(0.3 * var(--body-font-size)) 0',
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

    {
      preselectedTypes.length > 1 || possibleRoles.length > 1
        ? <>
            {
              preselectedTypes.length > 1
                ? <PopoverMenu
                  trigger={triggerProps => (
                    <button
                      {...triggerProps}
                      className="text hasIcon"
                      style={{
                        width: 'auto',
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
                    preselectedTypes
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
                : null
            }

            {
              possibleRoles.length > 1
                ? <PopoverMenu
                  trigger={triggerProps => (
                    <button
                      {...triggerProps}
                      className="text hasIcon"
                      style={{
                        width: 'auto',
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
                : null
            }
        </>
        : null
    }

    {
      !['person'].includes(filters.current.type)
        ? (
          loggedIn
            ? <>
              <button
                className="default green hasIcon"
                style={{
                  width: 'auto',
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
                    {getString('needs_login_block_type_new_' + filters.current.type)}
                  </span>
                </button>
              </a>
            </>
        )
        : null
    }

    </div>

    <hr className={classes.smallDivider} />

    <React.Fragment key={sorting}>
      {
        sortedBlockGroups
        .filter(group => !!group.blocks && Array.isArray(group.blocks) && group.blocks.length > 0)
        .map(group => (<>
          <h2 style={{ marginTop: 'var(--basis_x8)' }}>{group.heading}</h2>
          <div className={isGrid ? classes.grid_layout : classes.list_layout}>
            {
              group.blocks
                .filter(Boolean)
                .map(block => {
                  return <div
                    key={block._id}
                    style={{
                      // display: 'flex',
                      alignItems: isGrid ? 'flex-end' : 'center',
                      flexDirection: 'row',
                      height: 'auto',
                      display: 'inline-flex',
                    }}
                    className={classes.blockRow}
                  >
                    <ViewerAuto
                      size={
                        isGrid
                          ? 'icon'
                          : (
                            block?.type === 'image'
                              ? 'line'
                              : 'card'
                          )
                      }
                      block={block}
                    />
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
          </div>
        </>))
      }
    </React.Fragment>
  </div>
}

function List({
  preselectedTypes,
}) {

  const { getString } = useLocalization()

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
          {/* {getString('block_menu_type_label_plural_' + filters.current.type)} */}
          {title}
        </h1>

        <div className={classes.items}>
          <ListView preselectedTypes={preselectedTypes} />
        </div>
      </main>
    </div>
  </div>
}

export default List
