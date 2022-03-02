import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl } from '../../functions.js'
import useClickOnBlock from '../../hooks/useClickOnBlock.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageLine.module.css'

function ViewerPageLine ({ block, actions = {} }) {
  const { getString } = useLocalization()

  const { clickOnBlock } = useClickOnBlock({ block })

  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  const text = block.properties.text || getString('placeholder_main_headline')

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : clickOnBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <span dir="auto" className={classes.title}>{text}</span>
    </div>
  </div>
}

export default ViewerPageLine
