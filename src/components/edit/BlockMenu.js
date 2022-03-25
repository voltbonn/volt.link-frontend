import { useCallback, useState } from 'react'

import {
  Link,
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
  // CodeSharp as CodeIcon,
  Remove as DividerIcon,
  // CheckBox as CheckboxIcon,

  PreviewSharp as ViewIcon,
  EditSharp as EditIcon,

  FormatSizeSharp as TextStyleIcon,
  PaletteSharp as ColorIcon,
  CircleSharp as ColorSwatchIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

import useArchiveBlock from '../../hooks/useArchiveBlock.js'
import useUser from '../../hooks/useUser.js'

import PopoverMenu from '../PopoverMenu.js'
import SubMenu from '../SubMenu.js'
import { AddMenuContent } from './AddMenu.js'

const typeIcons = {
  button: <ButtonIcon />,
  text: <TextIcon />,
  // checkbox: <CheckboxIcon />,
  // code: <CodeIcon />,
  divider: <DividerIcon />,
  page: <PageIcon />,
  redirect: <RedirectIcon />,
}

const defaultTypeOptions = [
  'button',
  'text',
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

  setProperty,
  setType,
  typeOptions = defaultTypeOptions,
  createBlock,

  onRemoveRow = null,
  addRowBefore = null,
  // addRowAfter = null,
  onArchivedToggle = null,

  setOpenBlockMenuRef,
}) {
  const { loggedIn } = useUser()

  const { _id = '', type = '', properties = {}, computed = {} } = block
  const {
    active = true,
    text_style = null,
    color = null,
  } = properties
  const {
    roles = [],
  } = (computed === null ? {} : computed)
  const canEdit = loggedIn && (roles.includes('owner') || roles.includes('editor'))

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
        if (typeof onArchivedToggle === 'function') {
          onArchivedToggle(newArchived)
        }
      })
      .catch(console.error)
  }, [ archiveBlock, setArchived, archived, block, onArchivedToggle ])

  const toggleActive = useCallback(() => {
    if (typeof setProperty === 'function') {
      setProperty('active', !active)
    }
  }, [ active, setProperty ])

  const metadata = block.metadata || {}

  let {
    color: renderedColor
  } = getBlockColor(block)

  if (!renderedColor) {
    renderedColor = 'transparent'
  }

  return <PopoverMenu
    trigger={trigger}
    onToogle={onToogle}
    setOpenBlockMenuRef={setOpenBlockMenuRef}
  >
    {({ open }) => (<div>

      <div style={{ height: '8px' }}></div>

      {
        (
          canEdit
          && typeof setType === 'function'
          && Array.isArray(typeOptions)
          && typeOptions.length > 0
        )
        && <>
          <SubMenu
            disabled={type === 'person'}
            parentMenuIsOpen={open}
            label={<>
              <ListItemIcon>
                <RepeatIcon />
              </ListItemIcon>
              <Localized id="block_menu_choose_type_label" />
            </>}
            header={<Localized id="block_menu_choose_type_label" />}
          >
            {
              typeOptions
              .map(typeName => (
                <MenuItem
                  key={typeName}
                  selected={typeName === type}
                  onClick={() => setType(typeName)}
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
          && typeof setProperty === 'function'
        )
        && <SubMenu
          parentMenuIsOpen={open}
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
          header={<Localized id="block_menu_choose_color_label" />}
        >
          {
            colorOptionsKeys
            .map(thisColor => (
              <MenuItem
                key={thisColor}
                selected={thisColor === 'default' ? color === null : color === thisColor}
                onClick={() => setProperty('color', thisColor === 'default' ? null : thisColor)}
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
              onBlur={e => setProperty('color', e.target.value)}
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
          && typeof setProperty === 'function'
          && type === 'text'
        )
        && <SubMenu
          parentMenuIsOpen={open}
          label={<>
            <ListItemIcon>
              <TextStyleIcon />
            </ListItemIcon>
            <Localized id="block_menu_choose_text_style_label" />
          </>}
          header={<Localized id="block_menu_choose_text_style_label" />}
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
                onClick={() => setProperty('text_style', thisStyle === 'body' ? null : thisStyle)}
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
          && typeof setProperty === 'function'
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
        (
          canEdit
          && typeof createBlock === 'function'
        )
        && <SubMenu
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
      }

      {
        (
          canEdit
          && typeof setProperty === 'function'
        )
        && <MenuItem className="roundMenuItem" onClick={toggleActive}>
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
        canEdit
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
          primary={<Localized id="block_menu_info_modified" />}
          secondary={(metadata.modified || '').replace(/[TZ]/g, ' ')}
        />
      </ListItem>
      <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
        <ListItemText
          primary={<Localized id="block_menu_info_id" />}
          secondary={_id}
        />
      </ListItem>

    </div>)}
  </PopoverMenu>
}

export default withLocalization(BlockMenu)
