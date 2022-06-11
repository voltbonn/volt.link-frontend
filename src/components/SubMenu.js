import { useCallback } from 'react'

import {
  MenuItem,
  ListSubheader,
  Paper,
} from '@mui/material'

import {
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material'

// INFO: Some code is copied from: https://github.com/azmenak/material-ui-nested-menu-item/blob/master/src/index.tsx

export default function SubMenu ({
  name = '',
  disabled = false,
  label = '',
  triggerProps = {},
  onToggle = null,
  open = false,
  children,
}) {
  const toggleSubmenu = useCallback(() => {
    if (disabled !== true && typeof onToggle === 'function') {
      onToggle({ name })
    }
  }, [disabled, onToggle, name])

  let paperStyle = {}
  if (open === true) {
    paperStyle = {
      margin: 'var(--basis)',
      boxShadow: '0 var(--basis_x0_5) var(--basis_x4) 0 rgba(var(--on-background-rgb), 0.4)',
      padding: '8px 0',
      background: 'var(--background-contrast)',
    }
  } else {
    paperStyle = {
      margin: '0',
      boxShadow: 'none',
      background: 'transparent',
    }
  }

  return <Paper
    sx={{
      color: 'var(--on-background)',
      overflow: 'hidden',
      transition: 'padding 0.1s ease-in-out, margin 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
      borderRadius: 'var(--basis_x2)',
      ...paperStyle,
    }}
  >
    {
      label !== null
        ? <>
          <ListSubheader
            onClick={toggleSubmenu}
            style={{
              whiteSpace: 'nowrap',
              lineHeight: '1',
              margin: '0',
              padding: '0',
              backgroundColor: 'transparent',
              color: 'var(--on-background)',
            }}
          >
            <MenuItem
              {...triggerProps}
              disabled={disabled}
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

              <ArrowRightIcon style={{
                marginRight: '-10px',
                transition: 'transform 0.1s ease-in-out',
                transform: open === true ? 'rotate(90deg)' : '',
              }} />
            
            </MenuItem>
          </ListSubheader>
          {open === true ? <div style={{ height: '12px' }}></div> : null}
        </>
        : null
    }

    {open === true ? children : null}
  </Paper>
}
