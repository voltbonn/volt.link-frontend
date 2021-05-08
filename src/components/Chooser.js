import { useState, useCallback } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'
import useKeyPress from '../hooks/useKeyPress.js'
import Header, { parentStyles } from './Header.js'

function Chooser({ rightHeaderActions }) {
  const history = useHistory()
  const [value, setValue] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(null)

  useKeyPress(['Enter'], () => {
    history.push(`/edit/${value}`)
  })

  const handleCheckIfPathExists = useCallback(event => {
    const newValue = event.target.value
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

  return <>
    <div
      className={`${classes.chooser} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}
      style={parentStyles}
    >
      <Header
        title="edit.volt.link"
        rightActions={rightHeaderActions || null}
      />

      <p className={classes.domainPrefix}>volt.link/</p>
      <input type="text" placeholder="Type a path…" onChange={handleCheckIfPathExists}/>
      {
        alreadyExists === null
          ? null
          : <Link to={`/edit/${value}`}>
              <button>
                {alreadyExists ? 'Edit' : 'Create'}
              </button>
            </Link>
      }
    </div>
  </>
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
