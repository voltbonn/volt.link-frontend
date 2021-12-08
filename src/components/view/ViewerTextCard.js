import { useState, useEffect } from 'react'

function ViewerTextCard ({ block }) {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    let text = block.properties.text || ''
    text = text.replace(/\n/g, '<br>')
    // text = text.replace(/\t/g, '&emsp;')

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
