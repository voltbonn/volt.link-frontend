import { useState, useCallback } from 'react'
import classes from './SidebarContent.module.css'

import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material'

import {
  MenuOpen as MenuOpenIcon,
  Replay as RequeryIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  MoreHorizSharp as BlockMenuIcon,

  Email as ContactIcon,
  GitHub as SourceCodeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,

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

  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

import { useQuery } from '@apollo/client' // useApolloClient
import { getBlocks_Query } from '../graphql/queries'
import useSaveBlock from '../hooks/useSaveBlock.js'

import { useNavigate, useMatch } from 'react-router-dom'

import { Localized } from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import ViewerAuto from './view/ViewerAuto.js'
import { useSidebarContext } from './Sidebar.js'
import BlockMenu from './edit/BlockMenu.js'
import AddMenu from './edit/AddMenu.js'

import PopoverMenu from './PopoverMenu.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  action: <ActionIcon />,
}

const checkIfArrayHasContent = level => !!level && Array.isArray(level) && level.length > 0


function BlockRows ({ levels, level, createBlock }) {
  if (!checkIfArrayHasContent(level)) {
    return null
  }

  return level
    .map(block => <BlockRow
      key={block._id}
      block={block}
      levels={levels}
      createBlock={createBlock}
    />)
}

function BlockRow ({ block, levels, createBlock }) {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleExpandToggle = useCallback(() => {
    setOpen(oldOpen => !oldOpen)
  }, [setOpen])

  const actions = {
    click: () => {
      navigate(`/view/${block._id}`)
    }
  }

  const rowContent = <>
    <ViewerAuto
      size="line"
      block={block}
      actions={actions}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
    />

    <div className={classes.blockRowActions}>
      <BlockMenu
        {...{
          block,
          createBlock,
          // setType: saveType,
        }}
        trigger={props => (
          <button
            {...props}
            className="text hasIcon"
            style={{
              margin: '0 0 0 var(--basis_x2)',
              padding: 'var(--basis) 0',
              flexShrink: '0',
            }}
          >
            <BlockMenuIcon className="icon" />
          </button>
        )}
      />
    </div>
  </>

  const nextLevel = levels[block._id]
  if (checkIfArrayHasContent(nextLevel)) {
    return <>
      <div style={{
        display: 'flex',
      }}>
        <button
          className="text hasIcon"
          style={{
            margin: '0 calc(2.5 * var(--basis)) 0 0',
            padding: 'var(--basis) 0',
            flexShrink: '0',
          }}
          onClick={handleExpandToggle}
        >
          {open ? <ExpandLessIcon className="icon" /> : <ExpandMoreIcon className="icon" />}
        </button>

        <div
          key={block._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          }}
          className={classes.blockRow}
        >
          {rowContent}
        </div>
      </div>
      <div style={{
        marginLeft: 'calc(8 * var(--basis))',
      }}>
        <Collapse in={open} timeout="auto">
          <BlockRows
            levels={levels}
            level={nextLevel}
            createBlock={createBlock}
          />
        </Collapse>
      </div>
    </>
  } else {
    return <div
      key={block._id}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      className={classes.blockRow}
    >
      {rowContent}
    </div>
  }
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

  const saveBlock = useSaveBlock()

  const navigate = useNavigate()

  const { data, refetch } = useQuery(getBlocks_Query, {
    variables: {
      types: filteredTypes,
     },
  })

  const blocks = data?.blocks || []

  const levels = blocks.reduce((acc, block) => {
    const parentId = block.parent || '_root'
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(block)
    return acc
  }, {})
  // get levelKeys and sort by string values
  const levelKeys = Object.keys(levels).sort((a, b) => a.localeCompare(b))

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
            <BlockRows
              levels={levels}
              level={levels[levelKeys[0]]}
              createBlock={createBlock}
            />
          </div>
        </>
        : null
      }

      <br/>
      <Divider style={{ opacity: 0.2 }} />
      <br/>

      <MenuList style={{ maxWidth: '100%' }}>

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
