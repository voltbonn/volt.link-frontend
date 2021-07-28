import { useState, useCallback, useRef } from 'react'

function PermissionInput({ role, defaultValue, children, style, onChange, ariaLabel, placeholder, ...props }) {
  const wrapperDiv = useRef(null)

  const [changedRole, setChangedRole] = useState(role || 'editor')
  const [changedValue, setChangedValue] = useState(defaultValue)

  const handleRoleChange = useCallback((event) => {
    setChangedRole(event.target.value)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = {
        role: event.target.value,
        value: changedValue,
      }
      onChange({ target })
    }
  }, [setChangedRole, onChange, changedValue])

  const handleTextChange = useCallback(value => {
    setChangedValue(value)
    if (onChange) {
      const target = wrapperDiv.current
      target.value = {
        role: changedRole,
        value,
      }
      onChange({ target })
    }
  }, [setChangedValue, onChange, changedRole])

  return <div
    ref={wrapperDiv}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '100%',
      ...style
    }}
    {...props}
  >
    {
      !!children
        ? children({
          onChange: handleTextChange,
          defaultValue: defaultValue,
          style: {
            flexGrow: '1',
          }
        })
        : null
    }
    <select
      onChange={handleRoleChange}
      defaultValue={role}
      style={{
        margin: '0 0 0 var(--basis)',
        display: 'none',
      }}
    >
      <option key="editor" value="editor">Editor</option>
      <option key="viewer" value="viewer">Viewer</option>
    </select>
  </div>
}

export default PermissionInput
