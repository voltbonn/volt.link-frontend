import React, { useCallback, useEffect, useState, useRef } from 'react'
// import { useLayoutEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'

import { Localized, useLocalization } from '../fluent/Localized.js'

import classes from './BlockTree.module.css'

import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'

import {
  MoreHorizSharp as BlockMenuIcon,
  ArrowDropDownSharp as ExpandLessIcon,
  ArrowRightSharp as ExpandMoreIcon,

  Replay as RequeryIcon,
  FilterList as FilterListIcon,
  Archive as ArchiveIcon,

  // Search as SearchIcon,

  InsertDriveFileSharp as PageIcon,
  // AutoAwesomeSharp as ActionIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // TitleSharp as HeadlineIcon,
  // NotesSharp as TextIcon,
  // Remove as DividerIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'

import PopoverMenu from './PopoverMenu.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  redirect: <RedirectIcon />,
}


const minItemSize = 43

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

// const useWindowSize = () => {
//   let [size, setSize] = useState([0, 0])
//   useLayoutEffect(() => {
//     function updateSize() {
//       setSize([window.innerWidth, window.innerHeight])
//     }
//     window.addEventListener("resize", updateSize)
//     updateSize()
//     return () => window.removeEventListener("resize", updateSize)
//   }, [])
//   return size
// }


const BlockRow = ({
  createBlock,
  index,
  style,
  data,
  toggleOpenById,
  refetchData,
  // onSetSize,
  showBlockMenu = true,
}) => {
  const {
    _id,
    isLeaf,
    isOpen,
    block,
    nestingLevel,
  } = data[index]

  // const rootRef = useRef()
  // const [ windowWidth ] = useWindowSize()
  // useEffect(() => {
  //   if (typeof onSetSize === 'function') {
  //     const height = rootRef.current.getBoundingClientRect().height
  //     onSetSize(index, height)
  //   }
  // }, [ index, onSetSize, windowWidth ])

  const [blockMenuIsOpen, setBlockMenuIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    if (typeof toggleOpenById === 'function') {
      toggleOpenById(_id)
    }
  }, [ toggleOpenById, _id ])

  const onBlockMenuToogle = useCallback(newValue => {
    if (newValue === false) {
      setTimeout(() => {
        setBlockMenuIsOpen(newValue)
      }, 200) // The fade-out animation is 200ms. Only rerender after it, for it not to loose the element.
    } else {
      setBlockMenuIsOpen(newValue)
    }
  }, [ setBlockMenuIsOpen ])

  const onArchiveToggle = useCallback(newArchivedValue => {
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
            onArchivedToggle={onArchiveToggle}
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
      )
    }
  </>

  const inset = ~~(nestingLevel * 25 + (isLeaf ? 24 : 0))

  return <div
    // ref={rootRef}
    key={block._id}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...style,
      // height: 'auto',
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

const getFilteredTypes = types => Object.entries(types)
  .filter(([, value]) => value === true)
  .map(([key, ]) => key)

