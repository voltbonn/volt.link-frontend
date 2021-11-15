// import { useCallback } from 'react'

// import {
//   useHistory,
// } from 'react-router-dom'

import {
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  // List,
  // ListSubheader,
} from '@mui/material'

import {
  Close as CloseIcon,
  // PreviewSharp as ViewIcon,
  // EditSharp as EditIcon,
} from '@mui/icons-material'

import { Localized } from '../fluent/Localized.js'

import Popover from './Popover.js'

function HeaderMenu ({
  block,
  trigger,
  items,
}) {
  // const history = useHistory()

  // const { _id = '' } = block

  // const viewBlock = useCallback(() => {
  //   history.push(`/view/${_id}`)
  // }, [ _id, history ])

  // const editBlock = useCallback(() => {
  //   history.push(`/edit/${_id}`)
  // }, [ _id, history ])

  return <>
  <Popover
    trigger={trigger}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
  >
    {({closePopover, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 380,
            height: 'auto',
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
              marginTop: '-8px',
            }}
          >
            {items.map(item => (
              <MenuItem style={{marginTop:'8px'}} onClick={item.onClick}>
                <ListItemText>
                  {item.label}
                </ListItemText>
              </MenuItem>
            ))}

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

export default HeaderMenu
