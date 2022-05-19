import React, { lazy, Suspense, useRef, useState, useEffect, useCallback } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { Helmet } from 'react-helmet'
import Twemoji from '../components/Twemoji.js'

import { getImageUrl } from '../functions.js'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useLoadPage from '../hooks/useLoadPage.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'

import Header from '../components/Header.js'
import ViewerAuto from '../components/view/ViewerAuto.js'

import classes from './Viewer.module.css'

import {
  EditSharp as EditIcon,
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
  const [contentBlocks, setContentBlocks] = useState([])

  const [possibleLocales, setPossibleLocales] = useState([])
  const [locales, setLocales] = useState(properties.locale || userLocales || ['en'])
  const handleLocaleChange = useCallback((newLocale) => {
    setLocales([newLocale])
  }, [ setLocales ])

  const [error, setError] = useState(null)

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
            setError({
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
                .flatMap(thisBlock => {
                  const properties = thisBlock.properties || {}

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

            setError(null)
            setBlock(newLoadedBlock)
            setContentBlocks(blocks)
            loadingTheBlock.current = false
          }
        })
        .catch(error => {
          console.error(error)
          setError({
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
    setError,
  ])

  if (error !== null && error.for_slugOrId === slugOrId_to_use) {
    return <div className={classes.viewer}>
      <Header
        block={null}
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
                  error.blocks.map(block => <ViewerAuto key={block._id} block={block} forceId={true} />)
                }
              </>
              : null
          }
          {
            error.code === '403'
              ? <Suspense>
                  <ErrorPage errorName="no_access" />
              </Suspense>
              : null
          }
          {
            error.code === '404'
              ? <Suspense>
                <ErrorPage errorName="not_found" />
              </Suspense>
              : null
          }
        </main>
      </div>
    </div>
  } else {
  const type = block.type || null

  const title = translateBlock(block, locales, getString('placeholder_main_headline'))
  const coverphoto_url = getImageUrl(properties.coverphoto)

  // const pronouns = properties.pronouns || ''
  
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
        possibleLocales.length > 1
          ? <Suspense>
              <LocaleSelect
                onChange={handleLocaleChange}
                defaultValue={locales[0] || userLocales[0] || 'en'}
                options={possibleLocales}
              />
            </Suspense>
          : null
      }
    </div>
  </>

  const titleWithRenderedMarkdown = {
    __html: renderInlineMarkdown(title)
  }

  let metadata_image_url = ''
  if (typeof coverphoto_url === 'string' && coverphoto_url.length > 0) {
    metadata_image_url = `${window.domains.backend}download_url?f=jpg&w=1000&h=1000&url=${encodeURIComponent(coverphoto_url)}`
  }


  let iconComponent = null

  if (
    // TODO: is the check overkill ? 😅
    properties.hasOwnProperty('icon')
    && typeof properties.icon === 'object'
    && properties.icon !== null
    && !Array.isArray(properties.icon)
    && properties.icon.hasOwnProperty('type')
    && typeof properties.icon.type === 'string'
    && properties.icon.type === 'emoji'
    && properties.icon.hasOwnProperty('emoji')
    && typeof properties.icon.emoji === 'string'
    && properties.icon.emoji.length !== 0
  ) {
    iconComponent = <Twemoji className={`${classes.icon} ${coverphoto_url === '' ? '' : classes.coverphotoIsSet}`} emoji={properties.icon.emoji} />
  }

  if (iconComponent === null) {
    let icon_url = getImageUrl(properties.icon)
    if (typeof icon_url === 'string' && icon_url.length !== 0) {
      iconComponent = <div
        style={{
          backgroundImage: `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=400&h=400&url=${encodeURIComponent(icon_url)})`
        }}
        className={`${classes.icon} ${coverphoto_url === '' ? '' : classes.coverphotoIsSet}`}
      ></div>
    }
  }

  return <div className={classes.viewer}>
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta name="description" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:description" content="" />

      <meta property="og:image" content={metadata_image_url} />
      <meta name="twitter:image" content={metadata_image_url} />

      <meta property="twitter:card" content="summary" />
    </Helmet>

    <Header
      block={block}
      title={
        <span
          dir="auto"
          dangerouslySetInnerHTML={titleWithRenderedMarkdown}
        />
      }
      rightActions={rightHeaderActions}
    />

    <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      {
      (type === 'page' || type === 'person' || type === 'redirect')
      && coverphoto_url !== ''
          ? <div style={{ backgroundImage: `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=1400&h=400&url=${encodeURIComponent(coverphoto_url)})` }} className={classes.coverphoto}></div>
          : null
      }
      <main className={`${classes.contentWrapper}`}>
        {
          (type === 'page' || type === 'person' || type === 'redirect')
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
        { /* type === 'person' && pronouns !== '' ? <p dir="auto"><strong style={{
          padding: 'var(--basis)',
          margin: 'var(--basis_x0_5) calc(-1 * var(--basis))',
          display: 'inline-block',
          backgroundColor: 'rgba(var(--on-background-rgb), var(--alpha-less))',
        }}>{pronouns}</strong></p> : null */ }
        <div className={classes.items}>
          {
            contentBlocks
            .filter(block => !!block)
            .filter(block => block.properties.active !== false)
            .map(contentBlock => <ViewerAuto key={contentBlock._id} block={contentBlock} locales={locales} />)
          }
        </div>
      </main>
    </div>
  </div>
  }
}

export default Viewer
