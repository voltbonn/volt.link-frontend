import { useState, useEffect } from 'react'

import classes from './CoverphotoPicker.module.css'

import {
  RectangleSharp as CoverphotoIcon,
} from '@mui/icons-material'

import { withLocalization } from '../../fluent/Localized.js'

import ImagePicker from './ImagePicker.js'

import plakatschlange_thumb from '../../images/coverphotos/thumbs/20200912_Plakatschlange_Koeln_Matteo Sant_Unione_011.png'
import aktion_thumb from '../../images/coverphotos/thumbs/Aktion.png'
import volt_bonn_thumb from '../../images/coverphotos/thumbs/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.png'
import welcome_to_volt_thumb from '../../images/coverphotos/thumbs/Welcome-to-Volt.png'
import portugal_thumb from '../../images/coverphotos/thumbs/portugal.jpg'

const urlSuggestions = [
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

const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

function CoverphotoPicker({ coverphotoValue, iconValue, onChange, noPreview = false, className, style }) {

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

  let imageUrl = ''
    if (noPreview === false) {
    if (type === 'url' && coverphotoIsSet && !!url) {
      imageUrl = `url(${window.domains.storage}download_url?f=${window.imageFormat || 'jpg'}&w=1400&h=400&url=${encodeURIComponent(url)})`
    } else if (type === 'file' && coverphotoIsSet && !!fileId) {
      imageUrl = `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=1400&h=400&id=${encodeURIComponent(fileId)})`
    }
  }

  return <div
    className={`
      ${classes.root}
      ${iconIsSet ? classes.iconIsSet : classes.iconIsNotSet}
      ${(noPreview === false && coverphotoIsSet) ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${className || ''}
    `}
    style={style}
  >
    <ImagePicker
      imageValue={coverphotoValue}
      onChange={onChange}
      types={['url', 'file']}
      urlSuggestions={urlSuggestions}
      trigger={(triggerProps) => (
        <div
          className={classes.coverphoto}
          style={{
            backgroundImage: (noPreview === false ? imageUrl : ''),
          }}
        >
          <div className={classes.button_wrapper}>
            <button {...triggerProps} className={`hasIcon ${(noPreview === false && coverphotoIsSet) ? 'default' : 'text'} ${classes.changeCoverphotoButton}`}>
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
