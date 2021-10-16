import { useLocalization } from '../../fluent/Localized.js'

import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material'

function ViewerCheckboxCard ({ block }) {
  const { fluentByAny } = useLocalization()

  const text = fluentByAny(block.properties.text, '')

  const checked = Boolean(block.properties.checked)

  const checkboxStyle = {
    verticalAlign: 'middle',
    paddingInlineEnd: 'var(--basis)',
    height: 'calc(var(--font-add) + var(--basis))',
    width: 'auto',
  }

  return <p dir="auto">
    {
      checked
      ? <CheckBoxIcon style={checkboxStyle} />
      : <CheckBoxOutlineBlankIcon style={checkboxStyle} />
    }
    {text}
  </p>
}

export default ViewerCheckboxCard
