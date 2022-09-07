import { useState, useCallback, useEffect, useRef } from 'react'

// import mexp from 'math-expression-evaluator'
import { evaluate as mathjs_evaluate } from 'mathjs'

import { useHotkeys } from 'react-hotkeys-hook'

import {
  Modal
} from '@material-ui/core'

import {
  // Search as SearchIcon,

  InsertDriveFileSharp as PageIcon,
  // AutoAwesomeSharp as ActionIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // TitleSharp as HeadlineIcon,
  // NotesSharp as TextIcon,
  // Remove as DividerIcon,

  PublicSharp as WebsiteIcon,

  CloseSharp as CloseIcon,

  MoreVertSharp as BlockMenuIcon,

  ArchiveSharp as ArchiveIcon,
} from '@mui/icons-material'

import classes from './SearchBox.module.css'
import BlockMenu from './edit/BlockMenu.js'
import ViewerAuto from './view/ViewerAuto.js'
import MultiButton from './MultiButton.js'

import { useApolloClient } from '@apollo/client'
import { search_Query } from '../graphql/queries.js'
import { saveBlock_Mutation } from '../graphql/mutations.js'

import { Localized, useLocalization } from '../fluent/Localized.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  redirect: <RedirectIcon />,
  website: <WebsiteIcon />,
}

const possibleTypes = [
  'everything',
  'page',
  'redirect',
  'person',
  'website',
]

