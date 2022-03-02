import { getImageUrl } from '../../functions.js'
import useClickOnBlock from '../../hooks/useClickOnBlock.js'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPersonCard.module.css'

function ViewerPersonCard ({ block, actions = {} }) {
  const { clickOnBlock } = useClickOnBlock({ block })

  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  const text = block.properties.text || ''

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : clickOnBlock}
    className="clickable_card"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    {
      icon_url === ''
        ? <PersonPlaceholderIcon className={classes.icon} />
        : <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
    }
    <span className={classes.name} dir="auto">{text}</span>
  </div>
}

export default ViewerPersonCard
