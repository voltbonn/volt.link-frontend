import { useState, useCallback } from 'react'
import classes from './Chooser.module.css'

import { Link } from 'react-router-dom'

function Chooser() {
  const [value, setValue] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(null)

  const handleCheckIfPathExists = useCallback(event => {
    const newValue = event.target.value
    setValue(newValue)

    if (newValue === '') {
      setAlreadyExists(null)
    } else if (newValue === 'bonn') {
      setAlreadyExists(true)
    } else {
      setAlreadyExists(false)
    }
  }, [setValue, setAlreadyExists])

  return <>
    <div className={`${classes.chooser} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}>
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
