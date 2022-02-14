
import classes from './IconPicker.module.css'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

function IconPicker({ coverphotoValue, iconValue, onChange, className, style }) {

  const onUrlChange = newUrl => {
    onChange({
      type: 'url',
      url: newUrl,
    })
  }

  const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

  let coverphotoIsSet = false
  let iconIsSet = false

  if (
    typeof coverphotoValue === 'object'
    && coverphotoValue !== null
    && !Array.isArray(coverphotoValue)
  ) {
    if (
      coverphotoValue.type === 'url'
      && typeof coverphotoValue.url === 'string'
      && isAbsoluteUrlRegexp.test(coverphotoValue.url)
    ) {
      coverphotoIsSet = true
    }
  }

  if (
    typeof iconValue === 'object'
    && iconValue !== null
    && !Array.isArray(iconValue)
  ) {
    if (
      iconValue.type === 'url'
      && typeof iconValue.url === 'string'
      && isAbsoluteUrlRegexp.test(iconValue.url)
    ) {
      iconIsSet = true
    }
  }

  return <div
    className={`
      ${classes.root}
      ${iconIsSet ? classes.iconIsSet : classes.iconIsNotSet}
      ${coverphotoIsSet ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${className}
    `}
    style={style}
  >
    <Popover
      trigger={(triggerProps) => (<div className={classes.iconWrapper}>
        <div
          className={`${classes.icon} ${!iconIsSet ? classes.no_image : ''}`}
          style={{
            backgroundImage: iconIsSet ? `url(${window.domains.backend}download_url?url=${encodeURIComponent(iconValue.url)})` : '',
          }}
        ></div>
        <button {...triggerProps} className={classes.changeIconButton}>Set Icon</button>
      </div>)}
    >
      {({closePopover, ...popoverProps}) => (
        <Paper
          {...popoverProps}
          sx={{
            maxWidth: 'calc(calc(100vw - 32px) - var(--basis_x8))',
            maxHeight: 'calc(calc(100vh - 32px) - var(--basis_x8))',
            overflow: 'auto',
            padding: 'var(--basis_x4)',
            background: 'var(--background-contrast)',
            color: 'var(--on-background)',
          }}
          elevation={8}
        >
          <h3 style={{ marginTop: '0' }}><Localized id="path_editor_icon_label" /></h3>

          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized id="path_editor_icon_info" />
          </em>

          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onBlur={onUrlChange}
                defaultValue={iconValue.url}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: '100%'
                }}
              />
            )}
          </FancyInput>

          <hr />

          <button onClick={closePopover} style={{ margin: 0 }}>
            Close
          </button>
        </Paper>
      )}
    </Popover>
  </div>
}

export default withLocalization(IconPicker)
