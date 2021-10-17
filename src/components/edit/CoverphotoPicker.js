
import classes from './CoverphotoPicker.module.css'

import Popover from '../Popover.js'

import { Paper } from '@mui/material'

import { Localized, withLocalization } from '../../fluent/Localized.js'

import MultiButton from '../MultiButton.js'
import FancyInput from './FancyInput.js'
import UrlInput from './UrlInput.js'

import plakatschlange_thumb from '../../images/coverphotos/thumbs/20200912_Plakatschlange_Koeln_Matteo Sant_Unione_011.png'
import aktion_thumb from '../../images/coverphotos/thumbs/Aktion.png'
import volt_bonn_thumb from '../../images/coverphotos/thumbs/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.png'
import welcome_to_volt_thumb from '../../images/coverphotos/thumbs/Welcome-to-Volt.png'


function CoverphotoPicker({ getString, defaultValue, onChange, className, style }) {
  return <div
    className={className}
    style={style}
  >
    <Popover
      trigger={(triggerProps) => (
        <div
          className={`${classes.coverphoto} ${!defaultValue ? classes.no_image : ''}`}
          style={{
            backgroundImage: defaultValue ? `url(${window.domains.backend}download_url?url=${encodeURIComponent(defaultValue)})` : '',
          }}
        >
          <button {...triggerProps} className={classes.changeCoverphotoButton}>Set Coverphoto</button>
        </div>
      )}
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
          <h3><Localized id="path_editor_coverphoto_label" /></h3>

          <em className="body2" style={{ display: 'block', marginBottom: 'var(--basis)' }}>
            <Localized
              id="path_editor_coverphoto_info"
              // vars={{
              //   width: '1200px',
              //   height: '400px',
              //   ratio: '3/1',
              // }}
            />
          </em>

          <FancyInput>
            {({ setError }) => (
              <UrlInput
                onError={setError}
                onChange={onChange}
                defaultValue={defaultValue}
                style={{
                  marginRight: '0',
                  marginLeft: '0',
                  width: '100%'
                }}
              />
            )}
          </FancyInput>

          <MultiButton
            onChange={onChange}
            ariaLabel={getString('path_editor_coverphoto_label')}
            defaultValue={defaultValue || ''}
            items={[
              {
                value: '',
                title: getString('path_editor_no_coverphoto'),
              },
              ...[
                {
                  value: 'https://assets.volteuropa.org/styles/scale_2880x/public/inline-images/tYADz4UyUAAcV5WlmWLlkXD9LG8W02U9LbQd8rxzQ2bt99lxwK.jpg',
                  icon: volt_bonn_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2020-11/Welcome-to-Volt.jpg',
                  icon: welcome_to_volt_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-07/20200912_Plakatschlange_Ko%CC%88ln_Matteo%20Sant_Unione_011.jpeg',
                  icon: plakatschlange_thumb,
                },
                {
                  value: 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Aktion.jpeg',
                  icon: aktion_thumb,
                },
                // 'https://www.volteuropa.org/stripes/hero-desktop-green.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-red.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-blue.jpg',
                // 'https://www.volteuropa.org/stripes/hero-desktop-yellow.jpg',
                // 'https://assets.volteuropa.org/styles/scale_1920x/public/2021-05/Colours-Background-Big.jpeg',
                // 'https://www.volteuropa.org/stripes/intermediate-green.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-red.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-blue.jpg',
                // 'https://www.volteuropa.org/stripes/intermediate-yellow.jpg',
                // 'https://www.volteuropa.org/og-default.png',
                // 'https://www.volteuropa.org/hero-default.jpg',
              ]
              .map(({value = '', icon = ''}) => ({
                value,
                icon: <img alt="" src={icon} className="icon image" />
              }))
            ]}
          />

          <hr />

          <button onClick={closePopover} style={{ margin: 0 }}>
            Close
          </button>
        </Paper>
      )}
    </Popover>
  </div>
}

export default withLocalization(CoverphotoPicker)
