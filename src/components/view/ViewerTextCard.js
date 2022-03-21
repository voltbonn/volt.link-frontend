import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'
import { useLocalization } from '../../fluent/Localized.js'

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
      ...style,
    },
  }

  let text_style = 'body'
  if (block.properties.hasOwnProperty('text_style')) {
    text_style = block.properties.text_style
  }

  let component = null
  switch (text_style) {
    case 'h1':
      component = <h1
        dangerouslySetInnerHTML={html}
        {...defaultProps}
      />
      break
    case 'h2':
      component = <h2
        dangerouslySetInnerHTML={html}
        {...defaultProps}
      />
      break
    case 'h3':
      component = <h3
        dangerouslySetInnerHTML={html}
        {...defaultProps}
      />
      break
    case 'caption':
      component = <caption
        dangerouslySetInnerHTML={html}
        {...defaultProps}
      />
      break
    default: // body
      component = <p
        dangerouslySetInnerHTML={html}
        {...defaultProps}
      />
  }

  return component
}

export default ViewerTextCard
