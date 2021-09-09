import { useState } from 'react'

import { Localized } from '../fluent/Localized.js'
import classes from './FancyInput.module.css'

function FancyInput({ children, className, style, ...props }) {
  const [error, setError] = useState('')

  return <div
    className={className}
    style={style}
  >
    {children({ setError })}
    {error ? <div className={classes.error}><Localized id={'error_'+error} /></div> : null}
  </div>
}

export default FancyInput
