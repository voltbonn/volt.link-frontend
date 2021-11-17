import { useCallback } from 'react'

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
} from '@mui/material'

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  // Delete as DeleteIcon,
  Close as CloseIcon,
  VerticalAlignTop as VerticalAlignTopIcon,
  VerticalAlignBottom as VerticalAlignBottomIcon,
  Add as AddIcon,
  RepeatSharp as RepeatIcon,
  AccountTreeSharp as BlockTreeIcon,
  RemoveCircleSharp as RemoveCircleIcon,

  InsertDriveFileSharp as PageIcon,
  // LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  Crop75Sharp as ButtonIcon,
  TitleSharp as HeadlineIcon,
  NotesSharp as TextIcon,
  Remove as DividerIcon,
  CheckBox as CheckboxIcon,
  AutoAwesomeSharp as ActionIcon,

  PreviewSharp as ViewIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import useSaveBlock from '../../hooks/useSaveBlock.js'
import Popover from '../Popover.js'
import SubMenu from '../SubMenu.js'
import BlockTree from '../BlockTree.js'
import { AddMenuContent } from './AddMenu.js'

function BlockMenu ({
  block,
  getString,

  trigger,

  setType,
  createBlock,

  toggle_active = null,
  active = null,
  onRemoveRow = null,
  addRowBefore = null,
  addRowAfter = null,
}) {
  const navigate = useNavigate()

  const { _id = '', type = '' } = block

  const handleAddRowBefore = useCallback(() => {

    // const newBlock = {
    //   type,
    // }

    const newBlockId = ''

    addRowBefore({
      blockId: newBlockId,
    })
  }, [ addRowBefore ])

  const viewBlock = useCallback(() => {
    navigate(`/view/${_id}`)
  }, [ _id, navigate ])

  const editBlock = useCallback(() => {
    navigate(`/edit/${_id}`)
  }, [ _id, navigate ])

  const createChildBlock = useCallback(newBlock => {
    createBlock({
      ...newBlock,
      parent: _id,
    })
  }, [ createBlock, _id ])

  const saveBlock = useSaveBlock()
  const setParent = useCallback(newParentId => {
    saveBlock({
      ...block,
      parent: newParentId,
    })
  }, [ saveBlock, block ])

  return <>
  <Popover
    trigger={trigger}
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
                      margin: '-8px 0 0 0',
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
                      { value: 'divider', icon: <DividerIcon />, label: getString('block_menu_type_label_divider') },
                      { value: 'checkbox', icon: <CheckboxIcon />, label: getString('block_menu_type_label_checkbox') },
                      { value: 'action', icon: <ActionIcon />, label: getString('block_menu_type_label_action') },
                    ]
                    .map(option => (
                      <MenuItem
                        key={option.value}
                        selected={option.value === type}
                        onClick={() => setType(option.value)}
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

            {
              (
                typeof setType === 'function'
                && (
                  addRowBefore
                  || addRowAfter
                  || (typeof active === 'boolean' && toggle_active)
                  || onRemoveRow
                  || typeof createBlock === 'function'
                )
              )
                ? <Divider style={{opacity: 0.2}} />
                : null
            }

            {
              addRowBefore
                ? <MenuItem style={{marginTop:'8px'}} onClick={handleAddRowBefore}>
                    <ListItemIcon>
                      <VerticalAlignTopIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_add_before" />
                  </MenuItem>
                : null
            }

            {
              addRowAfter
                ? <MenuItem style={{marginTop:'8px'}} onClick={addRowAfter}>
                    <ListItemIcon>
                      <VerticalAlignBottomIcon />
                    </ListItemIcon>
                    <Localized id="block_menu_add_after" />
                  </MenuItem>
                : null
            }

            {
              typeof active === 'boolean' && toggle_active
                ? <MenuItem style={{marginTop:'8px'}} onClick={toggle_active}>
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

            <SubMenu
              parentMenuIsOpen={open}
              label={<>
                <ListItemIcon>
                  <BlockTreeIcon />
                </ListItemIcon>
                <Localized id="block_menu_change_parent" />
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
                  margin: '-8px 0 0 0',
                  padding: '12px 16px 12px',
                  backgroundColor: 'var(--background-contrast)',
                  color: 'var(--on-background)',
                }}
              >
                <Localized id="block_menu_change_parent" />
              </ListSubheader>

              <div style={{height: '8px'}}></div>

              <MenuItem
                onClick={thisBlock => setParent(null)}
              >
                <ListItemIcon>
                  <RemoveCircleIcon />
                </ListItemIcon>
                <Localized id="block_menu_change_parent_none" />
              </MenuItem>

              <Divider style={{opacity: 0.2}} />

              <div style={{ padding: '0 var(--basis_x2)', marginBottom: '8px' }}>
                <BlockTree
                  onClick={thisBlock => setParent(thisBlock._id)}
                  blockMenu={false}
                  types={['page', 'person']}
                />
              </div>
            </SubMenu>

            {
              typeof _id === 'string' && _id !== ''
                ? <div style={{ marginTop:'8px', marginBottom:'8px' }}>
                    {
                      typeof setType === 'function'
                      || addRowBefore
                      || addRowAfter
                      || (typeof active === 'boolean' && toggle_active)
                      || onRemoveRow
                      || typeof createBlock === 'function'
                        ? <Divider style={{opacity: 0.2}} />
                        : null
                    }

                    <MenuItem style={{marginTop:'8px'}} onClick={viewBlock}>
                      <ListItemIcon>
                        <ViewIcon />
                      </ListItemIcon>
                      <Localized id="view_block" />
                    </MenuItem>
                    <MenuItem onClick={editBlock}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <Localized id="edit_block" />
                    </MenuItem>
                  </div>
                : null
            }

            <Divider style={{opacity: 0.2}} />

            <MenuItem style={{marginTop:'8px'}} onClick={closePopover}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <Localized id="block_menu_close_menu" />
            </MenuItem>

          </MenuList>
        </Paper>
    )}
  </Popover>
  </>
}

export default withLocalization(BlockMenu)
