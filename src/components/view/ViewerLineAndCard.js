import { useLocalization } from '../../fluent/Localized.js'

import { getBlockColor } from '../../functions.js'
import useBlockTrigger from '../../hooks/useBlockTrigger.js'

import { Link } from 'react-router-dom'

import classes from './ViewerLineAndCard.module.css'
import BlockIcon from './BlockIcon.js'

import { renderInlineMarkdown } from '../../markdown.js'

function toSimpleIsoString(date) {
  let simpleIsoString = date.toISOString()
    .replace('T', ' ')
    .replace(/(:[^:]*?)$/, '')

  return simpleIsoString
}

function ViewerLineAndCard({
  block,
  clickable = true,
  onClick,
  locales,
  forceId,
  pathSuffix,
  size = 'line',
}) {
  const { getString, translateBlock, userLocales } = useLocalization()

  const type = block?.type || 'unknown'
  const properties = block.properties || {}
  const slug = properties.slug || ''

  const { link, path } = useBlockTrigger({ block, forceId, pathSuffix })

  let title = translateBlock(block, locales || userLocales, '')

  let additionalInfos = []
  if (type === 'page' || type === 'redirect' || type === 'person') {
    if (title === '' && typeof slug === 'string' && slug !== '') {
      additionalInfos.push(<div importance="less" key="slug">{'/' + slug}</div>)
    }
  } else if (type === 'website') {
    if (properties.hasOwnProperty('url') && typeof properties.url === 'string' && properties.url.length > 0) {
      additionalInfos.push(<div key="url" style={{ fontSize: 'calc(0.6 * var(--body-font-size))', margin: 'var(--basis_x0_5) 0' }}><em>{properties.url}</em></div>)
    }
    if (properties.hasOwnProperty('description') && typeof properties.description === 'string' && properties.description.length > 0) {
      additionalInfos.push(<div importance="less" key="description">{properties.description}</div>)
    }
  } else if (type === 'apikey') {
    if (properties.hasOwnProperty('nbf') && properties.hasOwnProperty('exp')) {
      // display date range of validity
      const nbf = new Date(properties.nbf)
      const exp = new Date(properties.exp)
      additionalInfos.push(<div key="nbf_and_exp">{getString('apikey_validity', { from: toSimpleIsoString(nbf), to: toSimpleIsoString(exp) })}</div>)
    } else if (properties.hasOwnProperty('nbf')) {
      // display start date of validity
      const nbf = new Date(properties.nbf)
      additionalInfos.push(<div key="nbf">{getString('apikey_validity_from', { from: toSimpleIsoString(nbf) })}</div>)
    } else if (properties.hasOwnProperty('exp')) {
      // display end date of validity
      const exp = new Date(properties.exp)
      additionalInfos.push(<div key="exp">{getString('apikey_validity_to', { to: toSimpleIsoString(exp) })}</div>)
    }
  }
  
  let contentPreviewText = null
  if (type === 'page' || type === 'person' || type === 'poster' || type === 'definition') {
    let contentAsPlaintext = block?.computed?.contentAsPlaintext || null

    if (typeof contentAsPlaintext === 'string' && contentAsPlaintext.length > 0) {
      const maxTextLength = 200
      const maxLines = 2

      contentAsPlaintext = contentAsPlaintext
        .replace(/[\r\n]+/g, '\n') // remove double line breaks

      if (contentAsPlaintext.length > maxTextLength) {
        contentAsPlaintext = contentAsPlaintext.slice(0, maxTextLength) + '…'
      }

      contentAsPlaintext = contentAsPlaintext
        .split('\n')

      if (contentAsPlaintext.length > maxLines) {
        contentAsPlaintext = contentAsPlaintext.slice(0, maxLines)
        contentAsPlaintext.push('…')
      }

      contentPreviewText = contentAsPlaintext.join('\n')

      if (size !== 'icon') {
        const contentAsPlaintextWithRenderedMarkdown = {
          __html: renderInlineMarkdown(contentAsPlaintext.join('\n'))
        }

        additionalInfos.push(<div
          key="contentAsPlaintext"
          importance="more"
          dir="auto"
          dangerouslySetInnerHTML={contentAsPlaintextWithRenderedMarkdown}
          style={{
            whiteSpace: 'pre-wrap',
          }}
        ></div>)
      }
    }
  }

  if (type === 'website') {
    if (properties.hasOwnProperty('tags') && Array.isArray(properties.tags)) {
      const tags = [...new Set(properties.tags)] // remove duplicats
        .filter(tag => typeof tag === 'string' && tag.length > 0) // only keep strings
        .map(tag => <span className={classes.tag} key={tag}>{tag}</span>) // display nicely

      additionalInfos.push(<div key="tags" style={{ margin: 'var(--basis_x0_5) calc(-1 * var(--basis_x0_5))' }}>{tags}</div>)
    }
  }

  if (title === '' && additionalInfos.length === 0) {
    title = getString('placeholder_headline_empty')
  }

  if (size === 'line') {
    if (title !== '') {
      additionalInfos = []
    } else if (additionalInfos.length === 0) {
      additionalInfos = [additionalInfos[0]]
    }
  }

  const content = <>
    <BlockIcon
      className={classes.icon}
      block={block}
      size={size === 'icon' ? 140 : 40}
    />
    <div className={classes.content}>
      <div dir="auto" className={classes.title}>
        {title}
      </div>
      {
        additionalInfos.length > 0
          ? <div dir="auto" className={classes.additionalInfos}>
            {additionalInfos}
          </div>
          : null
      }
    </div>
  </>



  let cardLink = path || link

  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  const onClickProps = {}
  if (typeof onClick === 'function') {
    onClickProps.onClick = onClick
  }

  let hoverTitlePreviewText = ''
  if (
    typeof title === 'string' && title !== '' &&
    typeof contentPreviewText === 'string' && contentPreviewText !== ''
  ) {
    hoverTitlePreviewText = `${title}\n\n${contentPreviewText}`
  } else if (typeof title === 'string' && title !== '') {
    hoverTitlePreviewText = title
  } else if (typeof contentPreviewText === 'string' && contentPreviewText !== '') {
    hoverTitlePreviewText = contentPreviewText
  }
  
  if (clickable === true && typeof cardLink === 'string' && cardLink.length > 0) {
    if (cardLink.includes(':')) {
      return <a
        href={cardLink}
        target="_blank" rel="noreferrer"
        title={hoverTitlePreviewText}
        data-size={size}
        className={`clickable_card ${classes.root}`}
        style={{
          cursor: 'pointer',
          color,
          '--on-background-rgb': colorRGB,
        }}
        {...onClickProps}
      >
        {content}
      </a>
    } else {
      return <Link
        to={cardLink}
        title={hoverTitlePreviewText}
        data-size={size}
        className={`clickable_card ${classes.root}`}
        style={{
          cursor: 'pointer',
          color,
          '--on-background-rgb': colorRGB,
        }}
        {...onClickProps}
      >
        {content}
      </Link>
    }
  }

  return <div
    title={hoverTitlePreviewText}
    data-size={size}
    className={`clickable_card ${classes.root}`}
    style={{
      cursor: 'auto',
      color,
      '--on-background-rgb': colorRGB,
    }}
    {...onClickProps}
  >
    {content}
  </div>
}

export default ViewerLineAndCard
