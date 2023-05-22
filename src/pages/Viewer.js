import React, { lazy, Suspense, useRef, useState, useEffect, useCallback } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { Helmet } from 'react-helmet'
import Twemoji from '../components/Twemoji.js'
import ReactionButton from '../components/ReactionButton.js'

import { getImageUrl } from '../functions.js'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useLoadPage from '../hooks/useLoadPage.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'

import Header from '../components/Header.js'
import ViewerAuto from '../components/view/ViewerAuto.js'
import { ListView } from './List.js'

import classes from './Viewer.module.css'

import {
  EditSharp as EditIcon,
  Search as SearchIcon,
  AssessmentSharp as AssessmentIcon,
} from '@mui/icons-material'

import { renderInlineMarkdown } from '../markdown.js'

const ErrorPage = lazy(() => import('../components/ErrorPage.js'))
const LocaleSelect = lazy(() => import('../components/edit/LocaleSelect.js'))

function Viewer () {
  const loadingTheBlock = useRef(false)
  const { getString, translateBlock, userLocales } = useLocalization()

  const { loggedIn } = useUser()

  const loadPage = useLoadPage()
  const loadBlocks = useLoadBlocks()

  let { id: slugOrId = '' } = useParams()

  let slugOrId_to_use = slugOrId

  if (slugOrId.includes('=')) {
    const [, id] = slugOrId.split('=')
    slugOrId_to_use = id
  }

  const [block, setBlock] = useState({
    type: 'page',
    properties: {},
    content: [],
  })
  const properties = block.properties || {}
  const slug = properties.slug || slugOrId_to_use || ''
  const [contentBlocks, setContentBlocks] = useState([])

  const [possibleLocales, setPossibleLocales] = useState([])
  const [locales, setLocales] = useState(properties.locale || userLocales || ['en'])
  const handleLocaleChange = useCallback((newLocale) => {
    setLocales([newLocale])
  }, [ setLocales ])

  const [error, setError] = useState(null)

  const setAndTrackError = useCallback(error => {
    setError(error)

    if (
      !!window.umami
      && typeof error === 'object'
      && error !== null
      && error.hasOwnProperty('code')
      && typeof error.code === 'string'
    ) {
      window.umami.track('E: ' + error.code)
    }
  }, [setError])

  const viewStatistics = () => {
    const a = document.createElement('a')
    a.href = `https://umami.volt.link/share/s0ZHBZbb/volt.link?url=%2F${slug}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  useEffect(() => {
    const properties = block.properties || {}

    if (
      loadingTheBlock.current === false
      && typeof slugOrId_to_use === 'string'
      && slugOrId_to_use !== ''
      && slugOrId_to_use !== block._id
      && slugOrId_to_use !== properties.slug
      && (
        error === null
        || error.for_slugOrId !== slugOrId_to_use
      )
    ) {
      loadingTheBlock.current = true
      loadPage(slugOrId_to_use)
        .then(async loadedBlock => { 
          if (typeof loadedBlock !== 'object' || loadedBlock === null) {
            setAndTrackError({
              code: '404',
              for_slugOrId: slugOrId_to_use,
            })
            loadingTheBlock.current = false
          } else {
            let newLoadedBlock = loadedBlock

            if (
              Array.isArray(loadedBlock.content)
              && loadedBlock.content.length > 0
            ) {
              let newContentConfigs = [...loadedBlock.content]

              const ids2load = loadedBlock.content
                .filter(contentConfig => !contentConfig.hasOwnProperty('block'))
                .map(contentConfig => contentConfig.blockId)

              let loadedContentBlocks = []
              if (ids2load.length > 0) {
                loadedContentBlocks = await loadBlocks({ ids: ids2load })
              }

              newContentConfigs = newContentConfigs
                .map(contentConfig => {
                  if (!contentConfig.hasOwnProperty('block')) {
                    contentConfig.block = loadedContentBlocks.find(block => block._id === contentConfig.blockId)
                  }
                  return contentConfig
                })

              newLoadedBlock = {
                ...newLoadedBlock,
                content: newContentConfigs,
              }
            }

            const blocks = (newLoadedBlock.content || [])
              .map(contentConfig => contentConfig.block)

            const newPossibleLocales = [...new Set(
              [
                loadedBlock,
                ...blocks,
              ]
                .filter(Boolean)
                .flatMap(thisBlock => {
                  const properties = thisBlock?.properties || {}

                  return [
                    properties.locale || null,
                    ...(properties.translations || [])
                      .filter(t => t.text && t.text.length > 0)
                      .map(t => t.locale),
                  ]
                })
                .filter(Boolean)
            )]
            setPossibleLocales(newPossibleLocales)

            setAndTrackError(null)
            setBlock(newLoadedBlock)
            setContentBlocks(blocks)
            loadingTheBlock.current = false
          }
        })
        .catch(error => {
          console.error(error)
          setAndTrackError({
            ...error,
            for_slugOrId: slugOrId_to_use,
          })
          loadingTheBlock.current = false
        })
    }
  }, [
    error,
    slugOrId_to_use,
    block,
    block._id,
    loadPage,
    setBlock,
    loadBlocks,
    setContentBlocks,
    setPossibleLocales,
    setAndTrackError,
  ])

  const openSearch = () => {
    const event = new CustomEvent('open_search')
    window.dispatchEvent(event)
  }

  if (error !== null && error.for_slugOrId === slugOrId_to_use) {
    const short_error_page_title = 'Error ' + error.code
    return <div className={classes.viewer}>
      <Helmet>
        <title>{short_error_page_title}</title>
        <meta name="title" content={short_error_page_title} />
        <meta name="og:title" content={short_error_page_title} />
        <meta name="twitter:title" content={short_error_page_title} />

        <meta name="description" content="" />
        <meta property="og:description" content="" />
        <meta name="twitter:description" content="" />

        <meta property="og:image" content="" />
        <meta name="twitter:image" content="" />

        <meta property="twitter:card" content="summary" />
      </Helmet>

      <Header
        block={{
          type: 'page',
          properties: {
            text: short_error_page_title,
            icon: {
              type: 'emoji',
              emoji: '⚠️'
            }
          }
        }}
        title="Error"
        rightActions={null}
      />
      <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
        <main className={`${classes.contentWrapper}`}>
          {
            error.code === '300'
              ? <>
                <h1>
                  <Localized id="error_300_title" />
                </h1>
                <br />
                <p>
                  <Localized id="error_300_description" />
                </p>
                <br />
                {
                  error.blocks.map(block => <ViewerAuto
                    key={block._id}
                    block={block}
                    forceId={true}
                    pathSuffix="view"
                  />)
                }
              </>
              : null
          }
          {
            error.code === '403'
              ? <ErrorPage errorName="no_access" />
              : null
          }
          {
            error.code === '404'
              ? <ErrorPage errorName="not_found" />
              : null
          }
        </main>
      </div>
    </div>
  } else {
  const type = block.type || null

  const title = translateBlock(block, locales, getString('placeholder_headline_empty'))
  const coverphoto = properties.coverphoto || {}
  const pronouns = properties.pronouns || ''
  
  const rightHeaderActions = <>
    <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>

      {
        (loggedIn && !!block._id)
        && <Link to={`/${block._id}/edit`} style={{ marginRight: 'var(--basis_x2)' }}>
            <button className="text hasIcon">
              <EditIcon className="icon" />
              <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="edit_block" /></span>
            </button>
          </Link>
      }

      {
        (loggedIn && !!block._id)
        && <ReactionButton forBlockId={block._id} style={{ marginRight: 'var(--basis_x2)' }} />
      }

      {
        (loggedIn && !!block._id && slug !== '')
          ? <button className="text hasIcon" onClick={viewStatistics}>
            <AssessmentIcon className="icon" />
          </button>
          : null
      }

      {
        possibleLocales.length > 1
          ? <Suspense>
              <LocaleSelect
                onChange={handleLocaleChange}
                defaultValue={locales[0] || userLocales[0] || 'en'}
                options={possibleLocales}
                style={{ marginRight: 'var(--basis_x2)' }}
              />
            </Suspense>
          : null
      }

      <button className="default hasIcon" onClick={openSearch} title="Search (⌘K / Ctrl+K)">
        <SearchIcon className="icon" />
      </button>
    </div>
  </>

  const titleWithRenderedMarkdown = {
    __html: renderInlineMarkdown(title)
  }

  let contentPreviewText = ''
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
  }

  const coverphotoPropertyValue = (
    type === 'file'
      ? {
        type: 'file',
        fileId: block._id,
      }
      : coverphoto || null
  )
  const coverphoto_url = getImageUrl(coverphotoPropertyValue, { width: 1400, height: 400 })
  const metadata_image_url = getImageUrl(coverphotoPropertyValue, { width: 1000, height: 1000 })

  let coverphotoComponent = null
  if (typeof coverphoto_url === 'string' && coverphoto_url.length > 0) {
    if (type === 'poster' || type === 'image' || type === 'file') {
      coverphotoComponent = <div style={{
        width: '1000px',
        maxWidth: '100%',
        margin: '0 auto',
      }}>
        <img src={coverphoto_url} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
    } else {
      coverphotoComponent = <div style={{ backgroundImage: `url(${coverphoto_url})` }} className={classes.coverphoto}></div>
    }
  }


  let iconComponent = null

  if (
    properties.hasOwnProperty('icon')
    && typeof properties.icon === 'object'
    && properties.icon !== null
    && !Array.isArray(properties.icon)
    && properties.icon.hasOwnProperty('type')
    && typeof properties.icon.type === 'string'
  ) {

    if (
      properties.icon.type === 'emoji'
      && properties.icon.hasOwnProperty('emoji')
      && typeof properties.icon.emoji === 'string'
      && properties.icon.emoji.length !== 0
    ) {
      iconComponent = <Twemoji className={`${classes.icon} ${coverphoto_url === '' ? '' : classes.coverphotoIsSet}`} emoji={properties.icon.emoji} />
    }

    if (
      iconComponent === null
      && properties.icon.type === 'file'
      && properties.icon.hasOwnProperty('fileId')
      && typeof properties.icon.fileId === 'string'
      && properties.icon.fileId.length !== 0
    ) {
      const fileId = properties.icon.fileId
      iconComponent = <div
        style={{
          backgroundImage: `url(${window.domains.storage}download_file/?f=${window.imageFormat || 'jpg'}&w=400&h=400&id=${encodeURIComponent(fileId)})`
        }}
        className={`${classes.icon} ${coverphoto_url === '' ? '' : classes.coverphotoIsSet}`}
      ></div>
    }

    if (iconComponent === null) {
      let icon_url = getImageUrl(properties.icon, { width: 400, height: 400 })
      if (typeof icon_url === 'string' && icon_url.length !== 0) {
        iconComponent = <div
          style={{
            backgroundImage: `url(${icon_url})`
          }}
          className={`${classes.icon} ${coverphoto_url === '' ? '' : classes.coverphotoIsSet}`}
        ></div>
      }
    }
  }

  return <div className={classes.viewer}>
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta name="description" content={contentPreviewText} />
      <meta property="og:description" content={contentPreviewText} />
      <meta name="twitter:description" content={contentPreviewText} />

      <meta property="og:image" content={metadata_image_url} />
      <meta name="twitter:image" content={metadata_image_url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:card" content="summary" />

      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="article" />

      {/* <meta name="twitter:site" content={window.twitterHandle} /> */}
      {/* <meta name="twitter:creator" content={window.twitterHandle} /> */}

    </Helmet>

    <Header
      block={block}
      rightActions={rightHeaderActions}
    />

    <div className={`basis_0_8 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      {
        'page person redirect poster image file'.split(' ').includes(type)
          ? coverphotoComponent
          : null
      }
      <main className={`${classes.contentWrapper}`}>
        {
          'page person redirect'.split(' ').includes(type)
            ? iconComponent
            : null
        }
        {
          title !== ''
          ? <h1
              dir="auto"
              dangerouslySetInnerHTML={titleWithRenderedMarkdown}
              style={{
                whiteSpace: 'pre-wrap',
              }}
            />
          : null
        }
        {
          type === 'person' && pronouns !== ''
          ? <p dir="auto">
            <strong style={{
              padding: 'var(--basis)',
              // margin: 'var(--basis_x0_5) calc(-1 * var(--basis))',
              display: 'inline-block',
              backgroundColor: 'rgba(var(--on-background-rgb), var(--alpha-less))',
            }}>
              {pronouns}
            </strong>
          </p>
          : null
        }

        <div className={classes.items}>
          {
            contentBlocks
            .filter(block => !!block)
            .filter(block => block.properties.active !== false)
            .map(contentBlock => <ViewerAuto
              key={contentBlock._id}
              block={contentBlock}
              locales={locales}
              size={['page','person','redirect','poster'].includes(contentBlock?.type || '') ? 'line' : 'card'}
            />)
          }

          {
            slug === 'glossary'
            ? <ListView
                preselectedTypes={['definition']}
                preselectedSorting={{
                  path: 'properties.text',
                  asc: false,
                }}
              />
            : null
          }
        </div>
      </main>
    </div>
  </div>
  }
}

export default Viewer
