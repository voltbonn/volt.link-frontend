import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageLine.module.css'

function ViewerPageLine ({ block, actions = {} }) {
  const { fluentByAny, getString } = useLocalization()

  let navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/view/${blockId}`)
  }, [navigate, blockId])

  const icon_url = block.properties.icon || ''
  const text = fluentByAny(block.properties.text, getString('placeholder_main_headline'))

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <span dir="auto" className={classes.title}>{text}</span>
    </div>
  </div>
}

export default ViewerPageLine
