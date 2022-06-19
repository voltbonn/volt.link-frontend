import { useState, useEffect, useCallback } from 'react'

import Twemoji from '../Twemoji.js'
import EmojiPicker from 'emoji-picker-react'

import classes from './IconPicker.module.css'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'
import {
  CircleSharp as IconIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

import StorageFileInput from './StorageFileInput.js'

const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

function IconPicker({ coverphotoValue, iconValue, onChange, className, style }) {

  const [iconIsSet, setIconIsSet] = useState(false)

  const [type, setType] = useState(null)
  const [url, setUrl] = useState(null)
  const [emoji, setEmoji] = useState(null)
  const [fileId, setFileId] = useState(null)

  const handleEmojiChange = useCallback((event, emojiObject) => {
    const newEmoji = emojiObject.emoji || null
    setEmoji(newEmoji)
    onChange({ type, url, emoji: newEmoji, fileId })
  }, [onChange, type, url, fileId])

  const handleTypeChange = useCallback(newType => {
    setType(newType)
    onChange({ type: newType, url, emoji, fileId })
  }, [onChange, url, emoji, fileId])

  const handleUrlChange = useCallback(newUrl => {
    setUrl(newUrl)
    onChange({ type, url: newUrl, emoji, fileId })
  }, [onChange, type, emoji, fileId])

  const handleFileChange = useCallback(newFileId => {
    setFileId(newFileId)
    onChange({ type, url, emoji, fileId: newFileId })
  }, [onChange, type, url, emoji])

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
      ${classes[`icon_type_${type}`]}
      ${className || ''}
    `}
    style={style}
  >
    <Popover
      trigger={(triggerProps) => (<div className={classes.iconWrapper}>
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
          <span style={{ marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle'}}>Set Icon</span>
        </button>
      </div>)}
    >
      {({closePopover, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 'calc(calc(100vw - 32px) - var(--basis_x8))',
            maxHeight: 'calc(calc(100vh - 32px) - var(--basis_x8))',
            overflow: 'auto',
            padding: 'var(--basis_x4)',
            background: 'var(--background-contrast)',
            color: 'var(--on-background)',
          }}
          elevation={8}
        >
          {/* <h3 style={{ marginTop: '0' }}><Localized id="path_editor_icon_label" /></h3> */}

          <div>
            <button
              className={type !== 'emoji' && type !== 'url' && type !== 'file' ? 'default' : 'text'}
              onClick={() => handleTypeChange(null)}
            >
              No Icon
            </button>
            <button
              className={type === 'emoji' ? 'default' : 'text'}
              onClick={() => handleTypeChange('emoji')}
            >
              Emoji
            </button>
            <button
              className={type === 'url' ? 'default' : 'text'}
              onClick={() => handleTypeChange('url')}
            >
              Url
            </button>
            <button
              className={type === 'file' ? 'default' : 'text'}
              onClick={() => handleTypeChange('file')}
            >
              File
            </button>
          </div>

          <div style={{ display: (type === 'url' ? 'block' : 'none') }}>
            <hr />

            <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
              <Localized id="path_editor_icon_url_info" />
            </em>

            <FancyInput>
              {({ setError }) => (
                <UrlInput
                  onError={setError}
                  onBlur={handleUrlChange}
                  defaultValue={url}
                  style={{
                    marginRight: '0',
                    marginLeft: '0',
                    width: '100%'
                  }}
                />
              )}
            </FancyInput>

            <hr />
          </div>

          <div style={{ display: (type === 'emoji' ? 'block' : 'none') }}>                
            <EmojiPicker
              native={true}
              onEmojiClick={handleEmojiChange}
              searchPlaceholder="Search for an emoji…"
              disableAutoFocus={true}
              pickerStyle={{
                boxShadow: 'none',
                border: '0',
                borderRadius: '4px',
                // margin: 'var(--basis_x2) calc(-1 * var(--basis_x4))',
                margin: 'var(--basis_x4) 0',
                width: '330px',
                height: '400px',
              }}
            />
          </div>

          <div style={{ display: (type === 'file' ? 'block' : 'none') }}>
            <hr />

            <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
              <Localized id="path_editor_icon_file_info" />
            </em>

            <div>
              <FancyInput>
                {({ setError }) => <StorageFileInput onChange={handleFileChange} onError={setError} style={{ margin: '0' }} />}
              </FancyInput>

              {
                typeof fileId === 'string' && fileId.length > 0
                  ? <img src={`${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=40&h=40&id=${encodeURIComponent(fileId)}`} alt="Icon preview." width="40" style={{ marginTop: 'var(--basis)' }} />
                  : null
              }
            </div>

            <hr />
          </div>

          {
            type !== 'emoji' && type !== 'url' && type !== 'file'
            ? <hr />
            : null
          }

          <button className="text" onClick={closePopover} style={{ margin: 0 }}>
            Close
          </button>
        </Paper>
      )}
    </Popover>
  </div>
}

export default withLocalization(IconPicker)
