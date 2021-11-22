import { useState, useCallback, useEffect } from 'react'

import classes from './Header.module.css'

import {
  Menu as MenuIcon,
  MoreHoriz as MoreHorizIcon,
  Home as HomeIcon,
} from '@mui/icons-material'

import { Link } from 'react-router-dom'

import { useSidebarContext } from './Sidebar.js'
import ViewerAuto from './view/ViewerAuto.js'
import PopoverMenu from './PopoverMenu.js'

import { useApolloClient } from '@apollo/client'
import { getSiblingBlocks_Query, getParentBlocks_Query } from '../graphql/queries'

export default function Header({ title, block = {}, rightActions, notificationBanner }) {
  const { open, toggleSidebar } = useSidebarContext()
  const apollo_client = useApolloClient()

  const blockId = block ? block._id : null

  const [parentBlocks, setParentBlocks] = useState([])
  const [siblingBlocks, setSiblingBlocks] = useState([])

  const loadParentBlocks = useCallback(blockId => {
    apollo_client.query({
      query: getParentBlocks_Query,
      variables: {
        _id: blockId,
      },
    })
      .then(async ({ data }) => {
        if (typeof data.error === 'string' || !data.parentBlocks) {
          console.error(data.error)
          setParentBlocks([])
        }else{
          setParentBlocks(data.parentBlocks || [])
        }
      })
      .catch(async error => {
        console.error('error', error)
        setParentBlocks([])
      })
  }, [apollo_client, setParentBlocks])

  const loadSiblingBlocks = useCallback(blockId => {
    apollo_client.query({
      query: getSiblingBlocks_Query,
      variables: {
        _id: blockId,
      },
    })
      .then(async ({ data }) => {
        if (typeof data.error === 'string' || !data.siblingBlocks) {
          console.error(data.error)
          setSiblingBlocks([])
        }else{
          setSiblingBlocks(data.siblingBlocks || [])
        }
      })
      .catch(async error => {
        console.error('error', error)
        setSiblingBlocks([])
        // setSiblingBlocks([
        //   {onClick: () => {}, label: 'Volt Bonn Welcome'},
        // ])
      })
  }, [apollo_client, setSiblingBlocks])

  // const loadBlocks = useCallback(blockId => {
  //   // setParentBlocks([
  //   //   {onClick: () => {}, label: 'Volt NRW'},
  //   //   {onClick: () => {}, label: 'Volt Deutschland'},
  //   //   {onClick: () => {}, label: 'Volt Europa'},
  //   // ])
  //
  //   loadSiblingBlocks(blockId)
  // }, [loadSiblingBlocks])

  useEffect(() => {
    if (blockId) {
      loadParentBlocks(blockId)
      loadSiblingBlocks(blockId)
    }
  }, [blockId, loadParentBlocks, loadSiblingBlocks])

  const leftActions = <>
    {
      !open
      ? <button onClick={toggleSidebar} className="text hasIcon" style={{ margin: '0' }}>
          <MenuIcon className="icon" />
        </button>
      : null
    }

    <div style={{ flexGrow: '1' }}>
      <Link to="/">
        <button className="text" style={{ margin: 'calc(-2 * var(--basis))' }}>
          <HomeIcon style={{ verticalAlign: 'middle' }} />
        </button>
      </Link>
      <span style={{ margin: 'var(--basis_x2)', opacity: 'var(--alpha)' }}>/</span>

    {
      blockId
      && parentBlocks.length > 0
        ? <>
          <PopoverMenu
            trigger={triggerProps => (
              <button {...triggerProps} className="text" style={{ margin: 'calc(-2 * var(--basis))' }}>
                <MoreHorizIcon style={{ verticalAlign: 'middle' }} />
              </button>
            )}
          >
            {
              parentBlocks
              .map((block) => {
                return <ViewerAuto
                  block={block}
                  size="line"
                  style={{
                    margin: 'var(--basis_x4) var(--basis_x2)',
                  }}
                />
              })
            }
          </PopoverMenu>
          <span style={{ margin: 'var(--basis_x2)', opacity: 'var(--alpha)' }}>/</span>
        </>
        : null
    }

    {
      siblingBlocks.length > 0
        ? <PopoverMenu
            trigger={triggerProps => (
              <button {...triggerProps} className="text" style={{ margin: 'calc(-2 * var(--basis))' }}>
                <span style={{ fontWeight: 'bold' }}>
                  {title}
                </span>
              </button>
            )}
          >
            {
              siblingBlocks
              .map((block) => {
                return <ViewerAuto
                  block={block}
                  size="line"
                  style={{
                    margin: 'var(--basis_x4) var(--basis_x2)',
                  }}
                />
              })
            }
          </PopoverMenu>
        : <span style={{ fontWeight: 'bold' }}>
            {title}
          </span>
    }
    </div>
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