function BlockTree({
  createBlock = ()=>{},
  scrollContainer = window,
  showBlockMenu = true,
}) {
  const { getString } = useLocalization()
  const { loggedIn } = useUser()

  const outerTreeRef = useRef(null)
  const innerTreeRef = useRef(null)
  const treeRef = useRef(null)
  const [outerHeight, setOuterHeight] = useState(minItemSize)
  const [bottomMargin, setBottomMargin] = useState(0)
  const [nodes, setNodes] = useState({})
  const [openById, setOpenById] = useState({})
  const [treeNodes, setTreeNodes] = useState([])

  const [treeNodesFiltered, setTreeNodesFiltered] = useState([])
  const [searchString, setSearchString] = useState('')
  const prevFetchArguments = useRef({})

  const [onlyShowWithEditPermissions, setOnlyShowWithEditPermissions] = useState(false) // false = show all, true = show only owning
  function toggleOnlyShowWithEditPermissions() {
    setOnlyShowWithEditPermissions(oldOnlyShowWithEditPermissions => !oldOnlyShowWithEditPermissions)
  }

  const [types, setTypes] = useState({
    person: true,
    page: true,
    redirect: true,
  })
  const filteredTypes = getFilteredTypes(types)
  
  const [archived, setArchived] = useState(false)
  function toggleArchived() {
    setArchived(oldArchived => !oldArchived)
  }


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
      setTimeout(() => {
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

  useScrollPosition(updateHeight, [ updateHeight ], null, false, 300, scrollContainer)

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
  const refetchData = useCallback(options => {
    const {
      force = false,
      filteredTypes,
      archived,
    } = options || {}

    if (
      force === true
      || prevFetchArguments.current.archived !== archived
      || prevFetchArguments.current.types !== filteredTypes
    ) {
      prevFetchArguments.current.types = filteredTypes
      prevFetchArguments.current.archived = archived
      
      loadBlocks({ types: filteredTypes, archived })
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
  }, [ loadBlocks, setNodes, updateTree ])

  // useEffect(() => {
  //   refetchData()
  // }, [ refetchData ])





  // START Filter + Search

  useEffect(() => {
    let filtered = treeNodes

    if (searchString.length > 0) {
      const searchStringLower = searchString.toLowerCase()
    
      filtered = filtered
        .filter(node => {
          if (
            !!node
            && !!node.block
            && !!node.block.properties
            && !!node.block.properties.text
            && node.block.properties.text.toLowerCase().includes(searchStringLower)
          ) {
            return true
          } else if (
            !!node
            && !!node.block
            && !!node.block.properties
            && !!node.block.properties.trigger
            && !!node.block.properties.trigger.path
            && node.block.properties.trigger.path.toLowerCase().includes(searchStringLower)
          ) {
            return true
          }
          return false
        })
    }

    if (onlyShowWithEditPermissions === true) {
      filtered = filtered
        .filter(node => (
          !!node
          && !!node.block
          && !!node.block.computed
          && !!node.block.computed.roles
          && (
            node.block.computed.roles.includes('owner')
            || node.block.computed.roles.includes('editor')
          )
        ))
    }

    setTreeNodesFiltered(filtered)
    updateHeight()
  }, [ searchString, onlyShowWithEditPermissions, treeNodes, setTreeNodesFiltered, updateHeight ])

  const handleSearch = useCallback(event => {
    setSearchString(event.target.value || '')
  }, [ setSearchString ])

  const toggleType = useCallback(type2toggle => {
    const newTypes = { ...types }
    newTypes[type2toggle] = !newTypes[type2toggle]

    const typesValues = Object.values(newTypes)
    if (!typesValues.every(value => value === false)) {
      setTypes(newTypes)
    }
  }, [ types, setTypes ])

  useEffect(() => {
    refetchData({
      filteredTypes: getFilteredTypes(types),
      archived,
    })
  }, [ types, archived, refetchData ])

  // END Filter + Search










  const toggleOpenById = useCallback((_id) => {
    openById[_id] = !openById[_id]
    setOpenById(openById)
    updateTree(nodes)
  }, [setOpenById, openById, updateTree, nodes])

  const refetchDataWithFilter = useCallback(options => {
    refetchData({
      ...options,
      filteredTypes: getFilteredTypes(types),
      archived,
    })
  }, [ types, archived, refetchData ])

  const row = (props) => {
    return <BlockRow
      createBlock={createBlock}
      toggleOpenById={toggleOpenById}
      refetchData={refetchDataWithFilter}
      // onSetSize={setSize}
      showBlockMenu={showBlockMenu}
      {...props}
    />
  }

  return <>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 var(--basis_x2) 0',
    }}>

      <input
        type="text"
        placeholder={getString('search')}
        style={{
          width: '100%',
        }}
        onChange={handleSearch}
      />

      <PopoverMenu
        trigger={triggerProps => (
          <button
            {...triggerProps}
            className="text hasIcon"
            style={{
              flexShrink: '0',
            }}
          >
            <FilterListIcon className="icon" />
            {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Filter</span> */}
          </button>
        )}
      >
        {/*
          { value: 'page', icon: <PageIcon className="icon"/>, title: getString('block_menu_type_label_plural_page') },
          { value: 'person', icon: <PersonIcon className="icon" />, title: getString('block_menu_type_label_plural_person') },
          { value: 'redirect', icon: <RedirectIcon className="icon" />, title: getString('block_menu_type_label_plural_redirect') },
        */}

        <div style={{ marginTop: '8px' }}></div>

        {
          Object.keys(types)
            .map(type => (
              <MenuItem
                className="roundMenuItem"
                key={type}
                onClick={() => toggleType(type)}
                selected={filteredTypes.includes(type)}
                sx={{
                  marginTop: '2px !important',
                  marginBottom: '2px !important',
                }}
              >
                <ListItemIcon>
                  {blockTypeIcons[type]}
                </ListItemIcon>
                <ListItemText>
                  <Localized id={'block_menu_type_label_plural_'+type} />
                </ListItemText>
              </MenuItem>
            ))
        }

        {
          loggedIn
          && <>
            <Divider style={{ opacity: 0.2 }} />

            <MenuItem
              className="roundMenuItem"
              onClick={toggleArchived}
              selected={archived === true}
              sx={{
                marginBottom: '2px !important',
              }}
            >
              <ListItemIcon>
                <ArchiveIcon className="icon" />
              </ListItemIcon>
              <ListItemText>
                <Localized id={archived === true ? 'filter_menu_showing_archiv' : 'filter_menu_show_archiv'} />
              </ListItemText>
            </MenuItem>

            <MenuItem
              className="roundMenuItem"
              onClick={toggleOnlyShowWithEditPermissions}
              selected={onlyShowWithEditPermissions === true}
            >
              <ListItemIcon>
                <EditIcon className="icon" />
              </ListItemIcon>
              <ListItemText>
                <Localized id={onlyShowWithEditPermissions === true ? 'filter_menu_showing_editing' : 'filter_menu_show_editing'} />
              </ListItemText>
            </MenuItem>
          </>
        }

      </PopoverMenu>

      <button
        className="text hasIcon"
        onClick={refetchDataWithFilter}
        style={{
          flexShrink: '0',
        }}
      >
        <RequeryIcon className="icon" />
        {/* <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>Reload</span> */}
      </button>
    </div>
  <div
    style={{
      height: outerHeight,
      marginRight: '-12px',
      marginLeft: '-12px',
      marginBottom: bottomMargin,
    }}
    ref={outerTreeRef}
  >
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeList
          itemData={treeNodesFiltered}
          itemCount={treeNodesFiltered.length}
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
      {
        treeNodesFiltered.length === 0
          ? <p style={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}><Localized id="blocktree_no_nodes_to_show" /></p>
          : null
      }
    </div>
  </>
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
