import { useCallback } from 'react'
import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl } from '../../functions.js'
import useClickOnBlock from '../../hooks/useClickOnBlock.js'

import {
  InsertDriveFile as PageIcon,
  Face as PersonIcon,
  AutoAwesomeSharp as AutomationIcon,
} from '@mui/icons-material'

import classes from './ViewerLine.module.css'

function ViewerLine ({ block, actions = {} }) {
  const { getString } = useLocalization()

  const { clickOnBlock } = useClickOnBlock()
  const handleClick = useCallback(() => {
    clickOnBlock({ block })
  }, [ clickOnBlock, block ])

  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  const text = block.properties.text || getString('placeholder_main_headline')

  let iconComponent = null
  if (icon_url === '') {
    switch (block.type) {
      case 'person':
        iconComponent = <PersonIcon className={classes.icon} />
        break
      case 'automation':
        iconComponent = <AutomationIcon className={classes.icon} />
        break
      default:
      iconComponent = <PageIcon className={classes.icon} />
    }
  } else {
    iconComponent = <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
  }

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : handleClick}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {iconComponent}
      <span dir="auto" className={classes.title}>{text}</span>
    </div>
  </div>
}

export default ViewerLine
