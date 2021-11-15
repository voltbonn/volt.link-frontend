import {
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'

import {
  Close as CloseIcon,
} from '@mui/icons-material'

import { Localized } from '../fluent/Localized.js'

import Popover from './Popover.js'

export default function PopoverMenu ({
  trigger,
  children,
}) {
  return <>
  <Popover
    trigger={trigger}
  >
    {({closePopover, ...popoverProps}) => (
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
              marginTop: '-8px',
            }}
          >
            {children}

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
