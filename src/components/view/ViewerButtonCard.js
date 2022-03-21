import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'
import { useLocalization } from '../../fluent/Localized.js'

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
    && block.properties.trigger
    && block.properties.action
    && block.properties.action.url
    && block.properties.trigger.type === 'click'
    && block.properties.action.type === 'open_url'
  ) {
    url = block.properties.action.url
  }

  const hasClickAction = actions.hasOwnProperty('click')

  if (hasClickAction === false && url !== '') {
    return <a href={url}>
      <button
        dir="auto"
        dangerouslySetInnerHTML={html}
        className="default square"
        style={{
          margin: '0',
          whiteSpace: 'pre-wrap',
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
    }}
  ></button>
}

export default ViewerButtonCard
