import { useLocalization } from '../../fluent/Localized.js'

import {
  InsertDriveFile as PagePlaceholderIcon,
} from '@mui/icons-material'

import classes from './ViewerPageCard.module.css'

function ViewerPageCard ({ block }) {
  const { fluentByAny, getString } = useLocalization()

  const icon_url = block.properties.icon || ''
  const text = fluentByAny(block.properties.text, getString('placeholder_main_headline'))
  const description = fluentByAny(block.properties.description, '')

  return <div>
    {
      icon_url === ''
        ? <PagePlaceholderIcon className={classes.icon} />
        : <div className={classes.icon} style={{ backgroundImage: `url(${icon_url})` }} alt={text}></div>
    }

    <span dir="auto" className={classes.title}>{text}</span>
    {description !== '' ? <p dir="auto">{description}</p> : null}
  </div>
}

export default ViewerPageCard
