import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl } from '../../functions.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageLine.module.css'

function ViewerPageLine ({ block, actions = {} }) {
  const { getString } = useLocalization()

  let navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/${blockId}/view`)
  }, [navigate, blockId])

  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    icon_url = getImageUrl(block.properties.coverphoto)
  }
  const text = block.properties.text || getString('placeholder_main_headline')

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <span dir="auto" className={classes.title}>{text}</span>
    </div>
  </div>
}

export default ViewerPageLine