import { useLocalization } from '../../fluent/Localized.js'

import { getBlockColor } from '../../functions.js'
import useBlockTrigger from '../../hooks/useBlockTrigger.js'

import { Link } from 'react-router-dom'

import classes from './ViewerLine.module.css'
import BlockIcon from './BlockIcon.js'

function ViewerLine({ block, clickable = true, onClick, locales, forceId }) {
  const { getString, translateBlock, userLocales } = useLocalization()

  const properties = block.properties || {}
  
  const { link, path } = useBlockTrigger({ block, forceId })

  let title = translateBlock(block, locales || userLocales, '')
  if (title === '') {
    const slug = properties.slug || ''

    if (typeof slug === 'string' && slug.length !== '') {
      title = '/'+slug
    } else {
    }
  }
  

    title = getString('placeholder_headline_empty')



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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BlockIcon block={block} />
          <span dir="auto" className={classes.title}>{title}</span>
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BlockIcon block={block} />
          <span dir="auto" className={classes.title}>{title}</span>
        </div>
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <BlockIcon block={block} />
      <span dir="auto" className={classes.title}>{title}</span>
    </div>
  </div>
}

export default ViewerLine
