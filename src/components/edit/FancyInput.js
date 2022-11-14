import { useState, useEffect } from 'react'

import classes from './FancyInput.module.css'

function FancyInput({ children, className, style, ...props }) {
  const [error, setError] = useState('')

  useEffect(() => {
    if (!!error) {
      console.error(error) 
    }
  }, [error])

  return <div
    className={className}
    style={style}
  >
    {children({ setError })}
    {
      error
      ? <div className={classes.error}>
          {
            typeof error === 'string'
            ? error.split('\n').map(error => <p key={error}>{error}</p>)
            : (
              Array.isArray(error)
              ? error
                .map(e => {
                  if (typeof e === 'string') {
                    return e
                  }
                  if (typeof e === 'number') {
                    return String(e)
                  }
                  if (typeof e === 'object' && e !== null && e.hasOwnProperty('message')) {
                    return e.message
                  }
                  return JSON.stringify(e, 2, null)
                })
                .filter(e => typeof e === 'string')
                .map(error => <p key={error}>{error}</p>)
              : JSON.stringify(error, 2, null)
            )
          }
        </div>
      : null
    }
  </div>
}

export default FancyInput
