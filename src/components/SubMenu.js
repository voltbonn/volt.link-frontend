import { useRef, useState, useCallback } from 'react'

import {
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListSubheader,
} from '@mui/material'

import {
  Close as CloseIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material'

import { Localized } from '../fluent/Localized.js'

// INFO: Some code is copied from: https://github.com/azmenak/material-ui-nested-menu-item/blob/master/src/index.tsx

export default function SubMenu ({
  parentMenuIsOpen = true,
  label = '',
  triggerProps = {},
  header = null,
  MenuListProps = {},
  position = 'right',
  onOpen = () => {},
  children,
}) {
  const triggerRef = useRef(null)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const open = isSubMenuOpen && parentMenuIsOpen

  const toggleSubmenu = useCallback(() => {
    const newOpen = !open
    setIsSubMenuOpen(newOpen)
    if (newOpen === true) {
      onOpen()
    }
  }, [ setIsSubMenuOpen, open, onOpen ])

  const closeSubmenu = useCallback(() => {
    setIsSubMenuOpen(false)
  }, [ setIsSubMenuOpen ])

  return <>
    <MenuItem
      {...triggerProps}

      ref={triggerRef}
      onClick={toggleSubmenu}
      className="roundMenuItem"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        ...triggerProps.style,
      }}
    >
      <div style={{ display: 'flex' }}>
        {label}
      </div>
      <ArrowRightIcon style={{ marginRight: '-10px' }} />
    </MenuItem>
    <Menu
      // Set pointer events to 'none' to prevent the invisible Popover div from capturing events for clicks and hovers
      style={{ pointerEvents: 'none' }}
      anchorEl={triggerRef.current}
      anchorOrigin={{
        vertical: 'top',
        horizontal: (position === 'right' ? 'right' : 'left'),
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: (position === 'right' ? 'left' : 'right'),
      }}
      open={open}
      autoFocus={false}
      disableAutoFocus
      disableEnforceFocus
      onClose={closeSubmenu}
      sx={{
        marginTop: '-8px', // align with parent menu
      }}
      MenuListProps={{
        ...MenuListProps,
        sx: {
          maxWidth: 380,
          maxHeight: 'calc(100vh - 32px)',
          overflow: 'auto',
          background: 'var(--background-contrast)',
          color: 'var(--on-background)',
          ...MenuListProps.sx,
        },
      }}
    >
      <div style={{pointerEvents: 'auto'}}>
        {
          header !== null
            ? <ListSubheader
                style={{
                  whiteSpace: 'nowrap',
                  lineHeight: '1',
                  margin: '0',
                  padding: '4px 16px 12px',
                  backgroundColor: 'var(--background-contrast)',
                  color: 'var(--on-background)',
                }}
              >
                {header}
              </ListSubheader>
            : null
        }

        {children}

        <Divider style={{opacity: 0.2}} />

        <MenuItem className="roundMenuItem" style={{marginTop:'8px'}} onClick={closeSubmenu}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <Localized id="block_menu_close_menu" />
        </MenuItem>
      </div>
    </Menu>
  </>
}
