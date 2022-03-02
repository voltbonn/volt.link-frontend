import React, { useRef, useState, useEffect } from 'react'

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

import classes from './Viewer.module.css'

import {
  EditSharp as EditIcon,
} from '@mui/icons-material'

function Viewer () {
  const loadingTheBlock = useRef(false)
  const { getString } = useLocalization()

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

          setBlock(newLoadedBlock)
          setContentBlocks(blocks)
          loadingTheBlock.current = false
        })
    }
  }, [
    canView,
    id,
    block._id,
    loadBlock,
    setBlock,
    loadBlocks,
    setContentBlocks,
  ])

  if (canView === false) {
    return <>
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
    </>
  } else {
  const type = block.type || null

  const title = block.properties.text || getString('placeholder_main_headline')
  const coverphoto_url = getImageUrl(block.properties.coverphoto)
  const icon_url = getImageUrl(block.properties.icon)

  // const pronouns = block.properties.pronouns || ''
  
  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    <Link to={`/${block._id}/edit`}>
      <button className="text hasIcon">
        <EditIcon className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="edit_block" /></span>
      </button>
    </Link>
  </div>

  return <div className={classes.viewer}>
    <Helmet>
      <title>{title}</title>
    </Helmet>

    <Header
      block={block}
      title={title}
      rightActions={loggedIn ? rightHeaderActions : null}
    />

    <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      {
      (type === 'page' || type === 'person')
      && coverphoto_url !== ''
          ? <div style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=1400&h=400&url=${encodeURIComponent(coverphoto_url)})` }} className={classes.coverphoto}></div>
          : null
      }
      <main className={`${classes.contentWrapper}`}>
        {
          (type === 'page' || type === 'person')
          && icon_url !== ''
            ? <div
                style={{
                  backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=400&h=400&url=${encodeURIComponent(icon_url)})`
                }}
                className={`${classes.icon} ${coverphoto_url === '' ? classes.coverphotoIsNotSet : classes.coverphotoIsSet}`}
              ></div>
            : null
        }
        { title !== '' ? <h1 dir="auto">{title.split('\n').map(l => <React.Fragment key={l}>{l}<br/></React.Fragment>)}</h1> : null }
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
            .map(contentBlock => <ViewerAuto key={contentBlock._id} block={contentBlock} />)
          }
        </div>
      </main>
    </div>
  </div>
  }
}

export default Viewer
