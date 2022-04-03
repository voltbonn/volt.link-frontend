
import {
  Login as LoginIcon,
} from '@mui/icons-material'

import Localized from '../fluent/Localized.js'

export default function LoginScreen () {
  return <>
    <h1>Login to view content</h1>
    <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
      <button className="text hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
        <LoginIcon className="icon" />
        <span>
          <Localized id="login" />
        </span>
      </button>
    </a>
  </>
}

export function ErrorPage ({ errorName }) {
  let title = 'Unknown Error'
  let description = ''
  let buttons = ''

  if (errorName === 'no_access') {
    title = `You don't have access to this page!`
    
    description = <>
      <h2>If you are not logged in:</h2>
      You propably need to login with a Volt Europa account to view this page. Contact your local community lead if you are unsure about your Volt Europa account.<br/>

      <h2>If you are logged in:</h2>
        You propably don't have access to this page.
    </>

    buttons = <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
      <button className="text hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
        <LoginIcon className="icon" />
        <span>
          <Localized id="login" />
        </span>
      </button>
    </a>
  } else if (errorName === 'not_found') {
    title = 'We could not find the requested URL…'
    description = "The URL you requested does currently not exist. Did you type the URL correctly?"

    buttons = <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
      <button className="text hasIcon" style={{ margin: 'var(--basis_x4) 0 0 0' }}>
        <LoginIcon className="icon" />
        <span>
          <Localized id="login" />
        </span>
      </button>
    </a>
  }

  
  return <>
    <h1>{title}</h1>
    <p>{description}</p>
    {buttons}

    <br/> {/* Spacing */}
    <br/>
    <br/>
    <br/>

    <p>
      Please contact <a href="mailto:thomas.rosen@volteuropa.org">thomas.rosen@volteuropa.org</a> if you think this is a bug.<br/>
      Go to <a href="https://volteuropa.org">volteuropa.org</a> for information about the Pan-European Political Movement.
    </p>
  </>

  // <hr/>
  // <p>
  //   <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors">HTTP Error Code</a>: {errorCode}
  // </p>
}
