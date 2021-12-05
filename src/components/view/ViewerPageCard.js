import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageCard.module.css'

function ViewerPageCard ({ block, actions = {} }) {
  const { getString } = useLocalization()

  let navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/view/${blockId}`)
  }, [navigate, blockId])

  const coverphoto_url = block.properties.coverphoto || ''
  const icon_url = block.properties.icon || ''
  const text = block.properties.text || getString('placeholder_main_headline')
  const description = block.properties.description || ''

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    {
      coverphoto_url === ''
        ? null
        : <div className={classes.coverphoto} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(coverphoto_url)})` }} alt={text}></div>
    }

    <div>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <span dir="auto" className={classes.title}>{text}</span>
      {description !== '' ? <p dir="auto">{description}</p> : null}
    </div>
  </div>
}

export default ViewerPageCard
