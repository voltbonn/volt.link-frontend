import React, { useCallback, useEffect, useState, useRef } from 'react'
import { VariableSizeList } from 'react-window'

import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'

import { Localized } from '../fluent/Localized.js'

import classes from './BlockTree.module.css'

import {
  MoreVertSharp as BlockMenuIcon,
  ArrowDropDownSharp as ExpandLessIcon,
  ArrowRightSharp as ExpandMoreIcon,
} from '@mui/icons-material'

import useLoadBlocks from '../hooks/useLoadBlocks.js'

const minItemSize = 41

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
      // if (!parentBlock) {
      //   console.error('Invalid parent:')
      //   console.error('parentBlockt', parentBlock)
      //   console.error('node.block.parent', node.block.parent)
      // }
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
 
  let treeRootsSorted = treeRoots
    .sort((a, b) => b.block.metadata.modified > a.block.metadata.modified ? 1 : -1)

  // find the index of the root with block.properties.slug === 'europa'
  const europaIndex = treeRootsSorted.findIndex(root => root?.block?.properties?.slug === 'europa')

  // remove the root at index europaIndex
  if (europaIndex > -1) {
    treeRootsSorted[europaIndex] = {
      ...treeRootsSorted[europaIndex],
      isOpen: true,
    }

    treeRootsSorted = [
      treeRootsSorted[europaIndex],
      ...treeRootsSorted.slice(0, europaIndex),
      ...treeRootsSorted.slice(europaIndex + 1)
    ]
  }
      
  // Remember all the necessary data of the first node in the stack.
  for (const root of treeRootsSorted) {
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

      const childrenSorted = children
        .sort((a, b) => b.block.metadata.modified > a.block.metadata.modified ? 1 : -1)

      for (let i = childrenSorted.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: childrenSorted[i],
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

const BlockRow = ({
  index,
  style,
  data,
}) => {
  const {
    items,
    props,
  } = data || []

  const {
    createBlock,
    toggleOpenById,
    refetchData,
    showBlockMenu,
    setItemSize,
  } = props || {}

  const {
    _id,
    isLeaf,
    isOpen,
    block,
    nestingLevel,
  } = items[index] || {}

  const itemRef = useRef()
  useEffect(() => {
    if (typeof setItemSize === 'function' && itemRef.current) {
      const height = itemRef.current.getBoundingClientRect().height
      if (height > 0) {
        setItemSize(index, ~~height)
      }
    }
  }, [index, block, setItemSize]) // mention block here, to recalc the height on new data
  
  const [blockMenuIsOpen, setBlockMenuIsOpen] = useState(false)

  const onBlockMenuToogle = useCallback(newValue => {
    if (newValue === false) {
      setTimeout(() => {
        setBlockMenuIsOpen(newValue)
      }, 200) // The fade-out animation is 200ms. Only rerender after it, for it not to loose the element.
    } else {
      setBlockMenuIsOpen(newValue)
    }
  }, [ setBlockMenuIsOpen ])

  const toggleOpen = useCallback(() => {
    if (typeof toggleOpenById === 'function') {
      toggleOpenById(_id)
    }
  }, [toggleOpenById, _id])
  
  const onReloadContext = useCallback(() => {
    if (typeof refetchData === 'function') {
      setTimeout(() => {
        refetchData({ force: true })
      }, 200) // The fade-out animation is 200ms. Only rerender after it, for it not to loose the element.
    }
  }, [ refetchData ])

  const rowContent = <>
    <ViewerAuto
      dragable={true}
      size="line"
      block={block}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
    />

    {
      showBlockMenu === true
      && (
        <div className={classes.blockRowActions}>
          <BlockMenu
            onToogle={onBlockMenuToogle}
            onReloadContext={onReloadContext}
            {...{
              block,
              createBlock,
              // saveType,
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
      )
    }
  </>

  const inset = ~~(nestingLevel * 25 + (isLeaf ? 24 : 0))

  return <div
    ref={itemRef}
    key={block._id}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...style,
      height: 'auto',
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
  scrollContainer = window,
  showBlockMenu = true,
  className = '',
}) {
  const outerTreeRef = useRef(null)
  const innerTreeRef = useRef(null)
  const [outerHeight, setOuterHeight] = useState(minItemSize)
  const [bottomMargin, setBottomMargin] = useState(0)
  const [nodes, setNodes] = useState([])
  const [openById, setOpenById] = useState({})
  const [treeNodes, setTreeNodes] = useState([])

  /*
  const sizeMap = useRef({})
  const setSize = useCallback((index, size) => {
    sizeMap.current = {
      ...sizeMap.current,
      [index]: size,
    }
  }, [])
  const getSize = useCallback(index => sizeMap.current[index] || minItemSize, [])
  */


  const { height: viewportHeight } = useViewportHeight()

  const updateHeight = useCallback(() => {
    if (innerTreeRef.current && outerTreeRef.current) {
      setTimeout(() => { // TODO remove this timeout (it's used to update the initial height)
        const outerBounds = outerTreeRef.current.getBoundingClientRect()      
        const maxHeight = viewportHeight - outerBounds.top

        const innerBounds = innerTreeRef.current.getBoundingClientRect()
        const fullHeight = innerBounds.height
        if (typeof fullHeight === 'number' && !isNaN(fullHeight) && fullHeight > minItemSize) {
          const newHeight = Math.min(maxHeight, fullHeight)
          setOuterHeight(~~(newHeight))
          setBottomMargin(~~(Math.max(fullHeight - newHeight, 0)))
        }
      }, 100)
    }
  }, [ viewportHeight, innerTreeRef, outerTreeRef, setOuterHeight, setBottomMargin ])

  useScrollPosition(updateHeight, [updateHeight], null, false, 300, scrollContainer)

  const updateTree = useCallback(nodes => {
    if (nodes.length > 0) {
      nodes = nodes.map(node => ({
        ...node,
        isOpen: openById.hasOwnProperty(node._id) ? openById[node._id] : false,
      }))
      
      const treeRoots = buildTree(JSON.parse(JSON.stringify(nodes)))
      const flatTree = getFlatTree(treeRoots)
      setTreeNodes(flatTree)
    } else {
      setTreeNodes([])
    }
    updateHeight()
  }, [setTreeNodes, updateHeight, openById])

  const loadBlocks = useLoadBlocks()
  const refetchData = useCallback(options => {
    let {
      force = false,
    } = options || {}

    if (true || force === true) {      
      loadBlocks({
        types: ['page', 'redirect'],
        archived: false,
        roots: ['6249c879fcaf12b124914396'], // TODO: don't hard code the id of europa 
        roles: ['viewer', 'editor', 'owner']
      })
        .then(async loadedBlocks => {
          const nodes = loadedBlocks
          .map(block => ({
            _id: block._id,
            block,
            children: [],
            isOpen: false,
          }))

          setNodes(nodes)
          updateTree(nodes)
        })
        .catch(error => console.error(error))
    }
  }, [loadBlocks, setNodes, updateTree])

  useEffect(() => {
    refetchData()
  }, [ refetchData ])

  const listRef = useRef(null)
  const [itemSizes, setSize] = React.useState([])
  const setItemSize = React.useCallback((index, size) => {
    if (typeof setSize === 'function') {
      setSize(sizes => ({
        ...sizes,
        [index]: size
      }))
      if (!!listRef.current && typeof listRef.current.resetAfterIndex === 'function') {
        listRef.current.resetAfterIndex(index, false)
      }
    }
  }, [])
  const getItemSize = React.useCallback(index => {
    return itemSizes[index] || minItemSize
  }, [itemSizes])




  const toggleOpenById = useCallback((_id) => {
    openById[_id] = !openById[_id]
    setOpenById(openById)
    updateTree(nodes)
  }, [setOpenById, openById, updateTree, nodes])

  const refetchDataWithFilter = useCallback(options => {
    refetchData(options)
  }, [ refetchData ])
  
  return <div
      style={{
        height: outerHeight,
        // marginRight: '-12px',
        // marginLeft: '-12px',
        marginTop: 'var(--basis_x4)',
        marginRight: '0',
        marginLeft: '0',
        marginBottom: bottomMargin,
        overflowY: 'visible',
        overflowX: 'auto',
      }}
      ref={outerTreeRef}
      className={className}
    >
      <VariableSizeList
        ref={listRef}
        itemSize={getItemSize}
        itemData={{
          items: treeNodes,
          props: {
            createBlock,
            toggleOpenById,
            refetchData: refetchDataWithFilter,
            showBlockMenu,
            setItemSize,
          }
        }}
        itemCount={treeNodes.length}
        innerRef={innerTreeRef}
        // onScroll={updateHeight}
        height={outerHeight}
        width="auto"
        style={{
          // overflow: 'visible',
          overflowY: 'hidden',
          overflowX: 'visible',
          // overflowX: 'hidden',
        }}
        estimatedItemSize={minItemSize}
        itemKey={(index, data) => data.items[index]._id}
      >
        {BlockRow}
      </VariableSizeList>
      {
        treeNodes.length === 0
          ? <p style={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}><Localized id="blocktree_no_nodes_to_show" /></p>
          : null
      }
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
