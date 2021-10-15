import { useState, useRef } from 'react'

import {
  Portal,
  Fade,
  Popper,
} from '@mui/material'

import useOnOutsideClick from '../hooks/useOnOutsideClick.js'

const randomString = () => (Math.random() + 1).toString(36).substring(7)

function Popover ({
  trigger,
  children = () => {},
}) {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const paperRef = useRef(null)
  useOnOutsideClick(paperRef, () => {
    setOpen(false)
  })

  const handlePopoverToggleClick = event => {
    setOpen((prevOpen) => !prevOpen)
  }

  const closePopover = () => {
    setOpen(false)
  }

  const id = open ? 'popover-'+randomString() : undefined

  return <>

    {trigger({
      ref: anchorRef,
      'aria-describedby': id,
      onClick: handlePopoverToggleClick,
    })}

  <Portal>
    <div
      style={{
        display: (open ? 'block' : 'none'),
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1000,
        cursor: 'pointer',
      }}
    />

    <Popper
      id={id}
      open={open}
      anchorEl={anchorRef.current}
      transition
      placement="bottom-start"
      disablePortal={true}
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'viewport',
            padding: 8,
          },
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'viewport',
            padding: 8,
          },
        },
      ]}
      style={{
        zIndex: 1000,
      }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <div>
          {
            !!children && typeof children === 'function'
            ? children({
              ref: paperRef,
              style: {
                transformOrigin: 'top left',
              },
              closePopover,
            })
            : null
          }
          </div>
        </Fade>
      )}
    </Popper>

    </Portal>
  </>
}

export default Popover