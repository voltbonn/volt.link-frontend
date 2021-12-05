
import {
  Login as LoginIcon,
} from '@mui/icons-material'

import Localized from '../fluent/Localized.js'

export default function LoginScreen () {
  return <>
    <h1>Login to view content</h1>
    <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
      <button className="hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
        <LoginIcon className="icon" />
        <span>
          <Localized id="login" />
        </span>
      </button>
    </a>
  </>
}
