import { useLocalization } from '../../fluent/Localized.js'

import { getBlockColor } from '../../functions.js'
import useBlockTrigger from '../../hooks/useBlockTrigger.js'

import { Link } from 'react-router-dom'

import classes from './ViewerLine.module.css'
import BlockIcon from './BlockIcon.js'

function ViewerLine({ block, clickable = true, onClick, locales, forceId, pathSuffix }) {
  const { getString, translateBlock, userLocales } = useLocalization()

  const type = block?.type || 'unknown'
  const properties = block.properties || {}
  const slug = properties.slug || ''
  
  const { link, path } = useBlockTrigger({ block, forceId, pathSuffix })

  let title = translateBlock(block, locales || userLocales, '')

  let additionalInfos = []
  if (type === 'page' || type === 'redirect' || type === 'person') {
    if (title === '' && typeof slug === 'string' && slug !== '') {
      additionalInfos.push(<div key="slug">{'/' + slug}</div>)
    }
  }

  if (title === '' && additionalInfos.length === 0) {
    title = getString('placeholder_headline_empty')
  }

  const content = <div style={{ display: 'flex', alignItems: 'center' }}>
    <BlockIcon block={block} />
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
  </div>



  let cardLink = path || link

  const {
    color = 'inherit',
    colorRGB = '--on-background-rgb',
  } = getBlockColor(block)

  const onClickProps = {}
  if (typeof onClick === 'function') {
    onClickProps.onClick = onClick
  }
  
  if (clickable === true && typeof cardLink === 'string' && cardLink.length > 0) {
    if (cardLink.includes(':')) {
      return <a
        href={cardLink}
        target="_blank" rel="noreferrer"
        title={title}
        className={`clickable_card ${classes.root}`}
        style={{
          display: 'block',
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
        title={title}
        className={`clickable_card ${classes.root}`}
        style={{
          display: 'block',
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
    title={title}
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

export default ViewerLine
