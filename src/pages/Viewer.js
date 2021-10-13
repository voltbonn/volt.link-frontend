import { useState, useEffect } from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import { useLocalization, Localized } from '../fluent/Localized.js'
import useLoadBlock from '../hooks/useLoadBlock.js'
import useUser from '../hooks/useUser.js'

import Header from '../components/Header.js'

import classes from './Viewer.module.css'

import {
  ArrowBackSharp as BackIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

function Viewer () {
  const { loggedIn } = useUser()
  const loadBlock = useLoadBlock()
  const { fluentByAny } = useLocalization()

  let { id = '' } = useParams()

  const [block, setBlock] = useState({
    type: 'page',
    properties: {},
    content: [],
  })

  console.log('block', block)

  useEffect(() => {
    if (typeof id === 'string' && id !== '') {
      loadBlock(id)
        .then(loadedBlock => {
          setBlock(loadedBlock)
        })
    }
  }, [
    loadBlock,
    setBlock,
    id,
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
        { title !== '' ? <h1>{title}</h1> : null }
        { description !== '' ? <p>{description}</p> : null }
      </main>
    </div>
  </>
}

export default Viewer
