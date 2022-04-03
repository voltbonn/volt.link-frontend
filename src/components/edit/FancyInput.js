import { useState } from 'react'

import classes from './FancyInput.module.css'

function FancyInput({ children, className, style, ...props }) {
  const [error, setError] = useState('')

  return <div
    className={className}
    style={style}
  >
    {children({ setError })}
    {
      error
      ? <div className={classes.error}>
          {error.split('\n').map(error => <p key={error}>{error}</p>)}
        </div>
      : null
    }
  </div>
}

export default FancyInput
