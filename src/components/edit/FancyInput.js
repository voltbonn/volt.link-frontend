import { useState } from 'react'

import classes from './FancyInput.module.css'

function FancyInput({ children, className, style, ...props }) {
  const [error, setError] = useState('')

  console.log('error', error)

  return <div
    className={className}
    style={style}
  >
    {children({ setError })}
    {
      error
      ? <div className={classes.error}>
          {error.split('\n').map(e => <p>{e}</p>)}
        </div>
      : null
    }
  </div>
}

export default FancyInput
