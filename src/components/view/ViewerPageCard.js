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
    navigate(`/${blockId}/view`)
  }, [navigate, blockId])

  const coverphoto_url = getImageUrl(block.properties.coverphoto)
  const icon_url = getImageUrl(block.properties.icon)
  const text = block.properties.text || getString('placeholder_main_headline')

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className="clickable_card"
  >
    {
      coverphoto_url === ''
        ? null
        : <div className={classes.coverphoto} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(coverphoto_url)})` }} alt={text}></div>
    }

    <div className="type_p" style={{ margin: '0' }}>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <span dir="auto" className={`${classes.title}`}>{text}</span>
    </div>
  </div>
}

export default ViewerPageCard
