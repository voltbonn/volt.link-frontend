import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPersonCard.module.css'

function ViewerPersonCard ({ block, actions = {} }) {
  const { fluentByAny } = useLocalization()

  let navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/view/${blockId}`)
  }, [navigate, blockId])

  const icon_url = block.properties.icon || ''
  const text = fluentByAny(block.properties.text, '')

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className="clickable_card"
  >
    {
      icon_url === ''
        ? <PersonPlaceholderIcon className={classes.icon} />
        : <div className={classes.icon} style={{ backgroundImage: `url(${icon_url})` }} alt={text}></div>
    }
    <span className={classes.name} dir="auto">{text}</span>
  </div>
}

export default ViewerPersonCard
