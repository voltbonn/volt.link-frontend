import { useCallback, useState } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  ListItem,
} from '@mui/material'

import {
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,

  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  // Delete as DeleteIcon,
  // VerticalAlignTop as VerticalAlignTopIcon,
  // VerticalAlignBottom as VerticalAlignBottomIcon,
  Add as AddIcon,
  RepeatSharp as RepeatIcon,
  // RemoveCircleSharp as RemoveCircleIcon,

  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  // PersonSharp as PersonIcon,
  Crop75Sharp as ButtonIcon,
  NotesSharp as TextIcon,
  ImageSharp as ImageIcon,
  // CodeSharp as CodeIcon,
  Remove as DividerIcon,
  // CheckBox as CheckboxIcon,

  PreviewSharp as ViewIcon,
  EditSharp as EditIcon,

  FormatSizeSharp as TextStyleIcon,
  TextFormatSharp as TextDecorationsIcon,
  PaletteSharp as ColorIcon,
  CircleSharp as ColorSwatchIcon,

  CheckSharp as SelectedIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import useArchiveBlock from '../../hooks/useArchiveBlock.js'
import useUser from '../../hooks/useUser.js'

import PopoverMenu from '../PopoverMenu.js'
import SubMenu from '../SubMenu.js'
import { AddMenuContent } from './AddMenu.js'

import { saveBlock_Mutation, moveBlock_Mutation } from '../../graphql/mutations.js'
import useMutation from '../../hooks/useMutation.js'

const typeIcons = {
  button: <ButtonIcon />,
  text: <TextIcon />,
  image: <ImageIcon />,
  // checkbox: <CheckboxIcon />,
  // code: <CodeIcon />,
  divider: <DividerIcon />,
  page: <PageIcon />,
  redirect: <RedirectIcon />,
}

const defaultTypeOptions = [
  'button',
  'text',
  'image',
  // 'checkbox',
  // 'code',
  'divider',
  'page',
  'redirect',
]

const colorOptions = {
  default: 'var(--on-background)',
  yellow: 'var(--yellow)',
  green: 'var(--green)',
  red: 'var(--red)',
  blue: 'var(--blue)',
}
const colorOptionsKeys = Object.keys(colorOptions)
function getColor (color) {
  if (colorOptions.hasOwnProperty(color)) {
    return colorOptions[color]
  } else {
    const {
      color: renderedColor
    } = getBlockColor({
      properties: {
        color,
      },
    })

    if (renderedColor) {
      return renderedColor
    }
  }
  
  return color
}

function BlockMenu ({
  block = {},
  getString,

  trigger,
  onToogle,

  saveType,
  saveProperty,
  typeOptions = defaultTypeOptions,

  onRemoveRow = null,
  addRowBefore = null,
  // addRowAfter = null,
  onArchivedToggle = null,
  onReloadContext = null,
}) {
  const { loggedIn, userroles } = useUser()

  if (
    !(
      block.hasOwnProperty('properties')
      && typeof block.properties === 'object'
      && block.properties !== null
      && !Array.isArray(block.properties)
    )
  ) {
    block.properties = {}
  }

  const { _id = '', type = '', properties = {}, computed = {} } = block
  let {
    active = true,
    text_style = null,
    text_decorations = [],
    color = null,
  } = properties

  if (!Array.isArray(text_decorations)) {
    text_decorations = []
  }

  const {
    roles = [],
  } = (computed === null ? {} : computed)
  const canEdit = loggedIn && (userroles.includes('admin') || roles.includes('owner') || roles.includes('editor'))

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

  const [openSubmenu, setOpenSubmenu] = useState(null)
  const toggleSubmenu = useCallback((newSubmenuName) => {
    setOpenSubmenu(oldSubmenuName => {
      if (oldSubmenuName === newSubmenuName) {
        return null
      }
      return newSubmenuName
    })
  }, [])

  const mutationFunction = useMutation()
  const navigate = useNavigate()
  const createChildBlock = useCallback(async ({ type }) => {
    try {
      if (typeof type === 'string' && type.length > 0) {
        const { saveBlock: newChildBlockId } = await mutationFunction({
          mutation: saveBlock_Mutation,
          variables: {
            block: { type },
          },
        })

        if (newChildBlockId !== null) {
          await mutationFunction({
            mutation: moveBlock_Mutation,
            variables: {
              movingBlockId: newChildBlockId,
              newParentId: _id,
              newIndex: 0,
            },
          })
          if (typeof onReloadContext === 'function') {
            onReloadContext()
          }
          navigate(`/${newChildBlockId}/edit`)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [mutationFunction, _id, onReloadContext, navigate])

  const toggleArchiveBlock = useCallback(() => {
    const newArchived = !archived
    archiveBlock({ _id: block._id, archive: newArchived })
      .then(() => {
        setArchived(newArchived)
        if (typeof onArchivedToggle === 'function') {
          onArchivedToggle(newArchived)
        }
        if (typeof onReloadContext === 'function') {
          onReloadContext()
        }
      })
      .catch(console.error)
  }, [archiveBlock, setArchived, archived, block, onArchivedToggle, onReloadContext])

  const toggleActive = useCallback(() => {
    if (typeof saveProperty === 'function') {
      saveProperty('active', !active)
    }
  }, [active, saveProperty])

  const metadata = block.metadata || {}

  let {
    color: renderedColor
  } = getBlockColor(block)

  if (!renderedColor) {
    renderedColor = 'transparent'
  }

  const toggleTextDecoration = useCallback(thisDecoration => {
    let newTextDecorations = [...new Set(text_decorations)]

    if (text_decorations.includes(thisDecoration)) {
      newTextDecorations = newTextDecorations.filter(decoration => decoration !== thisDecoration)
    } else {
      newTextDecorations.push(thisDecoration)
    }

    saveProperty('text_decorations', newTextDecorations)
  }, [text_decorations, saveProperty])

  return <PopoverMenu
    trigger={trigger}
    onToogle={onToogle}
  >
    {({ open }) => (<div>

      <div style={{ height: '8px' }}></div>

      {
        (
          canEdit
          && typeof saveType === 'function'
          && Array.isArray(typeOptions)
          && typeOptions.length > 0
        )
        && <>
          <SubMenu
            disabled={type === 'person'}
            name="type"
            open={openSubmenu === 'type'}
            onToggle={({ name }) => toggleSubmenu(name)}
            label={<>
              <ListItemIcon>
                <RepeatIcon />
              </ListItemIcon>
              <Localized id="block_menu_choose_type_label" />
            </>}
          >
            {
              typeOptions
              .map(typeName => (
                <MenuItem
                  key={typeName}
                  selected={typeName === type}
                  onClick={() => saveType(typeName)}
                  className="roundMenuItem"
                >
                  <ListItemIcon>
                    {typeIcons[typeName]}
                  </ListItemIcon>
                  {getString(`block_menu_type_label_${typeName}`, typeName)}
                </MenuItem>
              ))
            }
          </SubMenu>
          <Divider style={{ opacity: 0.2, marginTop: '8px', marginBottom: '8px' }} />
        </>
      }

      {
        (
          canEdit
          && typeof saveProperty === 'function'
        )
        && <SubMenu
            name="color"
            open={openSubmenu === 'color'}
            onToggle={({ name }) => toggleSubmenu(name)}
            label={<>
              <ListItemIcon>
                <ColorIcon
                  style={{
                    color: getColor(color),
                  }}
                />
              </ListItemIcon>
              <Localized id="block_menu_choose_color_label" />
            </>}
          >
          {
            colorOptionsKeys
            .map(thisColor => (
              <MenuItem
                key={thisColor}
                selected={thisColor === 'default' ? color === null : color === thisColor}
                onClick={() => saveProperty('color', thisColor === 'default' ? null : thisColor)}
                className="roundMenuItem"
              >
                <ListItemIcon>
                  <ColorSwatchIcon
                    style={{
                      color: getColor(thisColor),
                    }}
                  />
                </ListItemIcon>
                {thisColor}
              </MenuItem>
            ))
          }

          <MenuItem
            className="roundMenuItem"
            selected={color !== null && !colorOptionsKeys.includes(color)}
          >
            <ListItemIcon>
              <ColorSwatchIcon
                style={{
                  color: renderedColor,
                }}
              />
            </ListItemIcon>
            <input
              key={colorOptionsKeys.includes(color) ? color : 'custom'}
              type="text"
              placeholder="#FFFFFF"
              defaultValue={color}
              onBlur={e => saveProperty('color', e.target.value)}
              style={{
                width: '160px',
                margin: '0 calc(-1 * var(--basis)) 0 0',
              }}
            />
          </MenuItem>
        </SubMenu>
      }

      {
        (
          canEdit
          && typeof saveProperty === 'function'
          && type === 'text'
        )
        && <SubMenu
          name="text_style"
          open={openSubmenu === 'text_style'}
          onToggle={({ name }) => toggleSubmenu(name)}
          label={<>
            <ListItemIcon>
              <TextStyleIcon />
            </ListItemIcon>
            <Localized id="block_menu_choose_text_style_label" />
          </>}
        >
          {
            [
              // 'h1', // title
              'h2', // heading
              'h3', // subheading
              'body', // body text. This is saved as null.
              // 'caption',
            ]
            .map(thisStyle => (
              <MenuItem
                key={thisStyle}
                selected={thisStyle === 'body' ? text_style === null : text_style === thisStyle}
                onClick={() => saveProperty('text_style', thisStyle === 'body' ? null : thisStyle)}
                className="roundMenuItem"
              >
                {getString(`block_menu_text_style_label_${thisStyle}`, thisStyle)}
              </MenuItem>
            ))
          }
        </SubMenu>
      }

      {
        (
          canEdit
          && typeof saveProperty === 'function'
          && type === 'text'
        )
        && <SubMenu
            name="text_decorations"
            open={openSubmenu === 'text_decorations'}
            onToggle={({ name }) => toggleSubmenu(name)}
            label={<>
              <ListItemIcon>
                <TextDecorationsIcon />
              </ListItemIcon>
              <Localized id="block_menu_choose_text_decorations_label" />
            </>}
        >
          {
            [
              'checkbox',
            ]
              .map(thisDecoration => {
                const selected = text_decorations.includes(thisDecoration)
                return <MenuItem
                  key={thisDecoration}
                  selected={selected}
                  onClick={() => toggleTextDecoration(thisDecoration)}
                  className="roundMenuItem"
                >
                  <ListItemIcon>
                    {
                      selected
                        ? <SelectedIcon />
                        : <SelectedIcon style={{ opacity: 0 }} />
                    }
                  </ListItemIcon>
                  {getString(`block_menu_text_decoration_label_${thisDecoration}`, thisDecoration)}
                </MenuItem>
              })
          }
        </SubMenu>
      }

      {
        (
          canEdit
          && typeof saveProperty === 'function'
        )
        && <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px'}} />
      }

      {/*
        addRowBefore
        && <MenuItem onClick={handleAddRowBefore}>
          <ListItemIcon>
            <VerticalAlignTopIcon />
          </ListItemIcon>
          <Localized id="block_menu_add_before" />
        </MenuItem>
      */}

      {/*
        addRowAfter
        && <MenuItem onClick={addRowAfter}>
          <ListItemIcon>
            <VerticalAlignBottomIcon />
          </ListItemIcon>
          <Localized id="block_menu_add_after" />
        </MenuItem>
      */}

      {
        false
        && canEdit
        && <SubMenu
          name="create_child_block"
          open={openSubmenu === 'create_child_block'}
          onToggle={({ name }) => toggleSubmenu(name)}
          label={<>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <Localized id="block_menu_create_child_block" />
          </>}
        >
          <AddMenuContent createBlock={createChildBlock} />
        </SubMenu>
      }

      {
        (
          canEdit
          && typeof saveProperty === 'function'
        )
        && <MenuItem className="roundMenuItem" onClick={toggleActive}>
          <ListItemIcon>
            {
              active
              ? <VisibilityOffIcon />
              : <VisibilityIcon />
            }
          </ListItemIcon>

          <ListItemText
            primary={<span>{
              active
              ? <Localized id="block_menu_hide" />
              : <Localized id="block_menu_show" />
            }</span>}
            secondary={<span style={{ whiteSpace: 'normal' }}><Localized id="block_menu_hide_show_description" /></span>}
          />
          
        </MenuItem>
      }

      {
        (
          canEdit
          && typeof onArchivedToggle === 'function'
        )
        && <MenuItem className="roundMenuItem" onClick={toggleArchiveBlock}>
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
      }
            
      {
        (typeof saveProperty === 'function' || typeof onArchivedToggle === 'function')
        && <Divider style={{ opacity: 0.2, marginTop: '8px', marginBottom: '8px' }} />
      }

      {
        (typeof _id === 'string' && _id !== '')
        && <>
          <MenuItem component={Link} to={`/${_id}/view`} className="roundMenuItem" style={{ marginTop: '8px' }}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <Localized id="view_block" />
          </MenuItem>

          {
            canEdit
            && <MenuItem component={Link} to={`/${_id}/edit`} className="roundMenuItem">
              <ListItemIcon>
                <ViewIcon />
              </ListItemIcon>
              <Localized id="edit_block" />
            </MenuItem>
          }

          <Divider style={{opacity: 0.2, marginTop:'8px', marginBottom:'8px' }} />
        </>
      }

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
          primary={<span><Localized id="block_menu_info_modified" /></span>}
          secondary={<span>{(metadata.modified || '').replace(/[TZ]/g, ' ')}</span>}
        />
      </ListItem>
      <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
        <ListItemText
          primary={<span><Localized id="block_menu_info_id" /></span>}
          secondary={<span>{_id}</span>}
        />
      </ListItem>

    </div>)}
  </PopoverMenu>
}

export default withLocalization(BlockMenu)
