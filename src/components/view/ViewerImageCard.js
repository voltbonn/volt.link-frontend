import { useState, useEffect } from 'react'

import { renderInlineMarkdown } from '../../markdown.js'
import { useLocalization } from '../../fluent/Localized.js'

function ViewerImageCard({ block, locales }) {
  const [html, setHtml] = useState({ __html: '' })

  const { translateBlock } = useLocalization()
  const text = translateBlock(block, locales, '')

  useEffect(() => {
    const textWithHtml = renderInlineMarkdown(text, { linkify: false })
    setHtml({ __html: textWithHtml })
  }, [text, setHtml])

  let image_url = ''
  if (
    block
    && block.properties
    && block.properties.coverphoto
    && block.properties.coverphoto.type
  ) {
    if (block.properties.coverphoto.type === 'url') {
      if (typeof block.properties.coverphoto.url === 'string' && block.properties.coverphoto.url.length > 0) {
        image_url = `${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=1000&h=1000&url=${encodeURIComponent(block.properties.coverphoto.url)}`
      }
    } else if (block.properties.coverphoto.type === 'file') {
      if (typeof block.properties.coverphoto.fileId === 'string' && block.properties.coverphoto.fileId.length > 0) {
        image_url = `${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=1000&h=1000&id=${encodeURIComponent(block.properties.coverphoto.fileId)}`
      }
    }
  }

  if (image_url !== '') {
    return <div>
      <img
        src={image_url}
        alt={text}
        title={text}
        style={{
          maxWidth: '100%',
          margin: '0 auto',
          display: 'block',
          boxShadow: 'inset 0 0 0 1px rgba(var(--on-background-rgb), var(--alpha-less))',
        }}
      />
      <div
        dir="auto"
        dangerouslySetInnerHTML={html}
        className="type_caption"
        style={{
          textAlign: 'center',
          marginTop: 'var(--basis_x0_5)',
        }}
      />
    </div>
  }

  return null
}

export default ViewerImageCard
