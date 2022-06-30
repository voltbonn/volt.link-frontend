
import {
  InsertDriveFile as PageIcon,
  Face as PersonIcon,
  LinkSharp as RedirectIcon,
  PublicSharp as WebsiteIcon,
} from '@mui/icons-material'

import Twemoji from '../Twemoji.js'

import { getImageUrl } from '../../functions.js'

import classes from './BlockIcon.module.css'

export default function BlockIcon({ block, style = {}, className = '', ...props }) {
  const properties = block.properties || {}

  let iconComponent = null
  let isSquareIcon = false

  if (
    properties.hasOwnProperty('icon')
    && typeof properties.icon === 'object'
    && properties.icon !== null
    && !Array.isArray(properties.icon)
    && properties.icon.hasOwnProperty('type')
    && typeof properties.icon.type === 'string'
  ) {

    if (
      properties.icon.type === 'emoji'
      && properties.icon.hasOwnProperty('emoji')
      && typeof properties.icon.emoji === 'string'
      && properties.icon.emoji.length !== 0
    ) {
      iconComponent = <Twemoji
        {...props}
        style={style}
        key={properties.icon.emoji}
        className={`${classes.icon} ${className}`}
        emoji={properties.icon.emoji}
      />
    }

    if (
      iconComponent === null
      && properties.icon.type === 'file'
      && properties.icon.hasOwnProperty('fileId')
      && typeof properties.icon.fileId === 'string'
      && properties.icon.fileId.length !== 0
    ) {
      const fileId = properties.icon.fileId
      iconComponent = <div
        {...props}
        className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round} ${className}`}
        style={{
          ...style,
          backgroundImage: `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=40&h=40&id=${encodeURIComponent(fileId)})`
        }}
        alt=""
      />
    }
  }

  if (iconComponent === null) {
    let icon_url = getImageUrl(properties.icon)

    if (!icon_url) {
      // coverphoto fallback
      isSquareIcon = true
      icon_url = getImageUrl(properties.coverphoto)
    }

    if (typeof icon_url === 'string' && icon_url.length !== 0) {
      iconComponent = <div
        {...props}
        className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round} ${className}`}
        style={{ ...style, backgroundImage: `url(${window.domains.storage}download_url?f=${window.imageFormat || 'jpg'}&w=40&h=40&url=${encodeURIComponent(icon_url)})` }}
        alt=""
      />
    }
  }


  if (iconComponent === null) {
    switch (block.type) {
      case 'person':
        iconComponent = <PersonIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'redirect':
        iconComponent = <RedirectIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'website':
        iconComponent = <WebsiteIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      default:
        iconComponent = <PageIcon {...props} style={style} className={`${classes.icon} ${className}`} />
    }
  }

  return iconComponent
}
