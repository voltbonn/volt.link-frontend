import { useState, useCallback } from 'react'

function PermissionInput({ reorderHandle, actionButton, defaultValue, children, className, style, onChange, ariaLabel, placeholder, dataset, ...props }) {
  const [changedRole, setChangedRole] = useState(defaultValue.role || 'editor')
  const [changedValue, setChangedValue] = useState(defaultValue.value)

  console.log('defaultValue', defaultValue)

  const handleRoleChange = useCallback((event) => {
    setChangedRole(event.target.value)
    if (onChange) {
      onChange({
        value: {
          ...defaultValue,
          role: event.target.value,
          value: changedValue,
        },
        dataset,
      })
    }
  }, [defaultValue, dataset, setChangedRole, onChange, changedValue])

  const handleTextChange = useCallback(value => {
    setChangedValue(value)
    if (onChange) {
      onChange({
        value: {
          ...defaultValue,
          role: changedRole,
          value,
        },
        dataset,
      })
    }
  }, [defaultValue, dataset, setChangedValue, onChange, changedRole])

  return <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '100%',
      ...style
    }}
  >
    {
      !!children
        ? children({
          onChange: handleTextChange,
          defaultValue: defaultValue.value || '',
          style: {
            flexGrow: '1',
          }
        })
        : null
    }
    <select
      onChange={handleRoleChange}
      defaultValue={defaultValue.role || 'editor'}
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
