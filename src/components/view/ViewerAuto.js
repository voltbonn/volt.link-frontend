import React, { useState, useEffect, useRef, useCallback } from 'react'

import { DataBothWays } from '../DataTransmat.js'

import ViewerTextCard from './ViewerTextCard.js'
import ViewerButtonCard from './ViewerButtonCard.js'
import ViewerDividerLine from './ViewerDividerLine.js'
import ViewerLine from './ViewerLine.js'
import ViewerImageCard from './ViewerImageCard.js'

import classes from './ViewerAuto.module.css'

import { moveBlock_Mutation, saveBlock_Mutation } from '../../graphql/mutations.js'
import useMutation from '../../hooks/useMutation.js'
import useLoadBlock from '../../hooks/useLoadBlock.js'
import useUser from '../../hooks/useUser.js'

function usePressedKeys({ keys = [] }) { // keys needs to lowercase
  const pressedKeysRef = useRef(new Set())

  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key.toLowerCase()
      if (keys.includes(key)) {
        pressedKeysRef.current.add(key)
      }
    }
    function onKeyUp(event) {
      const key = event.key.toLowerCase()
      pressedKeysRef.current.delete(key)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [keys])

  const getPressedKeys = () => pressedKeysRef.current // returns a Set !!!

  return { getPressedKeys }
}

function removeProperty(obj, prop) {
  // remove property from objects, arrays and sub-objects

  obj = JSON.parse(JSON.stringify(obj)) // clone object to make everything mutable

  if (obj.hasOwnProperty(prop)) {
    delete obj[prop]
  }
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj[i] == 'object' && obj[i] !== null) {
        removeProperty(obj[i], prop)
      }
    }
  }

  return obj
}

function ViewerAuto ({
  blockId = null,
  block = {},
  clickable = true,
  onClick = null,
  size = 'card',
  dragable = false,
  parentProps = {},
  ...props
}) {
  let component = null

  const [loadedBlock, setLoadedBlock] = useState(block)
  const loadingBlockRef = useRef(false)

  const { userroles } = useUser()
  const { getPressedKeys } = usePressedKeys({ keys: ['shift'] }) // returns a Set !!!

  const loadBlock = useLoadBlock()

  useEffect(() => {
    if (JSON.stringify(block) !== JSON.stringify(loadedBlock)) {
      setLoadedBlock(block)
    }
  }, [loadedBlock, block])

  useEffect(() => {
    if (
      !!blockId
      && (!loadedBlock.hasOwnProperty('_id') || blockId !== loadedBlock._id)
      && loadingBlockRef.current === false
    ) {
      loadingBlockRef.current = true

      loadBlock(blockId)
        .then(async loadedBlock => {
          if (typeof loadedBlock !== 'object' || loadedBlock === null) {
            throw new Error('ViewerAuto: loadBlock returned no object')
          } else {
            if (loadedBlock.type !== null) {
              setLoadedBlock(loadedBlock)
            }
          }
          loadingBlockRef.current = false
        })
        .catch(error => {
          console.error(error)
          loadingBlockRef.current = false
        })
    }
  }, [blockId, loadedBlock, loadBlock, setLoadedBlock])

  const type = loadedBlock.type || null

  switch (type) {
    case 'text':
      component = <ViewerTextCard key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'button':
      component = <ViewerButtonCard key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'divider':
      component = <ViewerDividerLine key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'page':
      component = <ViewerLine key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'person':
      component = <ViewerLine key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'redirect':
      component = <ViewerLine key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    case 'image':
      component = <ViewerImageCard key={loadedBlock._id} block={loadedBlock} {...props} />
      break
    default:
      component = null // JSON.stringify(loadedBlock) // <ViewerTextCard key={loadedBlock._id} block={loadedBlock} {...props} />
  }

  const mutationFunction = useMutation()

  const onReceive = useCallback(async ({ data = {} }) => {
    const {
      'application/json': json
    } = data || {}

    if (typeof json === 'object' && json !== null) {
      let movingBlock = json

      movingBlock = removeProperty(movingBlock, '__typename')

      const block_roles = loadedBlock.computed.roles || []
      const movingBlock_roles = movingBlock.computed.roles || []

      if (
        movingBlock._id !== loadedBlock._id
        && (
          userroles.includes('admin')
          || (
            ( block_roles.includes('editor') || block_roles.includes('owner') )
            && ( movingBlock_roles.includes('editor') || movingBlock_roles.includes('owner') )
          )
        )
      ) {
        const pressedKeys = getPressedKeys()
        // TODO: handle alt-key to duplicate block (child-blocks also need to be duplicated)
        // if (pressedKeys.has('alt')) {
        //   // duplicate block
        //   delete movingBlock._id
        //   const save_result = await mutationFunction({
        //     mutation: saveBlock_Mutation,
        //     variables: {
        //       block: movingBlock,
        //     },
        //   })
        //
        //   movingBlock._id = save_result.saveBlock
        // }

        let everything_updated = false

        try {
          await mutationFunction({
            mutation: moveBlock_Mutation,
            variables: {
              movingBlockId: movingBlock._id,
              newParentId: loadedBlock._id,
              newIndex: 0,
            },
          })
        
          if (pressedKeys.has('shift')) {
            // auto hide the block        
            await mutationFunction({
              mutation: saveBlock_Mutation,
              variables: {
                block: {
                  _id: movingBlock._id,
                  properties: {
                    'active': false,
                  },
                },
              },
            })
          }
        
          everything_updated = true
        } catch (error) {
          console.error(error)
        }
      
        if (everything_updated) {
          console.log('TODO reload sidebar')
          // TODO: reload sidebar
        }
      }
    } 
  }, [mutationFunction, loadedBlock, getPressedKeys, userroles])

  const handleCheckEntry = useCallback(({ data = {} }) => {
    const {
      'application/json': json
    } = data || {}

    let isOkay = false

    if (
      typeof json === 'object'
      && json !== null
      && json.hasOwnProperty('computed')
      && json.computed.hasOwnProperty('roles')
    ) {
      const this_roles = json.computed.roles || []
      if (userroles.includes('admin') || this_roles.includes('editor') || this_roles.includes('owner')) {
        isOkay = true
      }
    }

    return isOkay
  }, [userroles])

  return <DataBothWays
    key={loadedBlock._id}
    draggable={dragable}
    className={classes.root}
    onTransmit={() => ({
      data: {
        'text/plain': loadedBlock.properties.text || '',
        // 'text/html': '<h1>Hello world!</h1>',
        // 'text/uri-list': 'http://example.com',
        'application/json': loadedBlock,
      }
    })}
    onReceive={onReceive}
    checkEntry={handleCheckEntry}
    {...parentProps}
  >
    {component}
  </DataBothWays>
}

export default ViewerAuto
