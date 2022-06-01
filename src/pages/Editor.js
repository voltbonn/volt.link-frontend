import React, { lazy, Suspense, useRef, useState, useEffect, useCallback } from 'react'

import {
  useParams,
} from 'react-router-dom'

import { Localized } from '../fluent/Localized.js'
import useLoadPage from '../hooks/useLoadPage.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'

import Header from '../components/Header.js'
import ViewerAuto from '../components/view/ViewerAuto.js'

import PageEditor from '../components/apps/PageEditor.js'

import classes from './Viewer.module.css'

const ErrorPage = lazy(() => import('../components/ErrorPage.js'))

function Editor() {
  const loadingTheBlock = useRef(false)

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
      window.umami.trackEvent('E: ' + error.code)
    }
  }, [setError])

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

            setAndTrackError(null)
            setBlock(newLoadedBlock)
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
    setAndTrackError,
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
    return <PageEditor
      block={block}
      onSaveBlock={setBlock}
    />
  }
}

export default Editor
