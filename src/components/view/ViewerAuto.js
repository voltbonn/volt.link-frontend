import React, { useCallback } from 'react'

import { DataBothWays } from '../DataTransmat.js'

import ViewerTextCard from './ViewerTextCard.js'
import ViewerButtonCard from './ViewerButtonCard.js'
import ViewerDividerLine from './ViewerDividerLine.js'
import ViewerCheckboxCard from './ViewerCheckboxCard.js'
import ViewerLine from './ViewerLine.js'

import classes from './ViewerAuto.module.css'

import { moveBlock_Mutation } from '../../graphql/mutations.js'
import useMutation from '../../hooks/useMutation.js'

function ViewerAuto ({ block = {}, actions = {}, size = 'card', dragable = false, ...props }) {
  let component = null

  const type = block.type || null

  switch (type) {
    case 'text':
      component = <ViewerTextCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'button':
      component = <ViewerButtonCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'divider':
      component = <ViewerDividerLine key={block._id} block={block} actions={actions} {...props} />
      break
    case 'checkbox':
      component = <ViewerCheckboxCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'page':
      component = <ViewerLine key={block._id} block={block} actions={actions} {...props} />
      break
    case 'person':
      component = <ViewerLine key={block._id} block={block} actions={actions} {...props} />
      break
    case 'redirect':
      component = <ViewerLine key={block._id} block={block} actions={actions} {...props} />
      break
    default:
      component = JSON.stringify(block) // <ViewerTextCard key={block._id} block={block} actions={actions} {...props} />
  }

  const mutationFunction = useMutation()

  const onReceive = useCallback(({ data: movingBlock }) => {
    if (movingBlock._id !== block._id) {
      mutationFunction({
        mutation: moveBlock_Mutation,
        variables: {
          movingBlockId: movingBlock._id,
          newParentId: block._id,
          newIndex: 0,
        },
      })
        // .then(() => {
        //   // TODO: reload sidebar
        // })
        .catch(console.error)
    }
  }, [ mutationFunction, block ])

  return <DataBothWays
    key={block._id}
    draggable={dragable}
    className={classes.root}
    onTransmit={() => ({
      data: {
        'text/plain': block.properties.text || '',
        // 'text/html': '<h1>Hello world!</h1>',
        // 'text/uri-list': 'http://example.com',
        'application/json': block,
      }
    })}
    onReceive={onReceive}
  >
    {component}
  </DataBothWays>
}

export default ViewerAuto
