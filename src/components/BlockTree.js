import React, { useCallback, useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window';

import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'

import classes from './BlockTree.module.css'

import {
  MoreHorizSharp as BlockMenuIcon,
  // ArrowDropDownSharp as ExpandLessIcon,
  // ArrowRightSharp as ExpandMoreIcon,
} from '@mui/icons-material'

import useLoadBlocks from '../hooks/useLoadBlocks.js'

const minItemSize = 40

// const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
// const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

// const getViewportWidth = () => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const getViewportHeight = () => Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

function useViewportHeight() {
  // save current window width in the state object
  let [height, setHeight] = useState(getViewportHeight())

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId = null
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId)
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => {
        setHeight(getViewportHeight())
      }, 150)
    }
    // set resize listener
    window.addEventListener('resize', resizeListener)

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return { height }
}


const BlockRow = ({ createBlock, onClick, index, style, data }) => {

  const actions = {
    click: () => {
      onClick(block)
      // navigate(`/${block._id}/view`)
    }
  }

  const block = data[index]

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

    <div className={classes.blockRowActions}>
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
  </>

  return <div
    key={block._id}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...style,
    }}
    className={classes.blockRow}
  >
    {rowContent}
  </div>
}

function BlockTree({
  createBlock = ()=>{},
  onClick = ()=>{},
  onGetRefetch = ()=>{},
  types = ['page', 'person', 'action'],
  archived = false,
  scrollContainer = window,
}) {
  const outerTreeRef = React.useRef(null)
  const innerTreeRef = React.useRef(null)
  const treeRef = React.useRef(null)
  const [outerHeight, setOuterHeight] = useState(minItemSize)
  const [bottomMargin, setBottomMargin] = useState(0)
  const [blocks, setBlocks] = useState([])
  const prevFetchArguments = React.useRef({})



  const { height: viewportHeight } = useViewportHeight()

  const updateHeight = useCallback(() => {
    if (innerTreeRef.current && outerTreeRef.current) {
      const outerBounds = outerTreeRef.current.getBoundingClientRect()      
      const maxHeight = viewportHeight - outerBounds.top

      const innerBounds = innerTreeRef.current.getBoundingClientRect()
      const fullHeight = innerBounds.height
      if (typeof fullHeight === 'number' && !isNaN(fullHeight) && fullHeight > minItemSize) {
        const newHeight = Math.min(maxHeight, fullHeight)
        setOuterHeight(~~(newHeight))
        setBottomMargin(~~(Math.max(fullHeight - newHeight, 0)))
      }
    }
  }, [ viewportHeight, innerTreeRef, outerTreeRef, setOuterHeight, setBottomMargin ])

  useScrollPosition(updateHeight, [ updateHeight ], null, false, 300, scrollContainer)

  useEffect(() => {
    updateHeight()
  }, [ updateHeight ])

  const loadBlocks = useLoadBlocks()
  const refetchData = useCallback(() => {
    if (
      blocks.length === 0
      || prevFetchArguments.current.archived !== archived
      || prevFetchArguments.current.types !== types
    ) {
      prevFetchArguments.current.types = types
      prevFetchArguments.current.archived = archived
      
      loadBlocks({ types, archived })
        .then(async loadedBlocks => {
          setBlocks(loadedBlocks)
          updateHeight()
        })
        .catch(error => console.error(error))
    }
  }, [ blocks, loadBlocks, types, archived, setBlocks, updateHeight ])

  useEffect(() => {
    refetchData()
  }, [ refetchData ])

  useEffect(() => {
    onGetRefetch(refetchData)
  }, [ onGetRefetch, refetchData ])



  const row = (props) => {
    return <BlockRow
      createBlock={createBlock}
      onClick={onClick}
      {...props}
    />
  }

  return <div style={{ height: outerHeight, marginBottom: bottomMargin }} ref={outerTreeRef}>
    <AutoSizer disableWidth>
      {({height}) => (
        <FixedSizeList
          itemData={blocks}
          itemCount={blocks.length}
          ref={treeRef}
          innerRef={innerTreeRef}
          // onScroll={updateHeight}
          itemSize={minItemSize}
          height={height}
          width="100%"
          style={{
            overflow: 'hidden',
            // 'overflow-x': 'hidden'
          }}
          itemKey={function itemKey(index, data) {
            return data[index]._id || index;
          }}
        >
          {row}
        </FixedSizeList>
      )}
    </AutoSizer>
  </div>
}

export default BlockTree



// const defaultButtonStyle = { fontFamily: 'Courier New' }

// Tree component can work with any possible tree structure because it uses an
// iterator function that the user provides. Structure, approach, and iterator
// function below is just one of many possible variants.
// const defaultTree = {
//   name: 'Root #1',
//   id: 'root-1',
//   children: [
//     {
//       children: [
//         {id: 'child-2', name: 'Child #2'},
//         {id: 'child-3', name: 'Child #3'},
//         {id: 'child-5', name: 'Child #3'},
//         {id: 'child-6', name: 'Child #3'},
//         {id: 'child-7', name: 'Child #3'},
//         {id: 'child-8', name: 'Child #3'},
//         {id: 'child-9', name: 'Child #3'},
//         {id: 'child-10', name: 'Child #3'},
//         {id: 'child-11', name: 'Child #3'},
//       ],
//       id: 'child-1',
//       name: 'Child #1',
//     },
//   ],
// }

  /*
async function* treeWalker(refresh) {
  const stack = []
 
  // Remember all the necessary data of the first node in the stack.
  stack.push({
    nestingLevel: 0,
    node: tree,
  })
 
  // Walk through the tree until we have no nodes available.
  while (stack.length !== 0) {
    const {
      node: {children = [], id, name},
      nestingLevel,
    } = stack.pop()
 
    // Here we are sending the information about the node to the Tree component
    // and receive an information about the openness state from it. The
    // `refresh` parameter tells us if the full update of the tree is requested;
    // basing on it we decide to return the full node data or only the node
    // id to update the nodes order.
    const isOpened = yield refresh
      ? {
          id,
          isLeaf: children.length === 0,
          isOpenByDefault: false,
          name,
          nestingLevel,
        }
      : id
 
    // Basing on the node openness state we are deciding if we need to render
    // the child nodes (if they exist).
    if (children.length !== 0 && isOpened) {
      // Since it is a stack structure, we need to put nodes we want to render
      // first to the end of the stack.
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: children[i],
        });
      }
    }
  }
}
*/

  /*
  // Node component receives all the data we created in the `treeWalker` +
  // internal openness state (`isOpen`), function to change internal openness
  // state (`toggle`) and `style` parameter that should be added to the root div.
  const Node = ({data: {isLeaf, name, nestingLevel}, isOpen, style, toggle}) => {

    const toogleAndUpdate = () => {
      toggle()
      setTimeout(updateHeight, 100)
    }

    return <div
      style={{
        ...style,
        alignItems: 'center',
        display: 'flex',
        marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
      }}
    >
      {!isLeaf && (
        <div>
          <button
            type="button"
            onClick={toogleAndUpdate}
            style={defaultButtonStyle}
          >
            {isOpen ? '-' : '+'}
          </button>
        </div>
      )}
      <div>{name}</div>
    </div>
  }
*/
