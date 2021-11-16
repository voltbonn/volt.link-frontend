import { useState, useCallback } from 'react'
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
  Replay as RequeryIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,

  Email as ContactIcon,
  GitHub as SourceCodeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,

  Home as HomeIcon,
  // Search as SearchIcon,

  InsertDriveFileSharp as PageIcon,
  AutoAwesomeSharp as ActionIcon,
  // LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // TitleSharp as HeadlineIcon,
  // NotesSharp as TextIcon,
  // Remove as DividerIcon,
  // EditSharp as EditIcon,
} from '@mui/icons-material'

import { useQuery } from '@apollo/client' // useApolloClient
import { getBlocks_Query } from '../graphql/queries'
import useSaveBlock from '../hooks/useSaveBlock.js'

import { Link, useNavigate, useMatch } from 'react-router-dom'

import { Localized } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import ViewerAuto from './view/ViewerAuto.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'

import PopoverMenu from './PopoverMenu.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  action: <ActionIcon />,
}

export default function SidebarContent({ leftHeaderActions, rightHeaderActions }) {
  const { loggedIn } = useUser()
  // const apollo_client = useApolloClient()
  const { toggleSidebar } = useSidebarContext()

  const matchesStartpage = useMatch('/')

  const [types, setTypes] = useState({
    page: true,
    person: true,
    action: true,
  })
  const filteredTypes = Object.entries(types)
    .filter(([, value]) => value === true)
    .map(([key, ]) => key)

  // const [blocks, setBlocks] = useState([])
  const saveBlock = useSaveBlock()

  const navigate = useNavigate()

  const { data, refetch } = useQuery(getBlocks_Query, {
    variables: {
      types: filteredTypes,
     },
  })

  const blocks = data?.blocks || []

  // const queryBlocks = useCallback(() => {
  //   console.log('queryBlocks')
  //   apollo_client.query({
  //     query: getBlocks_Query,
  //     variables: {
  //       types: filteredTypes,
  //     },
  //   })
  //     .then(async ({ data }) => {
  //       if (typeof data.error === 'string' || !data.blocks) {
  //         console.error('error', data.error)
  //       } else {
  //         setBlocks(data.blocks || [])
  //       }
  //     })
  //     .catch(async error => {
  //       console.error('error', error)
  //     })
  // }, [ apollo_client, setBlocks, filteredTypes ])

  // useEffect(() => {
  //   queryBlocks()
  // }, [ queryBlocks ])

  // const handleTypeChange = useCallback(newType => {
  //   setType(newType)
  //   if (
  //     typeof newType === 'string'
  //     && newType !== ''
  //     && newType !== type
  //   ) {
  //     queryBlocks(newType)
  //   }
  // }, [ type, setType, queryBlocks ])

  const createBlock = useCallback(newBlock => {
    saveBlock(newBlock)
      .then(gottenBlock => {
        navigate(`/edit/${gottenBlock._id}`)
      })
      .catch(error => {
        console.error(error)
      })
  }, [ saveBlock, navigate ])

  const toggleType = useCallback(type2toggle => {
    setTypes(types => {
      types[type2toggle] = !types[type2toggle]
      return types
    })
    refetch()
  }, [ setTypes, refetch ])

  return <div className={classes.content}>
    <header className={classes.header}>
      <div className={classes.headerBar}>
        {
          matchesStartpage
          ? <div></div>
          : <button onClick={toggleSidebar} className="text hasIcon" style={{ margin: '0' }}>
              <MenuOpenIcon className="icon" />
            </button>
        }

        <div>

          <button className="text hasIcon" onClick={() => refetch()}>
            <RequeryIcon className="icon" />
            {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Reload</span> */}
          </button>

          <PopoverMenu
            trigger={triggerProps => (
              <button className="text hasIcon" {...triggerProps}>
                <FilterListIcon className="icon" />
                {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Filter</span> */}
              </button>
            )}
          >
            {/*
              { value: 'page', icon: <PageIcon className="icon"/>, title: getString('block_menu_type_label_plural_page') },
              { value: 'person', icon: <PersonIcon className="icon" />, title: getString('block_menu_type_label_plural_person') },
              { value: 'action', icon: <ActionIcon className="icon" />, title: getString('block_menu_type_label_plural_action') },
            */}

            <div style={{ marginTop: '8px' }}></div>

            {
              Object.keys(types)
                .map(type => (
                  <MenuItem
                    key={type}
                    onClick={() => toggleType(type)}
                    selected={filteredTypes.includes(type)}
                  >
                    <ListItemIcon>
                      {blockTypeIcons[type]}
                    </ListItemIcon>
                    <ListItemText>
                      <Localized id={'block_menu_type_label_plural_'+type} />
                    </ListItemText>
                  </MenuItem>
                ))
            }

          </PopoverMenu>

          <AddMenu
            trigger={triggerProps => (
              <button className="white hasIcon" {...triggerProps}>
                <AddIcon className="icon" />
                {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Add</span> */}
              </button>
            )}
            createBlock={createBlock}
          />
        </div>
      </div>
    </header>

      {
      blocks.length > 0
        ? <>
          <div className="buttonRow usesLinks">
            {
              blocks
              .map(block => {

                const actions = {
                  click: () => {
                    navigate(`/view/${block._id}`)
                  }
                }

                return <div key={block._id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  <ViewerAuto
                    size="line"
                    block={block}
                    actions={actions}
                    style={{
                      flexGrow: '1',
                    }}
                  />
                  {/*
                  <Link to={`/edit/${block._id}`}>
                    <button
                      className="hasIcon"
                      style={{
                        margin: 'var(--basis) 0 0 var(--basis_x4)',
                      }}
                    >
                      <EditIcon className="icon" />
                      <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>
                        <Localized id="edit_block" />
                      </span>
                    </button>
                  </Link>
                  */}
                </div>
              })
            }
          </div>
        </>
        : null
      }

      <br/>
      <Divider style={{ opacity: 0.2 }} />
      <br/>

      <MenuList style={{ maxWidth: '100%' }}>

        {
          matchesStartpage
          ? null
          : <Link to="/">
              <MenuItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>
                  Home
                </ListItemText>
              </MenuItem>
            </Link>
        }

        {
          loggedIn
            ? <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <MenuItem>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="logout" />} />
                </MenuItem>
              </a>
            : <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
                <MenuItem>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Localized id="login" />} />
                </MenuItem>
              </a>
        }

        <a href="mailto:thomas.rosen@volteuropa.org">
          <MenuItem>
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="contact" />} />
          </MenuItem>
        </a>

        <a href="https://github.com/voltbonn/edit.volt.link" target="_blank" rel="noopener noreferrer">
          <MenuItem>
            <ListItemIcon>
              <SourceCodeIcon />
            </ListItemIcon>
            <ListItemText primary={<Localized id="source_code" />} />
          </MenuItem>
        </a>

      </MenuList>

  </div>
}

/*


    <input
      type="text"
      placeholder="title"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
    <textarea
      placeholder="description"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
*/
