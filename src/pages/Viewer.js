import { useRef, useState, useEffect } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { useLocalization, Localized } from '../fluent/Localized.js'
import useLoadBlock from '../hooks/useLoadBlock.js'
import useLoadBlocksByIds from '../hooks/useLoadBlocksByIds.js'
import useUser from '../hooks/useUser.js'

import Header from '../components/Header.js'
import ViewerHeadline from '../components/view/ViewerHeadline.js'
import ViewerText from '../components/view/ViewerText.js'
import ViewerButton from '../components/view/ViewerButton.js'
import ViewerDivider from '../components/view/ViewerDivider.js'

import classes from './Viewer.module.css'

import {
  ArrowBackSharp as BackIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

function Viewer () {
  const loadingTheBlock = useRef(false)

  const { loggedIn } = useUser()

  const loadBlock = useLoadBlock()
  const loadBlocksByIds = useLoadBlocksByIds()

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
          loadBlocksByIds(ids)
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
    loadBlocksByIds,
    setContentBlocks,
  ])

  const title = fluentByAny(block.properties.text, '')
  const description = fluentByAny(block.properties.description, '')
  const coverphoto_url = block.properties.coverphoto || ''
  const icon_url = block.properties.icon || ''

  const leftHeaderActions = (
    <Link to="/">
      <button className="text hasIcon" style={{ margin: '0' }}>
        <BackIcon className="icon"/>
      </button>
    </Link>
  )

  const rightHeaderActions = <div className="buttonRow" style={{ whiteSpace: 'nowrap' }}>
    <Link to={`/edit/${block._id}`}>
      <button className="text hasIcon">
        <EditIcon className="icon" />
        <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}><Localized id="edit_block" /></span>
      </button>
    </Link>
  </div>

  return <>
    {
      loggedIn
        ? <Header
          leftActions={leftHeaderActions}
          title=""
          rightActions={rightHeaderActions}
        />
        : null
    }
    <div className={`basis_x1 ${classes.app} ${classes.spine_aligned}`} dir="auto">
      {
        coverphoto_url !== ''
          ? <div style={{ backgroundImage: `url(${coverphoto_url})` }} className={classes.coverphoto}></div>
          : null
      }
      <main className={`${classes.contentWrapper}`}>
        {
          icon_url !== ''
            ? <div style={{ backgroundImage: `url(${icon_url})` }} className={classes.icon}></div>
            : null
        }
        { title !== '' ? <h1 dir="auto">{title}</h1> : null }
        { description !== '' ? <p dir="auto">{description.split(/\n/g).flatMap(i => [i, <br key={i}/>])}<br/></p> : null }
        <div className={classes.items}>
          {
            contentBlocks
            .map(contentBlock => {
              let component = null

              switch (contentBlock.type) {
                case 'headline':
                  component = <ViewerHeadline key={contentBlock._id} block={contentBlock} />
                  break
                case 'text':
                  component = <ViewerText key={contentBlock._id} block={contentBlock} />
                  break
                case 'button':
                  component = <ViewerButton key={contentBlock._id} block={contentBlock} />
                  break
                case 'divider':
                  component = <ViewerDivider key={contentBlock._id} block={contentBlock} />
                  break
                default:
                  component = null
              }

              return <div key={contentBlock._id}>{component}</div>
            })
          }
        </div>
      </main>
    </div>
  </>
}

export default Viewer
