import React, { useCallback } from 'react'

import { DataBothWays } from '../DataTransmat.js'

import ViewerHeadlineCard from './ViewerHeadlineCard.js'
import ViewerTextCard from './ViewerTextCard.js'
import ViewerButtonCard from './ViewerButtonCard.js'
import ViewerDividerCard from './ViewerDividerCard.js'
import ViewerCheckboxCard from './ViewerCheckboxCard.js'
import ViewerPageLine from './ViewerPageLine.js'
// import ViewerPageCard from './ViewerPageCard.js'
import ViewerPersonCard from './ViewerPersonCard.js'
import ViewerAutomationLine from './ViewerAutomationLine.js'

import classes from './ViewerAuto.module.css'

import { moveBlock_Mutation } from '../../graphql/mutations.js'
import useMutation from '../../hooks/useMutation.js'

function ViewerAuto ({ block = {}, actions = {}, size = 'card', style, dragable = false, ...props }) {
  let component = null

  const type = block.type || null

  switch (type) {
    case 'headline':
      component = <ViewerHeadlineCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'text':
      component = <ViewerTextCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'button':
      component = <ViewerButtonCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'divider':
      component = <ViewerDividerCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'checkbox':
      component = <ViewerCheckboxCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'page':
      // switch (size) {
      //   case 'line':
          component = <ViewerPageLine key={block._id} block={block} actions={actions} {...props} />
      //     break
      //   default:
      //     component = <ViewerPageCard key={block._id} block={block} actions={actions} {...props} />
      // }
      break
    case 'person':
      component = <ViewerPersonCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'automation':
      component = <ViewerAutomationLine key={block._id} block={block} actions={actions} {...props} />
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
    style={style}
    onTransmit={() => ({
      data: {
        // 'text/plain': 'Hello world!',
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
