import { useState, useCallback, useEffect } from 'react'
import classes from './Chooser.module.css'

import {
  InsertDriveFileSharp as PageIcon,
  AutoAwesomeSharp as ActionIcon,
  // LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // TitleSharp as HeadlineIcon,
  // NotesSharp as TextIcon,
  // Remove as DividerIcon,
  EditSharp as EditIcon,
} from '@mui/icons-material'

import { useApolloClient } from '@apollo/client'
import { getBlocksByType_Query } from '../graphql/queries'
import useSaveBlock from '../hooks/useSaveBlock.js'

import { Link, useHistory } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
// import useKeyPress from '../hooks/useKeyPress.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'
import MultiButton from '../components/MultiButton.js'
import ViewerAuto from '../components/view/ViewerAuto.js'

function Chooser({ leftHeaderActions, rightHeaderActions }) {
  const { getString } = useLocalization()
  const apollo_client = useApolloClient()

  const [type, setType] = useState('page')
  const [blocks, setBlocks] = useState([])
  const saveBlock = useSaveBlock()

  const user = useUser()
  const user_editable_links = (user.editable || [])

  const history = useHistory()

  const queryBlocks = useCallback(type2query => {
    apollo_client.query({
      query: getBlocksByType_Query,
      variables: {
        type: type2query,
      },
    })
      .then(async ({ data }) => {
        if (typeof data.error === 'string' || !data.blocksByType) {
          console.error('error', data.error)
        } else {
          setBlocks(data.blocksByType || [])
        }
      })
      .catch(async error => {
        console.error('error', error)
      })
  }, [ apollo_client, setBlocks ])

  useEffect(() => {
    queryBlocks(type)
  }, [ queryBlocks, type ])

  const handleTypeChange = useCallback(newType => {
    setType(newType)
    if (
      typeof newType === 'string'
      && newType !== ''
      && newType !== type
    ) {
      queryBlocks(newType)
    }
  }, [ type, setType, queryBlocks ])

  const createBlock = useCallback(() => {
    saveBlock({ type })
      .then(gottenBlock => {
        history.push(`/edit/${gottenBlock._id}`)
      })
      .catch(error => {
        console.error(error)
      })
  }, [ saveBlock, history, type ])

  /*
  useKeyPress(['Enter'], () => {
    history.push(`/edit/${value}`)
  })

  const handleCheckIfPathExists = useCallback(event => {
    const newValue = (event.target.value || '').toLowerCase()
    setValue(newValue)

    const forbidden_letters = (forbidden.letters || '').split('')
    const newValue_split = (newValue || '').split('')
    const forbidden_letters_filtered = forbidden_letters.filter(value => !newValue_split.includes(value))

    const forbidden_codes = forbidden.codes || []
    const value_is_a_forbidden_code = forbidden_codes.includes(newValue)

    if (value_is_a_forbidden_code) {
      setAlreadyExists(null)
      setError('This path is not allowed.')
    } else if (forbidden_letters_filtered.length < forbidden_letters.length) {
      setAlreadyExists(null)
      setError('This path contains forbidden characters.')
    } else if (newValue.startsWith('volt')) {
      setAlreadyExists(null)
      setError('A path can\'t start with "volt".')
    } else if (newValue === '') {
      setAlreadyExists(null)
      setError('')
    } else {
      setError('')
      fetch(`${window.domains.backend}quickcheck/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.allowed === false) {
            setAlreadyExists(null)
            setError('You are not allowed to edit this code.')
          } else {
            if (data.exists === true) {
              setAlreadyExists(true)
              setError('')
            } else if (newValue_split.includes('.')) {
              setAlreadyExists(null)
              setError('Codes with a dot are restricted to people. Please contact thomas.rosen@volteuropa.org to use volt.link for your Volt Account.')
            } else {
              setAlreadyExists(false)
              setError('')
            }
          }
        })
        .catch(error => {
          console.error(error)
          setAlreadyExists(false)
        })
    }
  }, [setValue, setAlreadyExists, forbidden.letters, forbidden.codes])

  useEffect(() => {
    fetch(`${window.domains.backend}forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setForbidden(data)
      })
      .catch(error => {
        console.error(error)
        setForbidden({})
      })
  }, [setForbidden])
  */

  return <div>
    <Header
      title="volt.link"
      leftActions={leftHeaderActions || null}
      rightActions={rightHeaderActions || null}
    />

    <div className={classes.content}>

    <MultiButton
      onChange={handleTypeChange}
      defaultValue={type}
      items={[
        { value: 'page', icon: <PageIcon className="icon"/>, title: getString('block_menu_type_label_plural_page') },
        { value: 'person', icon: <PersonIcon className="icon" />, title: getString('block_menu_type_label_plural_person') },
        { value: 'action', icon: <ActionIcon className="icon" />, title: getString('block_menu_type_label_plural_action') },
        // { value: 'button', icon: <ButtonIcon className="icon" />, title: getString('block_menu_type_label_button') },
        // { value: 'headline', icon: <HeadlineIcon className="icon" />, title: getString('block_menu_type_label_headline') },
        // { value: 'text', icon: <TextIcon className="icon" />, title: getString('block_menu_type_label_text') },
        // { value: 'divider', icon: <DividerIcon className="icon" />, title: getString('block_menu_type_label_divider') },
      ]}
    />

    <br />
    <br />
    <button className="green" onClick={createBlock} style={{ margin: '0' }}>
      <Localized id={'create_new_'+type} />
    </button>
    <br />
    <br />

    {
      user_editable_links.length > 0
        ? <>
          <div className="buttonRow usesLinks">
            {
              blocks
              .map(block => {

                const actions = {
                  click: () => {
                    history.push(`/view/${block._id}`)
                  }
                }

                return <div key={block._id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  <ViewerAuto
                    block={block}
                    actions={actions}
                    style={{
                      flexGrow: '1',
                    }}
                  />
                  <Link to={`/edit/${block._id}`}>
                    <button
                      className="hasIcon"
                      style={{
                        margin: 'var(--basis) 0 0 var(--basis_x4)',
                      }}
                    >
                      <EditIcon className="icon" />
                      <span className="hideOnSmallScreen" style={{verticalAlign: 'middle'}}>
                        <Localized id="edit_block" />
                      </span>
                    </button>
                  </Link>
                </div>
              })
            }
          </div>
        </>
        : null
    }
    </div>

  </div>
}

export default Chooser

/*


    <input
      type="text"
      placeholder="title"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
    <textarea
      placeholder="description"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
*/
