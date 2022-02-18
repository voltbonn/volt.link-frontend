import { useState, useCallback, useEffect } from 'react'

function MultiButton({ ariaLabel, items, defaultValue, onChange, style, className }) {
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
    className={'buttonRow ' + (className || '')}
    style={{
      display: 'inline-block',
      ...style
    }}
  >
    {
      items.map(item => {
        const value = item.value
        const title = item.title
        const icon = item.icon || null
        return <button
          key={value+'_'+title}
          className={`default ${choosen === value ? 'choosen' : ''} ${!!icon ? 'hasIcon' : ''}`}
          onClick={handleClick}
          data-value={value}
        >
          <span style={{pointerEvents: 'none'}}>
            {!!icon ? icon : null}
            {!!title ? <span style={{verticalAlign: 'middle'}}>{title}</span> : null}
          </span>
        </button>
      })
    }
  </div>
}

export default MultiButton
