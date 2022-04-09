import React, { useRef, useState, useEffect, useCallback } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { Helmet } from 'react-helmet'

import { getImageUrl } from '../functions.js'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useLoadBlock from '../hooks/useLoadBlock.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'
import useBlockMatchesRoles from '../hooks/useBlockMatchesRoles.js'

import { ErrorPage } from '../components/ErrorPages.js'
import Header from '../components/Header.js'
import ViewerAuto from '../components/view/ViewerAuto.js'

import LocaleSelect from '../components/edit/LocaleSelect.js'

import classes from './Viewer.module.css'

import {
  EditSharp as EditIcon,
} from '@mui/icons-material'

import { renderInlineMarkdown } from '../markdown.js'

function Viewer () {
  const loadingTheBlock = useRef(false)
  const { getString, translateBlock, userLocales } = useLocalization()

  const { loggedIn } = useUser()

  const loadBlock = useLoadBlock()
  const loadBlocks = useLoadBlocks()

  let { id = '' } = useParams()

  const [block, setBlock] = useState({
    type: 'page',
    properties: {},
    content: [],
  })
  const [contentBlocks, setContentBlocks] = useState([])

  const [possibleLocales, setPossibleLocales] = useState([])
  const [locales, setLocales] = useState(block.properties.locale || userLocales || ['en'])
  const handleLocaleChange = useCallback((newLocale) => {
    setLocales([newLocale])
  }, [ setLocales ])

  const [canView, setCanView] = useState(null)
  const blockMatchesRoles = useBlockMatchesRoles()
  useEffect(() => {
    blockMatchesRoles(id, ['viewer', 'owner'])
      .then(matchesRoles => {
        setCanView(matchesRoles)
      })
      .catch(error => {
        console.error(error)
        setCanView(false)
      })
  }, [ id, blockMatchesRoles, setCanView ])

  useEffect(() => {
    if (
      canView
      && loadingTheBlock.current === false
      && typeof id === 'string'
      && id !== ''
      && id !== block._id
    ) {
      loadingTheBlock.current = true
      loadBlock(id)
        .then(async loadedBlock => {

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
            .flatMap(thisBlock => [
              thisBlock.properties.locale,
              ...(thisBlock.properties.translations || [])
                .filter(t => t.text && t.text.length > 0)
                .map(t => t.locale),
            ])
            .filter(Boolean)
          )]
          setPossibleLocales(newPossibleLocales)

          setBlock(newLoadedBlock)
          setContentBlocks(blocks)
          loadingTheBlock.current = false
        })
    }
  }, [
    canView,
    id,
    block,
    block._id,
    loadBlock,
    setBlock,
    loadBlocks,
    setContentBlocks,
    setPossibleLocales
  ])

  if (canView === false) {
    return <div className={classes.viewer}>
      <Header
        block={null}
        title="Error"
        rightActions={null}
      />
      <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
        <main className={`${classes.contentWrapper}`}>
          <ErrorPage errorName="no_access" />
        </main>
      </div>
    </div>
  } else {
  const type = block.type || null

  const title = translateBlock(block, locales, getString('placeholder_main_headline'))
  const coverphoto_url = getImageUrl(block.properties.coverphoto)
  const icon_url = getImageUrl(block.properties.icon)

  // const pronouns = block.properties.pronouns || ''
  
  const rightHeaderActions = <>
    <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
      {
        loggedIn
        && <Link to={`/${block._id}/edit`} style={{ marginRight: 'var(--basis_x2)' }}>
            <button className="text hasIcon">
              <EditIcon className="icon" />
              <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="edit_block" /></span>
            </button>
          </Link>
      }

      {
        possibleLocales.length > 1
        && <LocaleSelect
          onChange={handleLocaleChange}
          defaultValue={locales[0] || userLocales[0] || 'en'}
          options={possibleLocales}
        />
      }
    </div>
  </>

  const titleWithRenderedMarkdown = {
    __html: renderInlineMarkdown(title)
  }

  return <div className={classes.viewer}>
    <Helmet>
      <title>{title}</title>
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
          && icon_url !== ''
            ? <div
                style={{
                  backgroundImage: `url(${window.domains.backend}download_url?f=${window.imageFormat || 'jpg'}&w=400&h=400&url=${encodeURIComponent(icon_url)})`
                }}
                className={`${classes.icon} ${coverphoto_url === '' ? classes.coverphotoIsNotSet : classes.coverphotoIsSet}`}
              ></div>
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
