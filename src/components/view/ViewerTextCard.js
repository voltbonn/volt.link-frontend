import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'

function ViewerTextCard ({ block }) {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    const text = renderInlineMarkdown(block.properties.text)
    setHtml({ __html: text })
  }, [block, setHtml])

  return <p
    dir="auto"
    dangerouslySetInnerHTML={html}
    style={{
      whiteSpace: 'pre-wrap',
    }}
  ></p>
}

export default ViewerTextCard
