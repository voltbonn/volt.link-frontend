import { useState, useCallback, useRef } from 'react'
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
  Archive as ArchiveIcon,

  Email as ContactIcon,
  GitHub as SourceCodeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,

  Help as HelpIcon,

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

import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch } from 'react-router-dom'

import { Localized } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import { useSidebarContext } from './Sidebar.js'
import AddMenu from './edit/AddMenu.js'
import BlockTree from './BlockTree.js'

import PopoverMenu from './PopoverMenu.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  action: <ActionIcon />,
}

export default function SidebarContent() {
  const { loggedIn } = useUser()
  const { toggleSidebar } = useSidebarContext()

  const matchesStartpage = useMatch('/')

  const refetchRef = useRef(null)
  const refetch = refetchRef.current
  const saveRefetchFunction = newRefetchFunction => {
    refetchRef.current = newRefetchFunction
  }

  const [types, setTypes] = useState({
    page: true,
    person: true,
    action: true,
  })
  const filteredTypes = Object.entries(types)
    .filter(([, value]) => value === true)
    .map(([key, ]) => key)
  
  const [showArchived, setShowArchived] = useState(false)
  function toggleShowArchived() {
    setShowArchived(setShowArchived => !setShowArchived)
  }

  const saveBlock = useSaveBlock()
  const navigate = useNavigate()

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
    const newTypes = { ...types }
    newTypes[type2toggle] = !newTypes[type2toggle]

    setTypes(newTypes)
    refetch()
  }, [ types, setTypes, refetch ])

  const viewBlock = useCallback(block => {
    navigate(`/view/${block._id}`)
  }, [ navigate ])

  return <div className={classes.content}>
    <header className={classes.header}>
      <div className={classes.headerBar}>
        {
          matchesStartpage
          ? <h1>Volt.Link</h1>
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

            <Divider style={{opacity: 0.2}} />

            <MenuItem
              onClick={toggleShowArchived}
              selected={showArchived === true}
            >
              <ListItemIcon>
                <ArchiveIcon className="icon" />
              </ListItemIcon>
              <ListItemText>
                <Localized id={showArchived ? 'filter_menu_showing_archiv' : 'filter_menu_show_archiv'} />
              </ListItemText>
            </MenuItem>

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

      <BlockTree
        onClick={viewBlock}
        createBlock={createBlock}
        blockMenu={true}
        onGetRefetch={saveRefetchFunction}
        types={filteredTypes}
        archived={showArchived}
      />

      <br/>
      <Divider style={{ opacity: 0.2 }} />
      <br/>

      <MenuList style={{ maxWidth: '100%' }}>

        {
          loggedIn
            ? <a href={`${window.domains.frontend}help`}>
                <MenuItem>
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
