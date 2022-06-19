import { useState, useEffect } from 'react'

import Twemoji from '../Twemoji.js'

import classes from './IconPicker.module.css'

import {
  CircleSharp as IconIcon,
} from '@mui/icons-material'

import { withLocalization } from '../../fluent/Localized.js'

import ImagePicker from './ImagePicker.js'

const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

function IconPicker({ coverphotoValue, iconValue, onChange, className, style }) {

  const [iconIsSet, setIconIsSet] = useState(false)

  const [type, setType] = useState(null)
  const [url, setUrl] = useState(null)
  const [emoji, setEmoji] = useState(null)
  const [fileId, setFileId] = useState(null)

  useEffect(() => {
    if (
      typeof iconValue === 'object'
      && iconValue !== null
      && !Array.isArray(iconValue)
    ) {
      let newIconIsSet = false

      if (iconValue.type === 'url' || iconValue.type === 'emoji' || iconValue.type === 'file') {
        setType(iconValue.type)
      } else {
        setType(null)
      }

      if (
        typeof iconValue.url === 'string'
        && isAbsoluteUrlRegexp.test(iconValue.url)
      ) {
        setUrl(iconValue.url || '')

        if (iconValue.type === 'url') {
          newIconIsSet = true
        }
      } else {
        setUrl(null)
      }

      if (
        typeof iconValue.emoji === 'string'
        && iconValue.emoji.length > 0
      ) {
        setEmoji(iconValue.emoji || '')

        if (iconValue.type === 'emoji') {
          newIconIsSet = true
        }
      } else {
        setEmoji(null)
      }

      if (
        typeof iconValue.fileId === 'string'
        && iconValue.fileId.length > 0
      ) {
        setFileId(iconValue.fileId || '')

        if (iconValue.type === 'file') {
          newIconIsSet = true
        }
      } else {
        setFileId(null)
      }

      setIconIsSet(newIconIsSet)
    }
  }, [iconValue, setType, setUrl, setEmoji, setFileId, setIconIsSet])

  let coverphotoIsSet = false

  if (
    typeof coverphotoValue === 'object'
    && coverphotoValue !== null
    && !Array.isArray(coverphotoValue)
  ) {
    if (
      coverphotoValue.type === 'url'
      && typeof coverphotoValue.url === 'string'
      && isAbsoluteUrlRegexp.test(coverphotoValue.url)
    ) {
      coverphotoIsSet = true
    } else if (
      coverphotoValue.type === 'file'
      && typeof coverphotoValue.fileId === 'string'
      && coverphotoValue.fileId.lengh > 0
    ) {
      coverphotoIsSet = true
    }
  }

  return <div
    className={`
      ${classes.root}
      ${iconIsSet ? classes.iconIsSet : classes.iconIsNotSet}
      ${coverphotoIsSet ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${classes[`image_type_${type}`] || ''}
      ${className || ''}
    `}
    style={style}
  >
    <ImagePicker
      imageValue={iconValue}
      onChange={onChange}
      types={['url', 'emoji', 'file']}
      trigger={(triggerProps) => (
        <div className={classes.iconWrapper}>
          {
            type === 'url'
              ? <div
                className={classes.icon}
                style={{
                  backgroundImage: iconIsSet && !!url ? `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=400&h=400&url=${encodeURIComponent(url)})` : '',
                }}
              ></div>
              : null
          }
          {
            type === 'emoji'
              ? <div
                className={classes.icon}
              >
                <Twemoji emoji={emoji} className={classes.emojiWrapper} />
              </div>
              : null
          }
          {
            type === 'file'
              ? <div
                className={classes.icon}
                style={{
                  backgroundImage: iconIsSet && !!fileId ? `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=400&h=400&id=${encodeURIComponent(fileId)})` : '',
                }}
              ></div>
              : null
          }

          <button {...triggerProps} className={`hasIcon ${iconIsSet ? 'default' : 'text'} ${classes.changeIconButton}`}>
            <IconIcon className="icon" />
            <span style={{ marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle' }}>Set Icon</span>
          </button>
        </div>
      )}
    />
  </div>
}

export default withLocalization(IconPicker)
