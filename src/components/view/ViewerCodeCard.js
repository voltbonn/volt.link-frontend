import { useState, useEffect } from 'react'

function ViewerCodeCard({ block, style }) {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    setHtml({ __html: block.properties.text })
  }, [block.properties.text, setHtml])

  return <div style={style} dangerouslySetInnerHTML={html}></div>
}

export default ViewerCodeCard
