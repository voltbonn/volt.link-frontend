import { useState, useEffect } from 'react'

import classes from './CoverphotoPicker.module.css'

import {
  CircleSharp as CoverphotoIcon,
} from '@mui/icons-material'

import { withLocalization } from '../../fluent/Localized.js'

import ImagePicker from './ImagePicker.js'

const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

function CoverphotoPicker({ coverphotoValue, iconValue, onChange, className, style }) {

  const [coverphotoIsSet, setCoverphotoIsSet] = useState(false)

  const [type, setType] = useState(null)
  const [url, setUrl] = useState(null)
  const [fileId, setFileId] = useState(null)

  useEffect(() => {
    if (
      typeof coverphotoValue === 'object'
      && coverphotoValue !== null
      && !Array.isArray(coverphotoValue)
    ) {
      let newCoverphotoIsSet = false

      if (coverphotoValue.type === 'url' || coverphotoValue.type === 'file') {
        setType(coverphotoValue.type)
      } else {
        setType(null)
      }

      if (
        typeof coverphotoValue.url === 'string'
        && isAbsoluteUrlRegexp.test(coverphotoValue.url)
      ) {
        setUrl(coverphotoValue.url || '')

        if (coverphotoValue.type === 'url') {
          newCoverphotoIsSet = true
        }
      } else {
        setUrl(null)
      }

      if (
        typeof coverphotoValue.fileId === 'string'
        && coverphotoValue.fileId.length > 0
      ) {
        setFileId(coverphotoValue.fileId || '')

        if (coverphotoValue.type === 'file') {
          newCoverphotoIsSet = true
        }
      } else {
        setFileId(null)
      }

      setCoverphotoIsSet(newCoverphotoIsSet)
    }
  }, [coverphotoValue, setType, setUrl, setFileId, setCoverphotoIsSet])

  let iconIsSet = false

  if (
    typeof iconValue === 'object'
    && iconValue !== null
    && !Array.isArray(iconValue)
  ) {
    if (
      (
        iconValue.type === 'url'
        && typeof iconValue.url === 'string'
        && isAbsoluteUrlRegexp.test(iconValue.url)
      )
      || (
        iconValue.type === 'emoji'
        && typeof iconValue.emoji === 'string'
        && iconValue.emoji.lengh > 0
      )
      || (
        iconValue.type === 'file'
        && typeof iconValue.fileId === 'string'
        && iconValue.fileId.lengh > 0
      )
    ) {
      iconIsSet = true
    }
  }

  let imageUrl = ''
  if (type === 'url' && coverphotoIsSet && !!url) {
    imageUrl = `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=1400&h=400&url=${encodeURIComponent(url)})`
  } else if (type === 'file' && coverphotoIsSet && !!fileId) {
    imageUrl = `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=1400&h=400&id=${encodeURIComponent(fileId)})`
  }

  return <div
    className={`
      ${classes.root}
      ${iconIsSet ? classes.iconIsSet : classes.iconIsNotSet}
      ${coverphotoIsSet ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${className || ''}
    `}
    style={style}
  >
    <ImagePicker
      imageValue={coverphotoValue}
      onChange={onChange}
      types={['url', 'file']}
      trigger={(triggerProps) => (
        <div
          className={classes.coverphoto}
          style={{
            backgroundImage: imageUrl,
          }}
        >
          <div className={classes.button_wrapper}>
            <button {...triggerProps} className={`hasIcon ${coverphotoIsSet ? 'default' : 'text'} ${classes.changeCoverphotoButton}`}>
              <CoverphotoIcon className="icon" />
              <span style={{ marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle'}}>Set Coverphoto</span>
            </button>
          </div>
        </div>
      )}
    />
  </div>
}

export default withLocalization(CoverphotoPicker)



/*

import classes from './CoverphotoPicker.module.css'

// import { getImageUrl } from '../../functions.js'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'
import {
  RectangleSharp as CoverphotoIcon,
} from '@mui/icons-material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import MultiButton from '../MultiButton.js'
import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

import plakatschlange_thumb from '../../images/coverphotos/thumbs/20200912_Plakatschlange_Koeln_Matteo Sant_Unione_011.png'
import aktion_thumb from '../../images/coverphotos/thumbs/Aktion.png'
import volt_bonn_thumb from '../../images/coverphotos/thumbs/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.png'
import welcome_to_volt_thumb from '../../images/coverphotos/thumbs/Welcome-to-Volt.png'
import portugal_thumb from '../../images/coverphotos/thumbs/portugal.jpg'


function CoverphotoPicker({ getString, coverphotoValue, iconValue, onChange, className = '', style = {} }) {
  
  const onUrlChange = newUrl => {
    onChange({
      type: 'url',
      url: newUrl,
    })
  }

  const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

  // if (
  //   typeof coverphotoValue === 'object'
  //   && coverphotoValue !== null
  //   && !Array.isArray(coverphotoValue)
  // ) {
  //   if (coverphotoValue.type === 'url') {
  //     return coverphotoValue.url || ''
  //   }
  // }

  let coverphotoValueUrl = ''
  let coverphotoIsSet = false
  let iconIsSet = false

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
      coverphotoValueUrl = coverphotoValue.url || ''
    }
  }

  if (
    typeof iconValue === 'object'
    && iconValue !== null
    && !Array.isArray(iconValue)
  ) {
    if (
      (
        iconValue.type === 'url'
        && typeof iconValue.url === 'string'
        && isAbsoluteUrlRegexp.test(iconValue.url)
      )
      || (
        iconValue.type === 'emoji'
        && typeof iconValue.emoji === 'string'
        && iconValue.emoji.length > 0
      )
      || (
        iconValue.type === 'file'
        && typeof iconValue.fileId === 'string'
        && iconValue.fileId.length > 0
      )
    ) {
      iconIsSet = true
    }
  }

  return <div
    className={`
      ${classes.root}
      ${coverphotoIsSet ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${iconIsSet ? classes.iconIsSet : classes.iconIsNotSet}
      ${className}
    `}
    style={style}
  >
    <Popover
      trigger={(triggerProps) => (
        <div
          className={classes.coverphoto}
          style={{
            backgroundImage: coverphotoIsSet ? `url(${window.domains.backend}download_url?f=jpg&w=1400&h=400&url=${encodeURIComponent(coverphotoValue.url)})` : '',
          }}
        >
          <div className={classes.button_wrapper}>
            <button {...triggerProps} className={`hasIcon ${coverphotoIsSet ? 'default' : 'text'} ${classes.changeCoverphotoButton}`}>
              <CoverphotoIcon className="icon" />
              <span style={{ marginInlineStart: 'var(--basis_x2)', verticalAlign: 'middle'}}>Set Coverphoto</span>
            </button>
          </div>
        </div>
      )}
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
          <h3 style={{ marginTop: '0' }}><Localized id="path_editor_coverphoto_label" /></h3>

          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_coverphoto_info" />
          </em>

          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onChange={onUrlChange}
                defaultValue={coverphotoValueUrl}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: '100%'
                }}
              />
            )}
          </FancyInput>

          <MultiButton
            onChange={onUrlChange}
            ariaLabel={getString('path_editor_coverphoto_label')}
            defaultValue={coverphotoValueUrl}
            items={[
              {
                value: '',
                title: getString('path_editor_no_coverphoto'),
              },
              ...[
                {
                  value: 'https://assets.volteuropa.org/styles/scale_2880x/public/inline-images/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.jpg',
                  icon: volt_bonn_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2020-11/Welcome-to-Volt.jpg',
                  icon: welcome_to_volt_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-07/20200912_Plakatschlange_Ko%CC%88ln_Matteo%20Sant_Unione_011.jpeg',
                  icon: plakatschlange_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/2021-11/portugal.jpg',
                  icon: portugal_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Aktion.jpeg',
                  icon: aktion_thumb,
                },
                // 'https://www.volteuropa.org/stripes/hero-desktop-green.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-red.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-blue.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-yellow.jpg',
                // 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Colours-Background-Big.jpeg',
                // 'https://www.volteuropa.org/stripes/intermediate-green.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-red.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-blue.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-yellow.jpg',
                // 'https://www.volteuropa.org/og-default.png',
                // 'https://www.volteuropa.org/hero-default.jpg',
              ]
              .map(({value = '', icon = ''}) => ({
                value,
                icon: <img alt="" src={icon} className="icon image" />
              }))
            ]}
          />

          <hr />

          <button className="text" onClick={closePopover} style={{ margin: 0 }}>
            Close
          </button>
        </Paper>
      )}
    </Popover>
  </div>
}

export default withLocalization(CoverphotoPicker)
*/
