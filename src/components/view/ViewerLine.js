import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl, getBlockColor } from '../../functions.js'
import useBlockTrigger from '../../hooks/useBlockTrigger.js'
import Twemoji from '../Twemoji.js'

import {
  InsertDriveFile as PageIcon,
  Face as PersonIcon,
  LinkSharp as RedirectIcon,
} from '@mui/icons-material'

import { Link } from 'react-router-dom'

import classes from './ViewerLine.module.css'

function ViewerLine({ block, clickable = true, onClick, locales, forceId }) {
  const { getString, translateBlock, userLocales } = useLocalization()

  const properties = block.properties || {}
  
  const { link, path } = useBlockTrigger({ block, forceId })

  let title = translateBlock(block, locales || userLocales, '')
  if (title === '') {
    const slug = properties.slug || ''

    if (typeof slug === 'string' && slug.length !== '') {
      title = '/'+slug
    } else {
      title = getString('placeholder_main_headline')
    }
  }
  
  let iconComponent = null

  if (
    // TODO: is the check overkill ? 😅
    properties.hasOwnProperty('icon')
    && typeof properties.icon === 'object'
    && properties.icon !== null
    && !Array.isArray(properties.icon)
    && properties.icon.hasOwnProperty('type')
    && typeof properties.icon.type === 'string'
    && properties.icon.type === 'emoji'
    && properties.icon.hasOwnProperty('emoji')
    && typeof properties.icon.emoji === 'string'
    && properties.icon.emoji.length !== 0
  ) {
    iconComponent = <Twemoji className={classes.icon} emoji={properties.icon.emoji} /> 
  }

  if (iconComponent === null) {
    let isSquareIcon = false
    let icon_url = getImageUrl(properties.icon)
    
    if (!icon_url) {
      // coverphoto fallback
      isSquareIcon = true
      icon_url = getImageUrl(properties.coverphoto)
    }

    if (typeof icon_url === 'string' && icon_url.length !== 0) {
      iconComponent = <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={title}></div>
    }
  }

  if (iconComponent === null) {
    switch (block.type) {
      case 'person':
        iconComponent = <PersonIcon className={classes.icon} />
        break
      case 'redirect':
        iconComponent = <RedirectIcon className={classes.icon} />
        break
      default:
      iconComponent = <PageIcon className={classes.icon} />
    }    
  }



  let cardLink = path || link

  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  const onClickProps = {}
  if (typeof onClick === 'function') {
    onClickProps.onClick = onClick
  }
  
  if (clickable === true && typeof cardLink === 'string' && cardLink.length > 0) {
    if (cardLink.includes(':')) {
      return <a
        href={cardLink}
        target="_blank" rel="noreferrer"
        title={title}
        className={`clickable_card ${classes.root}`}
        style={{
          display: 'block',
          cursor: 'pointer',
          color,
          '--on-background-rgb': colorRGB,
        }}
        {...onClickProps}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {iconComponent}
          <span dir="auto" className={classes.title}>{title}</span>
        </div>
      </a>
    } else {
      return <Link
        to={cardLink}
        title={title}
        className={`clickable_card ${classes.root}`}
        style={{
          display: 'block',
          cursor: 'pointer',
          color,
          '--on-background-rgb': colorRGB,
        }}
        {...onClickProps}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {iconComponent}
          <span dir="auto" className={classes.title}>{title}</span>
        </div>
      </Link>
    }
  }

  return <div
    title={title}
    className={`clickable_card ${classes.root}`}
    style={{
      cursor: 'auto',
      color,
      '--on-background-rgb': colorRGB,
    }}
    {...onClickProps}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {iconComponent}
      <span dir="auto" className={classes.title}>{title}</span>
    </div>
  </div>
}

export default ViewerLine