function SearchBox() {

  const { getString } = useLocalization()

  const apollo_client = useApolloClient()

  const [open, setOpen] = useState(false)
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState([])

  const queryTextRef = useRef('')
  const [type, setType] = useState(possibleTypes[0])
  const [showArchived, setShowArchived] = useState(false)

  const [mathResult, setMathResult] = useState('')

  useHotkeys('cmd+k, ctrl+k', event => {
    event.preventDefault()
    setOpen(true)
  }, {
    // enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA'],
    // enableOnContentEditable: true,
  })

  useHotkeys('esc', event => {
    event.preventDefault()
    setOpen(false)
  }, {
    enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA'],
    enableOnContentEditable: true,
  })

  useEffect(() => {

    // TODO: load last searchs from cache / or load them from server

    // only save a search when clicked on the item (needs function/hook to the click event)
  }, [])

  const blurInpurOnEnter = useCallback(event => {
    if (event.key === 'Enter') {
      if (!!event.target) {
        event.target.blur()
      }
    }
  }, [])

  useEffect(() => {
    const open_search = () => setOpen(true)
    const close_search = () => setOpen(false)

    window.addEventListener('open_search', open_search)
    window.addEventListener('close_search', close_search)
    return () => {
      window.removeEventListener('open_search', open_search)
      window.removeEventListener('close_search', close_search)
    }
  }, [setOpen])

  const perform_search = useCallback(async (query_text, type, showArchived) => {

    if (query_text.length > 0) {
      let newMathResult = ''
      try {
        newMathResult = mathjs_evaluate(query_text)
      } catch (error) {
        // console.error('math-error', error)
      }
      newMathResult = String(newMathResult)
      if (newMathResult.length > 0) {
        setMathResult(`${query_text} = ${newMathResult}`)
      } else {
        setMathResult('')
      }
    } else {
      setMathResult('')
    }

    if (query_text.length === 0) {
      setResults([])
      setErrors([])
    } else if (query_text.length < 2) {
      setResults([])
      setErrors(['Type more than one characters.'])
    } else {
      const variables = {
        query: query_text,
        archived: showArchived,
      }
      if (
        typeof type === 'string'
        && type.length > 0
        && possibleTypes.includes(type)
        && type !== 'everything'
      ) {
        variables.types = [type]
      } else {
        variables.types = possibleTypes.filter(t => t !== 'everything')
      }

      try {
        const { errors, data } = await apollo_client.query({
          query: search_Query,
          variables,
        })

        if (Array.isArray(errors) && errors.length > 0) {
          throw errors
        } else if (Array.isArray(data.blocks)) {
          const blocks = data.blocks
            .filter(block => typeof block === 'object' && block !== null && !Array.isArray(block))

          setResults(blocks)
          if (blocks.length === 0) {
            setErrors(['No results found.'])
          } else {
            setErrors([])
          }
        } else {
          setErrors(['Unknown error while loading blocks.'])
        }
      } catch (error) {
        console.error('error', error)
        setResults([])
      }
    }
  }, [apollo_client, setResults, setErrors, setMathResult])

  const search = useCallback(async event => {
    let query_text = event.target.value || ''
    if (typeof query_text !== 'string') {
      query_text = ''
    }
    queryTextRef.current = query_text

    perform_search(query_text, type, showArchived)
  }, [perform_search, type, showArchived])

  useEffect(() => {
    perform_search(queryTextRef.current, type, showArchived)
  }, [perform_search, type, showArchived])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleResultClick = useCallback(async (block, index) => {
    setOpen(false)

    const newBlock = {
      type: 'search',
      properties: {
        text: queryTextRef.current,
        // filter: {
        //   type,
        //   showArchived,
        // },
        chosenResult: {
          index,
          blockId: block._id,
        }
      }
    }

    try {
      await apollo_client.mutate({
        mutation: saveBlock_Mutation,
        variables: {
          block: newBlock,
        },
      })
    } catch (error) {
      console.error('error', error)
    }
  }, [setOpen, apollo_client]) // showArchived, type

  return <Modal
    open={open}
    onClose={handleClose}
    hideBackdrop={true}
    BackdropProps={{
      sx: {
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }
    }}
  >
    <>
      <div className={classes.backdrop} onClick={handleClose}></div>

      <div className={classes.dialog}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: 'var(--background)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              autoFocus
              onFocus={e => e.currentTarget.select()} // select the text

              type="search"
              placeholder={getString('search')}
              className={classes.searchInput}
              defaultValue={queryTextRef.current}
              onChange={search}
              onKeyDown={blurInpurOnEnter}
              style={{
                // borderBottom: (results.length > 0 || errors.length > 0)
                //   ? 'var(--basis) solid rgba(var(--on-background-rgb), var(--alpha))'
                //   : '',
                // boxShadow: (results.length > 0 || errors.length > 0)
                //   ? '0 var(--basis) rgba(var(--on-background-rgb), var(--alpha))'
                //   : '',
              }}
            />
            <button
              className="hasIcon"
              onClick={handleClose}
              style={{
                margin: '0 var(--basis_x2) 0 calc(-4 * var(--basis))'
              }}
            >
              <CloseIcon className="icon" />
            </button>
          </div>

          <MultiButton
            defaultValue={type}
            items={
              possibleTypes.map(thisType => ({
                value: thisType,
                // title: thisType,
                title: <Localized id={'block_menu_type_label_plural_' + thisType} />,
                icon: <span className="icon">
                  {blockTypeIcons[thisType]}
                </span>
              }))
            }
            onChange={setType}
            className={classes.filters}
            // buttonStyle={{
            //   flexGrow: 1,
            //   justifyContent: 'center',
            // }}
          />

          {/* <div className={classes.filters}>
            {possibleTypes.map(thisType =>
              <button
                key={thisType}
                onClick={() => setType(thisType)}
                className={type === thisType ? 'default hasIcon' : ' hasIcon'}
              >
                <span className="icon">
                  {blockTypeIcons[thisType]}
                </span>
                <Localized id={'block_menu_type_label_plural_' + thisType} />
              </button>
            )}
          </div> */}
        </div>

        <div
          className={classes.searchResults}
          style={{
            display: (
              (typeof queryTextRef.current === 'string' && queryTextRef.current.length > 1)
              || (Array.isArray(errors) && errors.length > 0)
              || (Array.isArray(results) && results.length > 0)
              ? 'block'
              : 'none'
            )
          }}
        >
          {
            typeof mathResult === 'string' && mathResult.length > 0
              ? <div className={classes.mathResult}>
                {mathResult}
              </div>
              : null
          }

          {
            typeof queryTextRef.current === 'string' && queryTextRef.current.length > 1
              ? <button
                onClick={() => setShowArchived(!showArchived)}
                className={showArchived === true ? 'default hasIcon' : ' hasIcon'}
                style={{ margin: '0' }}
              >
                <span className="icon">
                  <ArchiveIcon />
                </span>
                {
                  showArchived === true
                    ? <Localized id="filter_menu_showing_archiv" />
                    : <Localized id="filter_menu_show_archiv" />
                }
              </button>
            : null
          }

          {
            (typeof queryTextRef.current === 'string' && queryTextRef.current.length > 1)
            && (
              (Array.isArray(errors) && errors.length > 0)
              || (Array.isArray(results) && results.length > 0)
            )
              ? <hr />
              : null
          }

          {
            Array.isArray(errors) && errors.length > 0
              ? <div className={classes.searchErrors}>
                {errors.map(error => <p key={error}>{error}</p>)}
              </div>
              : null
          }

          {
            Array.isArray(results) && results.length > 0
              ? <div>
                {
                  results
                    .map((block, index) => <div
                      key={block._id}
                      className={classes.blockRow}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <ViewerAuto
                        size="card"
                        block={block}
                        onClick={() => handleResultClick(block, index)}
                      />

                      <div className={classes.blockRowActions}>
                        <BlockMenu
                          block={block}
                          trigger={props => (
                            <button
                              {...props}
                              className="text hasIcon"
                              style={{
                                margin: '0',
                                padding: 'var(--basis) 0',
                                flexShrink: '0',
                              }}
                            >
                              <BlockMenuIcon className="icon" />
                            </button>
                          )}
                        />
                      </div>
                    </div>)
                }
              </div>
              : null
          }
        </div>
      </div>
    </>
  </Modal>
}

export default SearchBox
