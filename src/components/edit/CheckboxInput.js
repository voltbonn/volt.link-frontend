import { useCallback, useState } from 'react'

import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material'

function CheckboxInput({
  defaultValue = false,
  onChange,
  onBlur,
  style,
  className,
  disabled = false,
}) {
  // TODO: make ARIA compatible

  const [checked, setChecked] = useState(Boolean(defaultValue))

  const toggleChecked = useCallback(() => {
    if (disabled === true) {
      return
    }

    const newChecked = !checked

    setChecked(newChecked)
    if (onChange) {
      onChange(newChecked)
    }
    if (onBlur) {
      onBlur(newChecked)
    }
  }, [disabled, checked, setChecked, onChange, onBlur])

  const iconProps = {
    className: className,
    onClick: toggleChecked,
    style: {
      display: 'inline-block',
      margin: 'var(--basis)',
      cursor: disabled === true ? 'default' : 'pointer',
      // verticalAlign: 'middle',
      // backgroundColor: 'red',
      lineHeight: 0,
      height: 'var(--prefix-icon-size)',
      width: 'var(--prefix-icon-size)',
      ...style,
    }
  }

  if (checked) {
    return <CheckBoxIcon {...iconProps} />
  } else {
    return <CheckBoxOutlineBlankIcon {...iconProps} />
  }
}

export default CheckboxInput
