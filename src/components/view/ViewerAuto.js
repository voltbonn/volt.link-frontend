import React from 'react'

import ViewerHeadlineCard from './ViewerHeadlineCard.js'
import ViewerTextCard from './ViewerTextCard.js'
import ViewerButtonCard from './ViewerButtonCard.js'
import ViewerDividerCard from './ViewerDividerCard.js'
import ViewerCheckboxCard from './ViewerCheckboxCard.js'
import ViewerPageLine from './ViewerPageLine.js'
import ViewerPageCard from './ViewerPageCard.js'
import ViewerPersonCard from './ViewerPersonCard.js'
import ViewerActionCard from './ViewerActionCard.js'

import classes from './ViewerAuto.module.css'

function ViewerAuto ({ block = {}, actions = {}, size = 'card', style, ...props }) {
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
      switch (size) {
        case 'line':
          component = <ViewerPageLine key={block._id} block={block} actions={actions} {...props} />
          break
        default:
          component = <ViewerPageCard key={block._id} block={block} actions={actions} {...props} />
      }
      break
    case 'person':
      component = <ViewerPersonCard key={block._id} block={block} actions={actions} {...props} />
      break
    case 'action':
      component = <ViewerActionCard key={block._id} block={block} actions={actions} {...props} />
      break
    default:
      component = JSON.stringify(block) // <ViewerTextCard key={block._id} block={block} actions={actions} {...props} />
  }

  return <div
    key={block._id}
    className={classes.root}
    style={style}
  >
    {component}
  </div>
}

export default ViewerAuto
