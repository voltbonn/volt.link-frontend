import { useRef, useState, useEffect } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { useLocalization, Localized } from '../fluent/Localized.js'
import useLoadBlock from '../hooks/useLoadBlock.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useUser from '../hooks/useUser.js'

import Header from '../components/Header.js'
import ViewerAuto from '../components/view/ViewerAuto.js'

import classes from './Viewer.module.css'

import {
  EditSharp as EditIcon,
} from '@mui/icons-material'

function Viewer () {
  const loadingTheBlock = useRef(false)

  const { loggedIn } = useUser()

  const loadBlock = useLoadBlock()
  const loadBlocks = useLoadBlocks()

  const { fluentByAny } = useLocalization()

  let { id = '' } = useParams()

  const [block, setBlock] = useState({
    type: 'page',
    properties: {},
    content: [],
  })
  const [contentBlocks, setContentBlocks] = useState([])

  useEffect(() => {
    if (
      loadingTheBlock.current === false
      && typeof id === 'string'
      && id !== ''
      && id !== block._id
    ) {
      loadingTheBlock.current = true
      loadBlock(id)
        .then(loadedBlock => {
          setBlock(loadedBlock)
          const ids = loadedBlock.content.map(content => content.blockId)
          loadBlocks({ ids })
            .then(loadedContentBlocks => {
              const contentBlocksOrdered = [...ids].map(id => loadedContentBlocks.find(block => block._id === id))
              setContentBlocks([...contentBlocksOrdered])
              loadingTheBlock.current = false
            })
        })
    }
  }, [
    id,
    block._id,
    loadBlock,
    setBlock,
    loadBlocks,
    setContentBlocks,
  ])

  const type = block.type || null

  const title = fluentByAny(block.properties.text, '')
  const description = fluentByAny(block.properties.description, '')
  const coverphoto_url = block.properties.coverphoto || ''
  const icon_url = block.properties.icon || ''

  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    <Link to={`/edit/${block._id}`}>
      <button className="text hasIcon">
        <EditIcon className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="edit_block" /></span>
      </button>
    </Link>
  </div>

  return <>
    <Header
      block={block}
      title={title}
      rightActions={loggedIn ? rightHeaderActions : null}
    />

    <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      {
      (type === 'page' || type === 'person')
      && coverphoto_url !== ''
          ? <div style={{ backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(coverphoto_url)})` }} className={classes.coverphoto}></div>
          : null
      }
      <main className={`${classes.contentWrapper}`}>
        {
          (type === 'page' || type === 'person')
          && icon_url !== ''
            ? <div
                style={{
                  backgroundImage: `url(${window.domains.backend}download_url?url=${encodeURIComponent(icon_url)})`
                }}
                className={`${classes.icon} ${coverphoto_url === '' ? classes.coverphotoIsNotSet : classes.coverphotoIsSet}`}
              ></div>
            : null
        }
        { title !== '' ? <h1 dir="auto">{title}</h1> : null }
        { description !== '' ? <p dir="auto">{description.split(/\n/g).flatMap(i => [i, <br key={i}/>])}<br/></p> : null }
        <div className={classes.items}>
          {
            contentBlocks
            .filter(block => !!block)
            .map(contentBlock => <ViewerAuto key={contentBlock._id} block={contentBlock} />)
          }
        </div>
      </main>
    </div>
  </>
}

export default Viewer
