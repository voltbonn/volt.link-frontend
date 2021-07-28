import { useState } from 'react'

import { Localized } from '../fluent/Localized.js'
import classes from './FancyInput.module.css'

function FancyInput({ children, className, ...props }) {
  const [error, setError] = useState('')

  return <div
    {...props}
  >
    {children({ setError })}
    {error ? <div className={classes.error}><Localized id={'error_'+error} /></div> : null}
  </div>
}

export default FancyInput
