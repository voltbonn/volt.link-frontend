import { useLocalization } from '../../fluent/Localized.js'

import {
  Face as PersonPlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPersonCard.module.css'

function ViewerPersonCard ({ block }) {
  const { fluentByAny } = useLocalization()

  const icon_url = block.properties.icon || ''
  const text = fluentByAny(block.properties.text, '')

  return <p>
    {
      icon_url === ''
        ? <PersonPlaceholderIcon className={classes.icon} />
        : <div className={classes.icon} style={{ backgroundImage: `url(${icon_url})` }} alt={text}></div>
    }
    <span className={classes.name} dir="auto">{text}</span>
  </p>
}

export default ViewerPersonCard
