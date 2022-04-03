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
import { getBlocks_Query, getParentBlocks_Query } from '../graphql/queries'

export default function Header({ title, block = {}, rightActions, notificationBanner }) {
  const { open, toggleSidebar } = useSidebarContext()
  const apollo_client = useApolloClient()

  const blockId = block ? block._id : null
  const parentId = block ? block.parent : null

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
        if (typeof data.error === 'string' || !data.blocks) {
          console.error(data.error)
          setParentBlocks([])
        }else{
          setParentBlocks(data.blocks || [])
        }
      })
      .catch(async error => {
        console.error('error', error)
        setParentBlocks([])
      })
  }, [apollo_client, setParentBlocks])

  const loadSiblingBlocks = useCallback((parentId, blockId) => {
    apollo_client.query({
      query: getBlocks_Query,
      variables: {
        roots: [parentId || blockId],
        types: ['page', 'person', 'redirect'],
        archived: false,
      },
    })
      .then(async ({ data }) => {
        if (typeof data.error === 'string' || !data.blocks) {
          console.error(data.error)
          setSiblingBlocks([])
        }else{
          setSiblingBlocks(
            (data.blocks || [])
              .filter(block => block._id !== blockId)
          )
        }
      })
      .catch(async error => {
        console.error('error', error)
        setSiblingBlocks([])
      })
  }, [apollo_client, setSiblingBlocks])

  useEffect(() => {
    if (blockId) {
      loadParentBlocks(blockId)
      loadSiblingBlocks(parentId, blockId)
    }
  }, [blockId, parentId, loadParentBlocks, loadSiblingBlocks])

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
            <div style={{
              padding: 'var(--basis_x2)',
            }}>
              {
                parentBlocks
                .map((block) => {
                  return <ViewerAuto
                    key={block._id}
                    block={block}
                    size="line"
                  />
                })
              }
            </div>
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
            <div style={{
              padding: 'var(--basis_x2)',
            }}>
              {
                siblingBlocks
                .map((block) => {
                  return <ViewerAuto
                    key={block._id}
                    block={block}
                    size="line"
                  />
                })
              }
            </div>
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
