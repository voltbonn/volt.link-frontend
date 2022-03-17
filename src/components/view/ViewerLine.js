import { useCallback } from 'react'
import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl } from '../../functions.js'
import useClickOnBlock from '../../hooks/useClickOnBlock.js'

import {
  InsertDriveFile as PageIcon,
  Face as PersonIcon,
  LinkSharp as RedirectIcon,
} from '@mui/icons-material'

import classes from './ViewerLine.module.css'

function ViewerLine ({ block, actions = {} }) {
  const { getString } = useLocalization()

  const { clickOnBlock } = useClickOnBlock()
  const handleClick = useCallback(() => {
    clickOnBlock({ block })
  }, [ clickOnBlock, block ])

  let title = block.properties.text || ''
  if (title === '') {
    const triggerProperties = ((block.properties || {}).trigger || {})
    const triggerType = triggerProperties.type

    if (triggerType === 'path') {
      title = '/'+triggerProperties.path
    } else if (block.type === 'redirect') {
      if (triggerType === 'click') {
        title = triggerProperties.blockId
      } else if (triggerType === 'cron') {
        title = triggerProperties.cron
      } else if (triggerType === 'block_change') {
        title = triggerProperties.blockId
      } else if (Object.keys(triggerProperties).length > 0) {
        title = JSON.stringify(triggerProperties)
      } else {
        title = getString('placeholder_main_headline')
      }
    } else {
      title = getString('placeholder_main_headline')
    }
  }
  
  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  let iconComponent = null
  if (icon_url === '') {
    switch (block.type) {
      case 'person':
        iconComponent = <PersonIcon className={classes.icon} />
        break
      case 'redirect':
        iconComponent = <RedirectIcon className={classes.icon} />
        break
      default:
      iconComponent = <PageIcon className={classes.icon} />
    }
  } else {
    iconComponent = <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={title}></div>
  }

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : handleClick}
    className={`clickable_card ${classes.root}`}
    style={{
      cursor: actions.hasOwnProperty('click') && typeof actions.click !== 'function' ? 'default' : 'pointer',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {iconComponent}
      <span dir="auto" className={classes.title}>{title}</span>
    </div>
  </div>
}

export default ViewerLine
