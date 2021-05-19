import { useState, useCallback } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'

import { withLocalization } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import Header from '../components/Header.js'

function Chooser({ getString, rightHeaderActions }) {
  const history = useHistory()
  const [value, setValue] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(null)

  useKeyPress(['Enter'], () => {
    history.push(`/edit/${value}`)
  })

  const handleCheckIfPathExists = useCallback(event => {
    const newValue = (event.target.value || '').toLowerCase()
    setValue(newValue)

    if (newValue === '') {
      setAlreadyExists(null)
    } else {
      fetch(`https://volt.link/exists/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.exists === true) {
            setAlreadyExists(true)
          } else {
            setAlreadyExists(false)
          }
        })
        .catch(error => {
          console.error(error)
          setAlreadyExists(false)
        })
    }
  }, [setValue, setAlreadyExists])

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
