import { useCallback } from 'react'

import {
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  List,
  ListSubheader,
} from '@mui/material'

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  VerticalAlignTop as VerticalAlignTopIcon,
  VerticalAlignBottom as VerticalAlignBottomIcon,

  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  Crop75Sharp as ButtonIcon,
  TitleSharp as HeadlineIcon,
  NotesSharp as TextIcon,
  Remove as DividerIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import Popover from '../Popover.js'

function BlockMenu ({
  block,
  getString,

  trigger,

  setType,

  toggle_active = null,
  active = null,
  onRemoveRow = null,
  addRowBefore = null,
  addRowAfter = null,
}) {
  let prefersDarkMode = false
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    prefersDarkMode = true
  }

  const { type = '' } = block
  const handleAddRowBefore = useCallback(() => {

    // const newBlock = {
    //   type,
    // }

    const newBlockId = ''

    addRowBefore({
      blockId: newBlockId,
    })
  }, [ addRowBefore ])

  return <>
  <Popover
    trigger={trigger}
  >
    {({closePopover, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 380,
            height: 325,
            maxHeight: 'calc(100vh - 32px)',
            overflow: 'auto',
          }}
          elevation={8}
        >
          <MenuList
            autoFocus={true}
            style={{
              width: '100%',
              maxWidth: '100%',
              marginTop: '-8px',
            }}
          >
            <List
              style={{
                width: '100%',
                maxWidth: '100%',
                marginTop: '-8px',
              }}
            >
              <ListSubheader
                style={{
                  whiteSpace: 'nowrap',
                  lineHeight: '1',
                  margin: '-4px 0 0 0',
                  padding: '12px 16px 12px',
                  backgroundColor: prefersDarkMode ? '#2e2e2e' : '#fff',
                }}
              >
                <Localized id="block_menu_choose_type_label" />
              </ListSubheader>

              <div style={{height: '4px'}}></div>

              {
                [
                  { value: 'page', icon: <PageIcon />, label: getString('block_menu_type_label_page') },
                  { value: 'redirect', icon: <RedirectIcon />, label: getString('block_menu_type_label_redirect') },
                  { value: 'person', icon: <PersonIcon />, label: getString('block_menu_type_label_person') },
                  { value: 'button', icon: <ButtonIcon />, label: getString('block_menu_type_label_button') },
                  { value: 'headline', icon: <HeadlineIcon />, label: getString('block_menu_type_label_headline') },
                  // { value: 'headline3', label: getString('block_menu_type_label_headline3') },
                  { value: 'text', icon: <TextIcon />, label: getString('block_menu_type_label_text') },
                  { value: 'divider', icon: <DividerIcon />, label: getString('block_menu_type_label_divider') },
                ]
                .map((option, index) => (
                  <MenuItem
                    key={option.value}
                    selected={option.value === type}
                    onClick={() => setType(option.value)}
                  >
                    <ListItemIcon>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText>
                      {option.label}
                    </ListItemText>
                  </MenuItem>
              ))}
            </List>

            {
              (
                addRowBefore
                || addRowAfter
                || (typeof active === 'boolean' && toggle_active)
                || onRemoveRow
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
                    <ListItemText>
                      <Localized id="block_menu_add_before" />
                    </ListItemText>
                  </MenuItem>
                : null
            }

            {
              addRowAfter
                ? <MenuItem style={{marginTop:'8px'}} onClick={addRowAfter}>
                    <ListItemIcon>
                      <VerticalAlignBottomIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Localized id="block_menu_add_after" />
                    </ListItemText>
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
                    <ListItemText>
                      {
                        active
                        ? <Localized id="block_menu_hide" />
                        : <Localized id="block_menu_show" />
                      }
                    </ListItemText>
                  </MenuItem>
                : null
            }

            {
              onRemoveRow
                ? <MenuItem style={{marginTop:'8px'}} onClick={onRemoveRow}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Localized id="block_menu_delete" />
                    </ListItemText>
                  </MenuItem>
                : null
            }

            <Divider style={{opacity: 0.2}} />

            <MenuItem style={{marginTop:'8px'}} onClick={closePopover}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText>
                <Localized id="block_menu_close_menu" />
              </ListItemText>
            </MenuItem>

          </MenuList>
        </Paper>
    )}
  </Popover>
  </>
}

export default withLocalization(BlockMenu)
