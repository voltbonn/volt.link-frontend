import { Fragment, useState, useCallback, useEffect } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'

import { Localized, useLocalization } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'
  const { getString, fluentByAny } = useLocalization()

function Chooser({ getString, rightHeaderActions }) {
  const [user, ] = useUser()
  const username = user.username || ''
  const user_editable_links = (user.editable || [])
  const [userPageAlreadyExists, setUserPageAlreadyExists] = useState(null)

  const history = useHistory()
  const [forbidden, setForbidden] = useState({})
  const [value, setValue] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(null)
  const [error, setError] = useState('')

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

  useEffect(() => {
    const newValue = (username || '').toLowerCase()

    if (newValue !== '') {
      fetch(`${window.domains.backend}quickcheck/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.allowed === false) {
            setUserPageAlreadyExists(null)
          } else {
            if (data.exists === true) {
              setUserPageAlreadyExists(true)
            } else {
              setUserPageAlreadyExists(false)
            }
          }
        })
        .catch(error => {
          console.error(error)
          setUserPageAlreadyExists(false)
        })
    } else {
      setUserPageAlreadyExists(null)
    }
  }, [username, setUserPageAlreadyExists])

  return <div>
    <Header
      title={<Localized id="chooser_header_title" />}
      rightActions={rightHeaderActions || null}
    />

    {
      username !== ''
        ? <>
          <h2><Localized id={userPageAlreadyExists === true ? 'edit_user_page_headline' : 'create_user_page_headline'} /></h2>
          <p><Localized id={userPageAlreadyExists === true ? 'edit_user_page_info' : 'create_user_page_info'} /></p>
          <Link to={`/edit/${username}`}>
            <button style={{ marginLeft: '0', marginRight: '0' }}>
              <Localized
                id={userPageAlreadyExists === true ? 'edit_user_page_button' : 'create_user_page_button'}
                vars={{ username }}
              />
            </button>
          </Link>
          <br />
          <br />
        </>
        : null
    }
    <h2><Localized id="chooser_any_link_headline" /></h2>
    <p><Localized id="chooser_any_link_info" /></p>

    <div className={`${classes.chooserInput} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}>
      <p className={classes.domainPrefix}>volt.link/</p>
      <input type="text" placeholder={getString('type_a_path')} onChange={handleCheckIfPathExists}/>
      {
        alreadyExists === null
          ? null
          : <Link to={`/edit/${value}`}>
              <button className="green">
              {alreadyExists ? getString('edit_path_button') : getString('create_path_button')}
              </button>
            </Link>
      }
    </div>
    {
      error !== ''
        ? <>
          <h3 className="red"><Localized id="headline_errors" /></h3>
          <p>{error}</p>
        </>
        : null
    }

    {
      user_editable_links.length > 0
        ? <>
          <br />
          <div className="buttonRow usesLinks">
            {
              user_editable_links
              .filter(content => content.slug.startsWith(value) || (content.slug.replace(/!/, '')).startsWith(value))
              .map(content => <a key={content.slug} href={`/edit/${content.slug}`}><button>{content.slug}</button></a>)
            }
          </div>
        </>
        : null
    }
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
