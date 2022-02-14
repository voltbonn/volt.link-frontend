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
  // Add as AddIcon,
  RepeatSharp as RepeatIcon,
  // AccountTreeSharp as BlockTreeIcon,
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

import {
  // moveBlock_Mutation,
  saveBlock_Mutation,
} from '../../graphql/mutations.js'
import useMutation from '../../hooks/useMutation.js'

import Popover from '../Popover.js'
import SubMenu from '../SubMenu.js'
// import BlockTree from '../BlockTree.js'
// import { AddMenuContent } from './AddMenu.js'

function removeProperty(obj, prop) {
  // remove property from objects, arrays and sub-objects

  obj = JSON.parse(JSON.stringify(obj)) // clone object to make everything mutable

  if (obj.hasOwnProperty(prop)) {
    delete obj[prop]
  }
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj[i] == 'object' && obj[i] !== null) {
        removeProperty(obj[i], prop)
      }
    }
  }

  return obj
}

function BlockMenu ({
  block = {},
  getString,

  trigger,

  setType,
  createBlock,

  toggle_active = null,
  active = null,
  onRemoveRow = null,
  addRowBefore = null,
  // addRowAfter = null,
}) {
  const navigate = useNavigate()

  const { _id = '', type = '' } = block
  const [archived, setArchived] = useState(block.properties.archived === true)

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

  // const createChildBlock = useCallback(newBlock => {
  //   createBlock({
  //     ...newBlock,
  //     parent: _id,
  //   })
  // }, [ createBlock, _id ])

  const mutationFunction = useMutation()

  // const setParent = useCallback(newParentId => {
  //   mutationFunction({
  //     mutation: moveBlock_Mutation,
  //     variables: {
  //       movingBlockId: block._id,
  //       newParentId: newParentId,
  //       newIndex: 0,
  //     },
  //   })
  //   .then(() => {
  //     console.log('moved block')
  //   })
  //   .catch(console.error)
  // }, [ mutationFunction, block ])

  const toggleArchiveBlock = useCallback(() => {
    const newArchivedValue = archived === true ? false : true

    const blockWithoutTypename = removeProperty(block, '__typename')
  
    mutationFunction({
      mutation: saveBlock_Mutation,
      variables: {
        block: {
          ...blockWithoutTypename,
          properties: {
            ...blockWithoutTypename.properties,
            archived: newArchivedValue,
          },
        },
      },
    })
    .then(() => {
      setArchived(newArchivedValue)
    })
    .catch(console.error)
  }, [ mutationFunction, block, archived, setArchived ])

  const metadata = block.metadata || {}

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

            {/*
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
            */}

            {/*
            <SubMenu
              parentMenuIsOpen={open}
              label={<>
                <ListItemIcon>
                  <BlockTreeIcon />
                </ListItemIcon>
                <Localized id="block_menu_move_block" />
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
                <Localized id="block_menu_move_block" />
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
                  filterBlockIds={[_id]}
                />
              </div>
            </SubMenu>
            */}

            {
              typeof active === 'boolean' && toggle_active
                ? <MenuItem onClick={toggle_active}>
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

            <MenuItem onClick={toggleArchiveBlock}>
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

            <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px'}} />

            <MenuItem onClick={closePopover}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <Localized id="block_menu_close_menu" />
            </MenuItem>

            <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px'}} />

            <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
              <ListItemText
                primary={<Localized id="block_menu_info_created" />}
                secondary={(metadata.created || '').replace(/[TZ]/g, ' ')}
              />
            </ListItem>
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
