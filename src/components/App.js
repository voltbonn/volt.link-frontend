import { useEffect, useState } from 'react'
import classes from './App.module.css'

import {
  Switch,
  Route,
} from 'react-router-dom'

import Chooser from './Chooser.js'
import Editor from './Editor.js'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  useEffect(()=>{
    fetch('https://volt.link/user.json', {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (
          !!data
          && !!data.user
          && !!data.user.id
          && !!data.user.status
        ) {
          setUser(data.user)
          setLoggedIn(true)
        } else {
          setUser({})
          setLoggedIn(false)
        }
      })
      .catch(error => console.error(error))
  }, [setUser, setLoggedIn])

  return (<>
    <header>
      {
        loggedIn
          ? <>
            <h2>Hi {user.displayName}!</h2>
            <a href={`https://volt.link/logout?redirect_to=${encodeURIComponent(window.location.toString())}`}><button className="red">Logout</button></a>
          </>
          : <>
            <h2>edit.volt.link</h2>
            <a href={`https://volt.link/login?redirect_to=${encodeURIComponent(window.location.toString())}`}><button>Login</button></a>
          </>
      }
    </header>
    <div className={classes.app}>
      {
        !loggedIn
          ? <p>Login in the upper right corner, to edit volt.link urls.</p>
          : <>
              <Switch>
                <Route path="/edit/:code">
                  <Editor />
                </Route>
                <Route path="/">
                  <Chooser />
                </Route>
              </Switch>
            </>
      }
    </div>
    <footer>
      <a href="mailto:thomas.rosen@volteuropa.org">Contact</a>
      &nbsp; • &nbsp;
      <a href="https://github.com/voltbonn/edit.volt.link">Source Code</a>
    </footer>
  </>)
}

export default App
