import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'
import { useLocalization } from '../../fluent/Localized.js'

import { getBlockColor } from '../../functions.js'

import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material'

function ViewerTextCard ({ block, style, locales }) {
  const [html, setHtml] = useState({ __html: '' })

  const { translateBlock } = useLocalization()
  const text = translateBlock(block, locales, '')

  useEffect(() => {
    const textWithHtml = renderInlineMarkdown(text)
    setHtml({ __html: textWithHtml })
  }, [text, setHtml])
  
  const defaultProps = {
    dir: 'auto',
    style: {
      whiteSpace: 'pre-wrap',
      display: 'flex',
      ...style,
    },
  }

  const {
    color,
  } = getBlockColor(block)
  if (color) {
    defaultProps.style.color = color
  }

  let text_style = 'body'
  if (block.properties.hasOwnProperty('text_style')) {
    text_style = block.properties.text_style
  }


  const {
    text_decorations = [],
    checked,
  } = (block || {}).properties || {}

  const prefixs = []
  if (text_decorations.includes('checkbox')) {
    const iconProps = {
      key: 'checkbox',
      style: {
        margin: 'var(--basis_x0_2) var(--basis) 0 0',
        height: 'var(--prefix-icon-size)',
        width: 'var(--prefix-icon-size)',
      }
    }

    if (checked) {
      prefixs.push(<CheckBoxIcon {...iconProps} />)
    } else {
      prefixs.push(<CheckBoxOutlineBlankIcon {...iconProps} />)
    }
  }

  const text_content = <span dangerouslySetInnerHTML={html}></span>



  let component = null
  switch (text_style) {
    case 'h1':
      component = <a href={`#${block._id}`} id={block._id}>
        <h1
          {...defaultProps}
        >
          {prefixs}
          {text_content}
        </h1>
      </a>
      break
    case 'h2':
      component = <a href={`#${block._id}`} id={block._id}>
        <h2
          {...defaultProps}
          id={block._id}
        >
          {prefixs}
          {text_content}
        </h2>
      </a>
      break
    case 'h3':
      component = <a href={`#${block._id}`} id={block._id}>
        <h3
          {...defaultProps}
          id={block._id}
        >
          {prefixs}
          {text_content}
        </h3>
      </a>
      break
    case 'caption':
      component = <caption
        {...defaultProps}
      >
        {prefixs}
        {text_content}
      </caption>
      break
    default: // body
      component = <p
        {...defaultProps}
      >
        {prefixs}
        {text_content}
      </p>
  }

  return <div style={{
    display: 'flex',
  }}>
    {component}
  </div>
}

export default ViewerTextCard
