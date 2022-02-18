import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'

function ViewerButtonCard ({ block, actions = {} }) {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    const text = renderInlineMarkdown(block.properties.text)
    setHtml({ __html: text })
  }, [block, setHtml])

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

  if (hasClickAction === true) {
    return <button
      dir="auto"
      dangerouslySetInnerHTML={html}
      disabled="disabled"
      className="default square"
      style={{
        margin: '0',
        whiteSpace: 'pre-wrap',
      }}
      onClick={actions.onclick}
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
