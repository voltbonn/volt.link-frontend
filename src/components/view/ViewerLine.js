import { useLocalization } from '../../fluent/Localized.js'

import { getImageUrl, getBlockColor } from '../../functions.js'
import useBlockTrigger from '../../hooks/useBlockTrigger.js'

import {
  InsertDriveFile as PageIcon,
  Face as PersonIcon,
  LinkSharp as RedirectIcon,
} from '@mui/icons-material'

import { Link } from 'react-router-dom'

import classes from './ViewerLine.module.css'

function ViewerLine ({ block, actions = {}, locales }) {
  const { getString, translateBlock, userLocales } = useLocalization()

  const { link, path } = useBlockTrigger({ block })

  let title = translateBlock(block, locales || userLocales, '')
  if (title === '') {
    const slug = (block.properties || {}).slug || ''

    if (typeof slug === 'string' && slug.length !== '') {
      title = '/'+slug
    } else {
      title = getString('placeholder_main_headline')
    }
  }
  
  let isSquareIcon = false
  let icon_url = getImageUrl(block.properties.icon)
  if (!icon_url) {
    isSquareIcon = true
    icon_url = getImageUrl(block.properties.coverphoto)
  }

  let iconComponent = null
  if (icon_url === '') {
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
  } else {
    iconComponent = <div className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round}`} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={title}></div>
  }



  let cardOnClick = null
  let cardLink = path || link

  if (actions.hasOwnProperty('link')) {
    if (typeof actions.link === 'string') {
      cardLink = actions.link
    }
  } else if (actions.hasOwnProperty('click')) {
    if (typeof actions.click === 'function') {
      cardOnClick = actions.click
    }
  }

  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  if (typeof cardLink === 'string' && cardLink.length > 0) {
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
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {iconComponent}
        <span dir="auto" className={classes.title}>{title}</span>
      </div>
    </Link>
    }
  } else {
    const onClickProps = {}
    if (typeof cardOnClick === 'function') {
      onClickProps.onClick = cardOnClick
    }

    return <div
      {...onClickProps}
      title={title}
      className={`clickable_card ${classes.root}`}
      style={{
        cursor: typeof cardOnClick === 'function' ? 'pointer' : 'auto',
        color,
        '--on-background-rgb': colorRGB,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {iconComponent}
        <span dir="auto" className={classes.title}>{title}</span>
      </div>
    </div>
  }
}

export default ViewerLine
