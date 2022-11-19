
import {
  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon, // Face
  Crop75Sharp as ButtonIcon,
  NotesSharp as TextIcon,
  Remove as DividerIcon,
  CodeSharp as CodeIcon,
  CheckBoxSharp as CheckboxIcon,
  // EditSharp as EditIcon,
  ImageSharp as ImageIcon,
  WebStoriesSharp as PosterIcon, // WebStories book bookmark ContactPage CropPortrait Layers Note PhotoAlbum Photo ViewCarousel
  AbcSharp as DefinitionIcon,
  PublicSharp as WebsiteIcon,
} from '@mui/icons-material'

import Twemoji from '../Twemoji.js'

import { getImageUrl, getBlockColor } from '../../functions.js'

import classes from './BlockIcon.module.css'

export default function BlockIcon({
  block,
  style = {},
  className = '',
  size = 40,
  ...props
}) {
  const type = block?.type || 'page'
  const properties = block.properties || {}

  let iconComponent = null
  let isSquareIcon = false
  const canBeIcon = type !== 'poster' && type !== 'image'

  let contentAsPlaintext = block?.computed?.contentAsPlaintext || null
  const hasContent = typeof contentAsPlaintext === 'string' && contentAsPlaintext.length > 0

  const coverphotoPropertyValue = (
    type === 'file'
      ? {
        type: 'file',
        fileId: block._id,
      }
      : properties?.coverphoto || null
   )
  const coverphotoUrl = getImageUrl(coverphotoPropertyValue, { width: size, height: size })
  const hasCoverphoto = typeof coverphotoUrl === 'string' && coverphotoUrl.length > 1

  if (
    canBeIcon
    && properties.hasOwnProperty('icon')
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
          backgroundImage: `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=${size}&h=${size}&id=${encodeURIComponent(fileId)})`
        }}
        alt=""
      />
    }
  }

  if (iconComponent === null) {
    let icon_url = canBeIcon ? getImageUrl(properties.icon, { width: size, height: size }) : null

    if (!icon_url && !hasContent && hasCoverphoto) {
      // coverphoto fallback
      isSquareIcon = true
      icon_url = coverphotoUrl
    }

    if (typeof icon_url === 'string' && icon_url.length !== 0) {
      iconComponent = <div
        {...props}
        className={`${classes.icon} ${isSquareIcon ? classes.square : classes.round} ${className}`}
        style={{
          ...style,
          backgroundImage: `url(${icon_url})`,
          backgroundSize: 'poster image file'.split(' ').includes(type) ? 'contain' : 'cover',
        }}
        alt=""
      />
    }
  }

  if (
    iconComponent === null
    && hasContent
    && !(type === 'poster' || type === 'image')
  ) {
    let text = block?.properties?.text || null
    const hasText = typeof text === 'string' && text.length !== ''

    const {
      color,
      contrastingColor,
    } = getBlockColor(block)

    let lines = []

    if (hasCoverphoto) {
      lines.push(<div
        className={classes.coverphoto}
        // style={{
        //   backgroundImage: `url(${coverphotoUrl})`,
        // }}
      />)
    }

    if (hasText) {
      lines.push(<div>{
        text
          .replace(/[^\s]/gm, '█')
          .replace(/ /gm, '     ')
      }</div>)
    }

    if (hasContent) {
      const maxTextLength = 500

      if (contentAsPlaintext.length > maxTextLength) {
        contentAsPlaintext = contentAsPlaintext.slice(0, maxTextLength)
      }

      contentAsPlaintext = contentAsPlaintext
        .replace(/[^\s]/gm, '█') // █ ▓ ▒ ░
        .replace(/ /gm, '     ')

      lines = lines
        .concat(
          contentAsPlaintext
            .split('\n')
            .map(line => <div>{line}</div>)
        )
    }

    iconComponent = <div
      {...props}
      className={`${classes.icon} ${classes.text_document} ${className}`}
      style={{
        ...style,
        background: color,
        color: contrastingColor,
      }}
    >
      {lines}
    </div>
  }

  if (iconComponent === null) {
    switch (block.type) {
      case 'button':
        iconComponent = <ButtonIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'checkbox':
        iconComponent = <CheckboxIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'divider':
        iconComponent = <DividerIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'code':
        iconComponent = <CodeIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'image':
        iconComponent = <ImageIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'text':
        iconComponent = <TextIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'person':
        iconComponent = <PersonIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'redirect':
        iconComponent = <RedirectIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'website':
        iconComponent = <WebsiteIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'poster':
        iconComponent = <PosterIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      case 'definition':
        iconComponent = <DefinitionIcon {...props} style={style} className={`${classes.icon} ${className}`} />
        break
      default:
        iconComponent = <PageIcon {...props} style={style} className={`${classes.icon} ${className}`} />
    }
  }

  return iconComponent
}
