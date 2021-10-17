import { useCallback, useState } from 'react'

import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material'

function CheckboxInput({
  defaultValue = '',
  onChange,
  onBlur,
  style,
  className,
  disabled = false,
}) {
  // TODO: make ARIA compatible

  const [ checked, setChecked ] = useState(Boolean(defaultValue))

  const publishChanges = useCallback(() => {
    if (onChange) {
      onChange(checked)
    }
    if (onBlur) {
      onBlur(checked)
    }
  }, [ onChange, onBlur, checked ])

  const checkBlock = useCallback(() => {
    if (disabled === true) {
      return
    }
    publishChanges()
    setChecked(true)
  }, [ disabled, publishChanges, setChecked ])

  const uncheckBlock = useCallback(() => {
    if (disabled === true) {
      return
    }
    publishChanges()
    setChecked(false)
  }, [ disabled, publishChanges, setChecked ])

  return <div
    style={{
      display: 'inline-block',
      padding: 'var(--basis)',
      cursor: disabled === true ? 'default' : 'pointer',
      verticalAlign: 'middle',
      ...style,
    }}
    className={className}
  >
    {
      checked
      ? <CheckBoxIcon onClick={uncheckBlock} />
      : <CheckBoxOutlineBlankIcon onClick={checkBlock} />
    }
  </div>
}

export default CheckboxInput
