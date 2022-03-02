import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl } from '../../functions.js'
import useClickOnBlock from '../../hooks/useClickOnBlock.js'

import {
  AutoAwesomeSharp as AutomationIcon,
} from '@mui/icons-material'

import classes from './ViewerAutomationLine.module.css'

function ViewerAutomationLine ({ block, actions = {} }) {
  const { getString } = useLocalization()
  const { clickOnBlock } = useClickOnBlock({ block })

  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  let title = block.properties.text || ''
  if (title === '') {
    const triggerProperties = ((block.properties || {}).trigger || {})
    const triggerType = triggerProperties.type

    if (triggerType === 'path') {
      title = '/'+triggerProperties.path
    } else if (triggerType === 'click') {
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
  }

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : clickOnBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        icon_url === ''
          ? <AutomationIcon className={classes.icon} />
          : <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt=""></div>
      }

      <span dir="auto" className={classes.title}>{title}</span>
    </div>
  </div>
}

export default ViewerAutomationLine
