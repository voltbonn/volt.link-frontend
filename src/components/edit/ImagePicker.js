import { useState, useEffect, useCallback } from 'react'

import EmojiPicker from 'emoji-picker-react'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

import StorageFileInput from './StorageFileInput.js'

import MultiButton from '../MultiButton.js'

const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

function ImagePicker({ getString, trigger, types = ['url', 'emoji', 'file'], urlSuggestions = [], imageValue, onChange }) {

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
      typeof imageValue === 'object'
      && imageValue !== null
      && !Array.isArray(imageValue)
    ) {
      if (imageValue.type === 'url' || imageValue.type === 'emoji' || imageValue.type === 'file') {
        if (types.includes(imageValue.type)) {
          setType(imageValue.type)
        } else {
          setType(null)
        }
      } else {
        setType(null)
      }

      if (
        typeof imageValue.url === 'string'
        && isAbsoluteUrlRegexp.test(imageValue.url)
      ) {
        setUrl(imageValue.url || '')
      } else {
        setUrl(null)
      }

      if (
        typeof imageValue.emoji === 'string'
        && imageValue.emoji.length > 0
      ) {
        setEmoji(imageValue.emoji || '')
      } else {
        setEmoji(null)
      }

      if (
        typeof imageValue.fileId === 'string'
        && imageValue.fileId.length > 0
      ) {
        setFileId(imageValue.fileId || '')
      } else {
        setFileId(null)
      }
    }
  }, [imageValue, types, setType, setUrl, setEmoji, setFileId])

  return <Popover trigger={trigger}>
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
            No Image
          </button>
          <button
            style={{ display: types.includes('emoji') ? 'inline-block' : 'none' }}
            className={type === 'emoji' ? 'default' : 'text'}
            onClick={() => handleTypeChange('emoji')}
          >
            Emoji
          </button>
          <button
            style={{ display: types.includes('url') ? 'inline-block' : 'none' }}
            className={type === 'url' ? 'default' : 'text'}
            onClick={() => handleTypeChange('url')}
          >
            Url
          </button>
          <button
            style={{ display: types.includes('file') ? 'inline-block' : 'none' }}
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

          {
            urlSuggestions.length > 0
            ? <MultiButton
                onChange={handleUrlChange}
                ariaLabel={getString('path_editor_coverphoto_label')}
                defaultValue={url}
                items={
                  urlSuggestions
                  .map(({ value = '', icon = '' }) => ({
                    value,
                    icon: <img alt="" src={icon} className="icon image" />
                  }))
                }
              />
            : null
          }

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
}

export default withLocalization(ImagePicker)
