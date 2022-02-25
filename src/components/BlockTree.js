import React, { useCallback, useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window';

import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'

import classes from './BlockTree.module.css'

import {
  MoreHorizSharp as BlockMenuIcon,
  ArrowDropDownSharp as ExpandLessIcon,
  ArrowRightSharp as ExpandMoreIcon,
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

function buildTree(nodes){
  // Build a tree from the blocks.
  // Where each block has a parentId property.
  // Each tree item should have the block itself, a list of children and a nesting level.
  
  const treeRoots = []

  for (let node of nodes) {
    let parentBlock = null
    if (node.block.parent) {
      parentBlock = nodes.find(n => n._id === node.block.parent)
      if (!parentBlock) {
        console.error('Invalid parent')
      }
    }

    if (!parentBlock) {
      treeRoots.push(node)
    } else {
      // If the parentBlock has no children, create the children array.
      if (!parentBlock.children) {
        parentBlock.children = []
      }
      parentBlock.children.push(node)
    }
  }

  return treeRoots
}

function* treeWalker(treeRoots) {
  const stack = []
 
  // Remember all the necessary data of the first node in the stack.
  for (const root of treeRoots) {
    stack.unshift({
      nestingLevel: 0,
      node: root,
    })
  }
 
  // Walk through the tree until we have no nodes available.
  while (stack.length !== 0) {
    const {
      node: {children = [], _id, block, isOpen},
      nestingLevel,
    } = stack.pop()

    yield {
      _id,
      isLeaf: children.length === 0,
      isOpen,
      block,
      nestingLevel,
    }
 
    // Basing on the node openness state we are deciding if we need to render
    // the child nodes (if they exist).
    if (children.length !== 0 && isOpen) {
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

function getFlatTree(treeRoots){
  const flatTree = []

  const walker = treeWalker(treeRoots)

  let done = false
  while (!done) {
    const { done: new_done, value } = walker.next()
    done = new_done
    if (!done) {
      flatTree.push(value)
    }
  }

  return flatTree
}

const BlockRow = ({ createBlock, onClick, index, style, data, toggleOpenById }) => {
  const {
    _id,
    isLeaf,
    isOpen,
    block,
    nestingLevel,
  } = data[index]

  const [blockMenuIsOpen, setBlockMenuIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    if (typeof toggleOpenById === 'function') {
      toggleOpenById(_id)
    }
  }, [ toggleOpenById, _id ])

  const onBlockMentToogle = useCallback(newValue => {
    if (newValue === false) {
      setTimeout(() => {
        setBlockMenuIsOpen(newValue)
      }, 200) // The fade-out animation is 200ms. Only rerender after it, for it not to loose the element.
    } else {
      setBlockMenuIsOpen(newValue)
    }
  }, [ setBlockMenuIsOpen ])

  const actions = {
    click: () => {
      onClick(block)
      // navigate(`/${block._id}/view`)
    }
  }

  const rowContent = <>
    <ViewerAuto
      dragable={true}
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
        onToogle={onBlockMentToogle}
        {...{
          block,
          createBlock,
          // setType: saveType,
        }}
        trigger={props => (
          <button
            {...props}
            className={`text hasIcon ${blockMenuIsOpen ? 'fakeHover' : ''}`}
            style={{
              margin: '0',
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

  const inset = ~~(nestingLevel * 25 + (isLeaf ? 24 : 0))

  return <div
    key={block._id}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...style,
      marginLeft: inset,
      minWidth: `calc(100% - ${(isLeaf ? 24 : 0)}px)`,
      width: `calc(100% - ${inset}px)`,
    }}
    className={`${classes.blockRow} ${blockMenuIsOpen ? classes.fakeHover : ''}`}
  >
    {!isLeaf && (
      <button
        onClick={toggleOpen}
        className="text hasIcon"
        style={{
          margin: '0',
          padding: 'var(--basis) 0',
          flexShrink: '0',
        }}
      >
        {
          isOpen
            ? <ExpandLessIcon style={{ verticalAlign: 'middle' }} />
            : <ExpandMoreIcon style={{ verticalAlign: 'middle' }} />
        }
      </button>
    )}
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
  const [nodes, setNodes] = useState({})
  const [openById, setOpenById] = useState({})
  const [treeNodes, setTreeNodes] = useState([])
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

  const updateTree = useCallback(nodes => {
    if (nodes.length > 0) {
      nodes = nodes.map(node => ({
        ...node,
        isOpen: openById[node._id] || false,
      }))
      const treeRoots = buildTree(JSON.parse(JSON.stringify(nodes)))
      const flatTree = getFlatTree(treeRoots)
      setTreeNodes(flatTree)
    } else {
      setTreeNodes([])
    }
    updateHeight()
  }, [ setTreeNodes, updateHeight, openById ])

  const loadBlocks = useLoadBlocks()
  const refetchData = useCallback(() => {
    if (
      nodes.length === 0
      || prevFetchArguments.current.archived !== archived
      || prevFetchArguments.current.types !== types
    ) {
      prevFetchArguments.current.types = types
      prevFetchArguments.current.archived = archived
      
      loadBlocks({ types, archived })
        .then(async loadedBlocks => {
          const nodes = loadedBlocks
          .map(block => ({
            _id: block._id,
            block,
            children: [],
            isOpen: false,
          }))

          if (nodes.length > 0) {
            setNodes(nodes)
            updateTree(nodes)
          }
        })
        .catch(error => console.error(error))
    }
  }, [ nodes, loadBlocks, types, archived, setNodes, updateTree ])

  useEffect(() => {
    refetchData()
  }, [ refetchData ])

  useEffect(() => {
    onGetRefetch(refetchData)
  }, [ onGetRefetch, refetchData ])



  const toggleOpenById = useCallback((_id) => {
    openById[_id] = !openById[_id]
    setOpenById(openById)
    updateTree(nodes)
  }, [setOpenById, openById, updateTree, nodes])

  const row = (props) => {
    return <BlockRow
      createBlock={createBlock}
      onClick={onClick}
      toggleOpenById={toggleOpenById}
      {...props}
    />
  }

  return <div
    style={{
      height: outerHeight,
      marginRight: '-12px',
      marginLeft: '-12px',
      marginBottom: bottomMargin,
    }}
    ref={outerTreeRef}
  >
    <AutoSizer disableWidth>
      {({height}) => (
        <FixedSizeList
          itemData={treeNodes}
          itemCount={treeNodes.length}
          ref={treeRef}
          innerRef={innerTreeRef}
          // onScroll={updateHeight}
          itemSize={minItemSize}
          height={height}
          width="100%"
          style={{
            overflowY: 'hidden',
            overflowX: 'auto',
            // overflowX: 'hidden',
          }}
          itemKey={(index, data) => data[index]._id}
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
