import { useCallback, useState } from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  ListSubheader,
  ListItemText,
  ListItem,
} from '@mui/material'

import {
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,

  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  // Delete as DeleteIcon,
  Close as CloseIcon,
  // VerticalAlignTop as VerticalAlignTopIcon,
  // VerticalAlignBottom as VerticalAlignBottomIcon,
  Add as AddIcon,
  RepeatSharp as RepeatIcon,
  // RemoveCircleSharp as RemoveCircleIcon,

  InsertDriveFileSharp as PageIcon,
  // LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  Crop75Sharp as ButtonIcon,
  TitleSharp as HeadlineIcon,
  NotesSharp as TextIcon,
  // CodeSharp as CodeIcon,
  Remove as DividerIcon,
  CheckBox as CheckboxIcon,
  AutoAwesomeSharp as AutomationIcon,

  PreviewSharp as ViewIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import useArchiveBlock from '../../hooks/useArchiveBlock.js'

import Popover from '../Popover.js'
import SubMenu from '../SubMenu.js'
import { AddMenuContent } from './AddMenu.js'

function BlockMenu ({
  block = {},
  getString,

  trigger,
  onToogle,

  setType,
  createBlock,

  toggle_active = null,
  active = null,
  onRemoveRow = null,
  addRowBefore = null,
  // addRowAfter = null,
}) {
  const navigate = useNavigate()

  const { _id = '', type = '', properties = {} } = block

  const [archived, setArchived] = useState(properties.archived === true)
  const archiveBlock = useArchiveBlock()

  // const handleAddRowBefore = useCallback(() => {
  //
  //   // const newBlock = {
  //   //   type,
  //   // }
  //
  //   const newBlockId = ''
  //
  //   addRowBefore({
  //     blockId: newBlockId,
  //   })
  // }, [ addRowBefore ])

  const viewBlock = useCallback(() => {
    navigate(`/${_id}/view`)
  }, [ _id, navigate ])

  const editBlock = useCallback(() => {
    navigate(`/${_id}/edit`)
  }, [ _id, navigate ])

  const createChildBlock = useCallback(newBlock => {
    createBlock({
      ...newBlock,
      parent: _id,
    })
  }, [ createBlock, _id ])

  const toggleArchiveBlock = useCallback(() => {
    const newArchived = !archived
    archiveBlock({ _id: block._id, archive: newArchived })
      .then(() => {
        setArchived(newArchived)
      })
      .catch(console.error)
  }, [ archiveBlock, setArchived, archived, block ])

  const metadata = block.metadata || {}

  return <>
  <Popover
    trigger={trigger}
    onToogle={onToogle}
  >
    {({closePopover, open, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 380,
            // height: 325,
            maxHeight: 'calc(100vh - 32px)',
            overflow: 'auto',
            background: 'var(--background-contrast)',
            color: 'var(--on-background)',
          }}
          elevation={8}
        >
          <MenuList
            autoFocus={true}
            style={{
              width: '100%',
              maxWidth: '100%',
              // marginTop: '-8px',
            }}
          >

            {
              typeof setType === 'function'
              ? <SubMenu
                  parentMenuIsOpen={open}
                  label={<>
                    <ListItemIcon>
                      <RepeatIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_choose_type_label" />
                  </>}
                  MenuListProps={{
                    style: {
                      marginTop: '-8px',
                    },
                  }}
                >
                  <ListSubheader
                    style={{
                      whiteSpace: 'nowrap',
                      lineHeight: '1',
                      margin: '0',
                      padding: '12px 16px 12px',
                      backgroundColor: 'var(--background-contrast)',
                      color: 'var(--on-background)',
                    }}
                  >
                    <Localized id="block_menu_choose_type_label" />
                  </ListSubheader>

                  <div style={{height: '4px'}}></div>

                  {
                    [
                      { value: 'page', icon: <PageIcon />, label: getString('block_menu_type_label_page') },
                      // { value: 'redirect', icon: <RedirectIcon />, label: getString('block_menu_type_label_redirect') },
                      { value: 'person', icon: <PersonIcon />, label: getString('block_menu_type_label_person') },
                      { value: 'button', icon: <ButtonIcon />, label: getString('block_menu_type_label_button') },
                      { value: 'headline', icon: <HeadlineIcon />, label: getString('block_menu_type_label_headline') },
                      // { value: 'headline3', label: getString('block_menu_type_label_headline3') },
                      { value: 'text', icon: <TextIcon />, label: getString('block_menu_type_label_text') },
                      // { value: 'code', icon: <CodeIcon />, label: getString('block_menu_type_label_code') },
                      { value: 'divider', icon: <DividerIcon />, label: getString('block_menu_type_label_divider') },
                      { value: 'checkbox', icon: <CheckboxIcon />, label: getString('block_menu_type_label_checkbox') },
                      { value: 'automation', icon: <AutomationIcon />, label: getString('block_menu_type_label_automation') },
                    ]
                    .map(option => (
                      <MenuItem
                        key={option.value}
                        selected={option.value === type}
                        onClick={() => setType(option.value)}
                        className="roundMenuItem"
                      >
                        <ListItemIcon>
                          {option.icon}
                        </ListItemIcon>
                        {option.label}
                      </MenuItem>
                    ))
                  }
                </SubMenu>
              : null
            }

            {/*
              addRowBefore
                ? <MenuItem onClick={handleAddRowBefore}>
                    <ListItemIcon>
                      <VerticalAlignTopIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_add_before" />
                  </MenuItem>
                : null
            */}

            {/*
              addRowAfter
                ? <MenuItem onClick={addRowAfter}>
                    <ListItemIcon>
                      <VerticalAlignBottomIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_add_after" />
                  </MenuItem>
                : null
            */}

            {/*
              onRemoveRow
                ? <MenuItem style={{marginTop:'8px'}} onClick={onRemoveRow}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_delete" />
                  </MenuItem>
                : null
            */}

            {
              typeof createBlock === 'function'
                ? <SubMenu
                    parentMenuIsOpen={open}
                    label={<>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <Localized id="block_menu_create_child_block" />
                    </>}
                  >
                    <AddMenuContent createBlock={createChildBlock} />
                  </SubMenu>
                : null
            }

            {
              typeof active === 'boolean' && toggle_active
                ? <MenuItem className="roundMenuItem" onClick={toggle_active}>
                    <ListItemIcon>
                      {
                        active
                        ? <VisibilityOffIcon />
                        : <VisibilityIcon />
                      }
                    </ListItemIcon>
                    {
                      active
                      ? <Localized id="block_menu_hide" />
                      : <Localized id="block_menu_show" />
                    }
                  </MenuItem>
                : null
            }

            <MenuItem className="roundMenuItem" onClick={toggleArchiveBlock}>
              <ListItemIcon>
                {
                  archived === true
                  ? <UnarchiveIcon />
                  : <ArchiveIcon />
                }
              </ListItemIcon>
              {
                archived === true
                ? <Localized id="block_menu_unarchive" />
                : <Localized id="block_menu_archive" />
              }
            </MenuItem>

            {
              typeof _id === 'string' && _id !== ''
                ? <div>
                    {
                      typeof setType === 'function'
                      // || addRowBefore
                      // || addRowAfter
                      || (typeof active === 'boolean' && toggle_active)
                      || onRemoveRow
                      || typeof createBlock === 'function'
                        ? <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px' }} />
                        : null
                    }

                    <MenuItem className="roundMenuItem" style={{marginTop:'8px'}} onClick={viewBlock}>
                      <ListItemIcon>
                        <ViewIcon />
                      </ListItemIcon>
                      <Localized id="view_block" />
                    </MenuItem>
                    <MenuItem className="roundMenuItem" onClick={editBlock}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <Localized id="edit_block" />
                    </MenuItem>
                  </div>
                : null
            }

            <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px'}} />

            <MenuItem className="roundMenuItem" onClick={closePopover}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <Localized id="block_menu_close_menu" />
            </MenuItem>

            <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px'}} />

            {/*
            <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
              <ListItemText
                primary={<Localized id="block_menu_info_created" />}
                secondary={(metadata.created || '').replace(/[TZ]/g, ' ')}
              />
            </ListItem>
            */}
            <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
              <ListItemText
                primary={<Localized id="block_menu_info_modified" />}
                secondary={(metadata.modified || '').replace(/[TZ]/g, ' ')}
              />
            </ListItem>

          </MenuList>
        </Paper>
    )}
  </Popover>
  </>
}

export default withLocalization(BlockMenu)
