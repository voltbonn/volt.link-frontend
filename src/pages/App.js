import { useEffect, useState } from 'react'
import classes from './App.module.css'

import {
  Switch,
  Route,
} from 'react-router-dom'

import Localized from '../fluent/Localized.js'
import Header from '../components/Header.js'
import Chooser from './Chooser.js'
import Editor from './Editor.js'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  // const [user, setUser] = useState({})

  useEffect(()=>{
    fetch('https://volt.link/user.json', {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (
          !!data
          && !!data.user
          && !!data.user.id
          && !!data.user.status
        ) {
          // setUser(data.user)
          setLoggedIn(true)
        } else {
          // setUser({})
          setLoggedIn(false)
        }
      })
      .catch(error => console.error(error))
  }, [setLoggedIn])

  const loginLogoutButton = (
    loggedIn
    ? <a href = {`https://volt.link/logout?redirect_to=${encodeURIComponent(window.location.toString())}`}>
        <button className="red" style={{ marginRight: '0' }}><Localized id="logout"/></button>
      </a>
    : <a href={`https://volt.link/login?redirect_to=${encodeURIComponent(window.location.toString())}`}>
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
                <Route path="/">
                  <Chooser rightHeaderActions={loginLogoutButton}/>
                </Route>
              </Switch>
            </>
      }
    </div>
    <footer>
      <a href="mailto:thomas.rosen@volteuropa.org"><Localized id="contact" /></a>
      &nbsp; • &nbsp;
      <a href="https://github.com/voltbonn/edit.volt.link"><Localized id="source_code" /></a>
    </footer>
  </>)
}

export default App
