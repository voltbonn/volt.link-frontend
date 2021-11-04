import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageCard.module.css'

function ViewerPageCard ({ block, actions = {} }) {
  const { fluentByAny, getString } = useLocalization()

  let history = useHistory()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    history.push(`/view/${blockId}`)
  }, [history, blockId])

  const coverphoto_url = block.properties.coverphoto || ''
  const icon_url = block.properties.icon || ''
  const text = fluentByAny(block.properties.text, getString('placeholder_main_headline'))
  const description = fluentByAny(block.properties.description, '')

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    {
      coverphoto_url === ''
        ? null
        : <div className={classes.coverphoto} style={{ backgroundImage: `url(${coverphoto_url})` }} alt={text}></div>
    }

    <div>
      {
        icon_url === ''
          ? <PagePlaceholderIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${icon_url})` }} alt={text}></div>
      }

      <span dir="auto" className={classes.title}>{text}</span>
      {description !== '' ? <p dir="auto">{description}</p> : null}
    </div>
  </div>
}

export default ViewerPageCard
