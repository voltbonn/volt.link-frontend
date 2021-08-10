import classes from './App.module.css'

import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom'

import { withLocalization } from '../fluent/Localized.js'
import { useHistory } from 'react-router-dom'

import Localized from '../fluent/Localized.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'
import Chooser from './Chooser.js'
import Shortcode from './Shortcode.js'
import Editor from './Editor.js'

import MultiButton from '../components/MultiButton.js'

function App({ getString }) {
  const [, loggedIn] = useUser()

  const history = useHistory()
  const menuRouteMatch = useRouteMatch("/:slug")
  const selected_route = menuRouteMatch ? menuRouteMatch.params.slug : ''

  const handleMenu = new_selected => {
    switch (new_selected) {
      case 'shortcode':
        history.push('/shortcode')
        break
      case 'list':
        window.open(`${window.domains.backend}list`,'_blank')
        break
      default:
        history.push('/')
    }
  }

  const loginLogoutButton = (
    loggedIn
      ? <>
        <MultiButton
          onChange={handleMenu}
          ariaLabel={getString('main_menu')}
          defaultValue={selected_route}
          items={[
            { value: '', title: getString('menu_micropages') },
            { value: 'shortcode', title: getString('menu_url_shortener') },
            { value: 'list', title: getString('menu_list') },
          ]}
        />
        <a href={`${window.domains.backend}logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
          <button className="red" style={{ marginRight: '0' }}><Localized id="logout"/></button>
        </a>
      </>
      : <a href={`${window.domains.backend}login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
        <button style={{ marginRight: '0' }}><Localized id="login"/></button>
      </a>
  )

  return (<>
    <div className={classes.app}>
      {
        !loggedIn
          ? <div>
            <Header
              title="edit.volt.link"
              rightActions={loginLogoutButton}
            />
            <p><Localized id="login_prompt"/></p>
          </div>
          : <>
              <Switch>
                <Route path="/edit/:code">
                  <Editor />
                </Route>
                <Route path="/shortcode">
                  <Shortcode rightHeaderActions={loginLogoutButton} />
                </Route>
                <Route path="/">
                  <Chooser rightHeaderActions={loginLogoutButton} />
                </Route>
              </Switch>
            </>
      }
    </div>
    <footer>
      <a href="mailto:thomas.rosen@volteuropa.org"><Localized id="contact" /></a>
      &nbsp; • &nbsp;
      <a href="https://github.com/voltbonn/edit.volt.link" target="_blank" rel="noopener noreferrer"><Localized id="source_code" /></a>
    </footer>
  </>)
}

export default withLocalization(App)
