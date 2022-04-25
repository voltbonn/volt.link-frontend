import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'
import { useLocalization } from '../../fluent/Localized.js'
import { getBlockColor } from '../../functions.js'

function ViewerButtonCard ({ block, actions = {}, locales }) {
  const [html, setHtml] = useState({ __html: '' })

  const { getString, translateBlock } = useLocalization()
  const text = translateBlock(block, locales, getString('placeholder_main_headline'))

  useEffect(() => {
    const textWithHtml = renderInlineMarkdown(text, { linkify: false })
    setHtml({ __html: textWithHtml })
  }, [text, setHtml])

  let url = ''
  if (
    block
    && block.properties
    && block.properties.url
  ) {
    url = block.properties.url
  }

  const {
    color,
    contrastingColor,
  } = getBlockColor(block)

  const colorStyles = {}
  if (color) {
    colorStyles['--button-background'] = color
    colorStyles['--button-color'] = contrastingColor
  }

  const hasClickAction = actions.hasOwnProperty('click')

  if (hasClickAction === false && url !== '') {
    return <a
        href={url}
        target="_blank" rel="noreferrer"
      >
      <button
        dir="auto"
        dangerouslySetInnerHTML={html}
        className="default square"
        style={{
          margin: '0',
          whiteSpace: 'pre-wrap',
          ...colorStyles,
        }}
      ></button>
    </a>
  }

  if (hasClickAction === true && typeof actions.click === 'function') {
    return <button
      dir="auto"
      dangerouslySetInnerHTML={html}
      className="default square"
      style={{
        margin: '0',
        whiteSpace: 'pre-wrap',
        ...colorStyles,
      }}
      onClick={actions.click}
    ></button>
  }

  return <button
    dir="auto"
    dangerouslySetInnerHTML={html}
    disabled="disabled"
    className="default square"
    style={{
      margin: '0',
      whiteSpace: 'pre-wrap',
      ...colorStyles,
    }}
  ></button>
}

export default ViewerButtonCard
