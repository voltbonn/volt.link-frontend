import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'

function ViewerHeadlineCard ({ block }) {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    const text = renderInlineMarkdown(block.properties.text)
    setHtml({ __html: text })
  }, [block, setHtml])

  return <h2
    dir="auto"
    dangerouslySetInnerHTML={html}
    style={{
      whiteSpace: 'pre-wrap',
    }}
  ></h2>
}

export default ViewerHeadlineCard
