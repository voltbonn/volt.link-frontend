import { useState, useCallback, useEffect } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'

import { withLocalization } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import Header from '../components/Header.js'

function Chooser({ getString, rightHeaderActions }) {
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
      setError('This code is not allowed.')
    } else if (forbidden_letters_filtered.length < forbidden_letters.length) {
      setAlreadyExists(null)
      setError('This code contains forbidden characters.')
    } else if (newValue === '') {
      setAlreadyExists(null)
      setError('')
    } else {
      setError('')
      fetch(`https://volt.link/exists/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => {
          console.error(error)
          setAlreadyExists(false)
        })
    }
  }, [setValue, setAlreadyExists, forbidden.letters, forbidden.codes])

  useEffect(() => {
    fetch(`https://volt.link/forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('data', data)
        setForbidden(data)
      })
      .catch(error => {
        console.error(error)
        setForbidden({})
      })
  }, [setForbidden])

  return <div>
    <Header
      title="edit.volt.link"
      rightActions={rightHeaderActions || null}
    />

    <div className={`${classes.chooserInput} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}>
      <p className={classes.domainPrefix}>volt.link/</p>
      <input type="text" placeholder={getString('type_a_path')} onChange={handleCheckIfPathExists}/>
      {
        alreadyExists === null
          ? null
          : <Link to={`/edit/${value}`}>
              <button>
              {alreadyExists ? getString('edit_path_button') : getString('create_path_button')}
              </button>
            </Link>
      }
    </div>
    <br/>
    {
      error !== ''
        ? <>
          <h2>Errors</h2>
          <p>{error}</p>
        </>
        : null
    }
  </div>
}

export default withLocalization(Chooser)

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
