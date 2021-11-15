import classes from './Header.module.css'

import {
  Menu as MenuIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material'

import HeaderMenu from './HeaderMenu.js'
import { useSidebarContext } from './Sidebar.js'

export default function Header({ title, block = {}, rightActions, notificationBanner }) {
  const { open, toggleSidebar } = useSidebarContext()

  const blockId = block ? block._id : null

  const leftActions = <>
    {
      !open
      ? <button onClick={toggleSidebar} className="text hasIcon" style={{ margin: '0' }}>
          <MenuIcon className="icon" />
        </button>
      : null
    }

    <div style={{ flexGrow: '1' }}>
    {
      blockId
        ? <>
          <HeaderMenu
            trigger={triggerProps => (
              <button {...triggerProps} className="text" style={{ margin: 'calc(-2 * var(--basis))' }}>
                <MoreHorizIcon style={{ verticalAlign: 'middle' }} />
              </button>
            )}
            items={[
              {onClick: () => {}, label: 'Volt NRW'},
              {onClick: () => {}, label: 'Volt Deutschland'},
              {onClick: () => {}, label: 'Volt Europa'},
            ]}
          />
          <span style={{ margin: 'var(--basis_x2)', opacity: 'var(--alpha)' }}>/</span>
        </>
        : null
    }

    {
      true
        ? <>
          <HeaderMenu
            trigger={triggerProps => (
              <button {...triggerProps} className="text" style={{ margin: 'calc(-2 * var(--basis))' }}>
                <span style={{ fontWeight: 'bold' }}>
                  {title}
                </span>
              </button>
            )}
            items={[
              {onClick: () => {}, label: 'Volt Bonn Welcome'},
            ]}
          />
        </>
        : <span style={{ fontWeight: 'bold' }}>
            {title}
          </span>
    }
    </div>

    {/*
      <div>
        <button class="text">Home</button>
        <ChevronRightIcon style={{
          verticalAlign: 'middle',
          height: 'var(--basis_x8)',
          width: 'var(--basis_x8)',
          margin: '0 calc(-2 * var(--basis))',
          opacity: 'var(--alpha-more)',
        }} />
        <button class="text">Title</button>
      </div>
    */}
  </>

  return <header className={classes.header}>
    <div className={classes.headerBar}>
      {leftActions}
      {rightActions}
    </div>
    {
      !!notificationBanner
        ? <div className={classes.notificationBanner}>{notificationBanner}</div>
        : null
    }
  </header>
}
