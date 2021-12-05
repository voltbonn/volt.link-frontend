import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPersonCard.module.css'

function ViewerPersonCard ({ block, actions = {} }) {
  let navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/view/${blockId}`)
  }, [navigate, blockId])

  const icon_url = block.properties.icon || ''
  const text = block.properties.text || ''

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className="clickable_card"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    {
      icon_url === ''
        ? <PersonPlaceholderIcon className={classes.icon} />
        : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
    }
    <span className={classes.name} dir="auto">{text}</span>
  </div>
}

export default ViewerPersonCard
