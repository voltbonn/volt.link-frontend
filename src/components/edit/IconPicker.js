
import classes from './IconPicker.module.css'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

function IconPicker({ defaultValue, coverphotoValue, onChange, className, style }) {
  const isAbsoluteUrlRegexp = new RegExp('^(?:[a-z]+:)?//', 'i')

  let defaultValueIsUrl = false
  if (
    typeof defaultValue === 'string'
    && defaultValue.length > 0
    && isAbsoluteUrlRegexp.test(defaultValue)
  ) {
    defaultValueIsUrl = true
  }

  let coverphotoValueIsUrl = false
  if (
    typeof coverphotoValue === 'string'
    && coverphotoValue.length > 0
    && isAbsoluteUrlRegexp.test(coverphotoValue)
  ) {
    coverphotoValueIsUrl = true
  }

  return <div
    className={`
      ${classes.root}
      ${defaultValueIsUrl ? classes.iconIsSet : classes.iconIsNotSet}
      ${coverphotoValueIsUrl ? classes.coverphotoIsSet : classes.coverphotoIsNotSet}
      ${className}
    `}
    style={style}
  >
    <Popover
      trigger={(triggerProps) => (<div className={classes.iconWrapper}>
        <div
          className={`${classes.icon} ${!defaultValueIsUrl ? classes.no_image : ''}`}
          style={{
            backgroundImage: defaultValueIsUrl ? `url(${window.domains.backend}download_url?url=${encodeURIComponent(defaultValue)})` : '',
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
                onBlur={onChange}
                defaultValue={defaultValue}
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
