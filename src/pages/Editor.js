import { useRef, useState, useEffect } from 'react'

import {
  useParams,
} from 'react-router-dom'

import classes from './Editor.module.css'

import useLoadBlock from '../hooks/useLoadBlock.js'
import useBlockMatchesRoles from '../hooks/useBlockMatchesRoles.js'

import Header from '../components/Header.js'
import { ErrorPage } from '../components/ErrorPages.js'

import PageEditor from '../components/apps/PageEditor.js'
import AutomationEditor from '../components/apps/AutomationEditor.js'

function Editor() {
  const loadBlock = useLoadBlock()

  const loadedTheBlock = useRef(false)
  let { id = '' } = useParams()

  const [block, setBlock] = useState({
    type: 'page',
    properties: {},
    content: [],
  })

  const type = block.type || 'page'

  const [ canEdit, setCanEdit ] = useState(null)
  const blockMatchesRoles = useBlockMatchesRoles()
  useEffect(() => {
    blockMatchesRoles(id, ['editor', 'owner'])
      .then(matchesRoles => {
        setCanEdit(matchesRoles)
      })
      .catch(error => {
        console.error(error)
        setCanEdit(false)
      })
  }, [ id, blockMatchesRoles, setCanEdit ])

  useEffect(() => {
    if (
      canEdit
      && typeof id === 'string'
      && id !== ''
      && (
        !loadedTheBlock.current
        || id !== block._id
      )
    ) {
      loadBlock(id)
        .then(loadedBlock => {
          loadedTheBlock.current = true

          setBlock(loadedBlock)
        })
    }
  }, [
    canEdit,
    id,
    block,
    loadBlock,
    setBlock,
    // setLocales,
  ])

  // const isFirstRun = useRef(true)
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false
  //     return;
  //   }
  //
  //   if (
  //     Object.keys(block).length > 0
  //     && JSON.stringify(initialBlock) !== JSON.stringify(block)
  //   ) {
  //   }
  // }, [isFirstRun, initialBlock, block])

  if (canEdit === false) {
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
  } else if (canEdit === true) {
    if (type === 'automation') {
      return <AutomationEditor
        block={block}
        onSaveBlock={setBlock}
      />
    } else {
      return <PageEditor
        block={block}
        onSaveBlock={setBlock}
      />
    }
  } else {
    return null
  }
}

export default Editor
