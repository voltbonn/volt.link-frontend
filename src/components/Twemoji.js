import React, { memo, useState, useEffect } from 'react'
import twemoji from 'twemoji'

const Twemoji = ({ className, style, emoji = '' }) => {
  const [html, setHtml] = useState({ __html: '' })

  useEffect(() => {
    if (typeof emoji === 'string' && emoji.length > 0) {
      const textWithHtml = twemoji.parse(emoji, {
        folder: 'svg',
        ext: '.svg',
        base: '/public/twemoji/assets/',
      })

      setHtml({ __html: textWithHtml })
    } else {
      setHtml({ __html: '' })
    }
  }, [emoji, setHtml])

  return <span
    className={className}
    style={{
      fontSize: 0,
      ...style,
    }}
    dangerouslySetInnerHTML={html}
  />
}

export default memo(Twemoji)
