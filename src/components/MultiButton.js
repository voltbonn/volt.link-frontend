import { useState, useCallback, useEffect } from 'react'

function MultiButton({ ariaLabel, items, defaultValue, onChange, style = {}, buttonProps = {}, className = '' }) {
  const [choosen, setChoosen] = useState()

  useEffect(() => setChoosen(defaultValue), [defaultValue, setChoosen])

  const handleClick = useCallback(event => {
    const newValue = event.target.dataset.value
    setChoosen(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }, [setChoosen, onChange])

  return <div
    aria-label={ariaLabel}
    className={'buttonRow ' + (className || '')}
    style={style}
  >
    {
      items.map(item => {
        const value = item.value
        const title = item.title
        const icon = item.icon || null
        return <button
          {...buttonProps}
          key={value}
          className={`default ${choosen === value ? 'choosen' : ''} ${!!icon ? 'hasIcon' : ''} ${buttonProps?.className || ''}`}
          onClick={handleClick}
          data-value={value}
        >
          <span style={{ pointerEvents: 'none', display: 'flex', gap: 'var(--basis)' }}>
            {!!icon ? icon : null}
            {
              !!title
                ? (
                  typeof title === 'object' // check if it's a component
                    ? title
                    : <span style={{verticalAlign: 'middle'}}>{title}</span>
                )
                : null
            }
          </span>
        </button>
      })
    }
  </div>
}

export default MultiButton
