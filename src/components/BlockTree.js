import { useEffect, useState, useCallback } from 'react'
import classes from './BlockTree.module.css'

import {
  Collapse,
} from '@mui/material'

import {
  MoreHorizSharp as BlockMenuIcon,
  ArrowDropDownSharp as ExpandLessIcon,
  ArrowRightSharp as ExpandMoreIcon,
} from '@mui/icons-material'

import { useQuery } from '@apollo/client'
import { getBlocks_Query } from '../graphql/queries'
import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'

const checkIfArrayHasContent = level => !!level && Array.isArray(level) && level.length > 0

function BlockRows ({
  levels,
  level,
  createBlock,
  onClick,
  blockMenu,
  filterBlockIds,
}) {
  if (!checkIfArrayHasContent(level)) {
    return null
  }

  return level
    .filter(block => (!filterBlockIds || filterBlockIds.length === 0) ? true : !filterBlockIds.includes(block._id))
    .map(block => <BlockRow
      key={block._id}
      block={block}
      levels={levels}
      createBlock={createBlock}
      onClick={onClick}
      blockMenu={blockMenu}
      filterBlockIds={filterBlockIds}
    />)
}

function BlockRow ({
  block,
  levels,
  createBlock,
  onClick,
  blockMenu,
  filterBlockIds,
}) {
  // const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleExpandToggle = useCallback(() => {
    setOpen(oldOpen => !oldOpen)
  }, [setOpen])

  const actions = {
    click: () => {
      onClick(block)
      // navigate(`/view/${block._id}`)
    }
  }

  const rowContent = <>
    <ViewerAuto
      size="line"
      block={block}
      actions={actions}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
    />

    {
      blockMenu === true
      ? <div className={classes.blockRowActions}>
          <BlockMenu
            {...{
              block,
              createBlock,
              // setType: saveType,
            }}
            trigger={props => (
              <button
                {...props}
                className="text hasIcon"
                style={{
                  margin: '0 0 0 var(--basis_x2)',
                  padding: 'var(--basis) 0',
                  flexShrink: '0',
                }}
              >
                <BlockMenuIcon className="icon" />
              </button>
            )}
          />
        </div>
      : null
    }
  </>

  const nextLevel = levels[block._id]
  if (checkIfArrayHasContent(nextLevel)) {
    return <>
      <div style={{
        display: 'flex',
        minHeight: 'calc(6 * var(--basis))',
      }}>
        <button
          className="text hasIcon"
          style={{
            background: 'transparent',
            margin: '0 calc(-0.8 * var(--basis)) 0 calc(-7 * var(--basis))',
            padding: '0',
            flexShrink: '0',
          }}
          onClick={handleExpandToggle}
        >
          {open ? <ExpandLessIcon className="icon" /> : <ExpandMoreIcon className="icon" />}
        </button>

        <div
          key={block._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          }}
          className={classes.blockRow}
        >
          {rowContent}
        </div>
      </div>
      <div style={{
        marginLeft: 'calc(6 * var(--basis))',
      }}>
        <Collapse in={open} timeout="auto">
          <BlockRows
            levels={levels}
            level={nextLevel}
            createBlock={createBlock}
            onClick={onClick}
            blockMenu={blockMenu}
            filterBlockIds={filterBlockIds}
          />
        </Collapse>
      </div>
    </>
  } else {
    return <div
      key={block._id}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 'calc(-2.5 * var(--basis))',
        minHeight: 'calc(6 * var(--basis))',
      }}
      className={classes.blockRow}
    >
      {rowContent}
    </div>
  }
}

export default function BlockTree ({
  createBlock = ()=>{},
  onClick = ()=>{},
  blockMenu = false,
  onGetRefetch = ()=>{},
  types = ['page', 'person', 'action'],
  filterBlockIds = [],
}) {
  const { data, refetch } = useQuery(getBlocks_Query, {
    variables: {
      types,
     },
  })

  useEffect(() => {
    refetch()
  }, [ types, refetch ])

  useEffect(() => {
    onGetRefetch(refetch)
  }, [ onGetRefetch, refetch ])

  const blocks = data?.blocks || []

  const levels = blocks.reduce((acc, block) => {
    // compute parent based on content
    const parentId = blocks.find(possibleParentBlock => possibleParentBlock.content.some(cc => cc.blockId === block._id))?._id || '_root'

    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(block)
    return acc
  }, {})
  // get levelKeys and sort by string values
  const levelKeys = Object.keys(levels).sort((a, b) => a.localeCompare(b))

  return <div style={{
    marginLeft: 'calc(5 * var(--basis))',
  }}>
     {
      blocks.length > 0
        ? <BlockRows
            levels={levels}
            level={levels[levelKeys[0]]}
            createBlock={createBlock}
            onClick={onClick}
            blockMenu={blockMenu}
            filterBlockIds={filterBlockIds}
          />
        : null
      }
  </div>
}
