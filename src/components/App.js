import { useEffect, useState } from 'react'
import classes from './App.module.css'

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
        if (!!data && !!data.user && !!data.user.id) {
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
            <a href="https://volt.link/logout?redirect_to=https://edit.volt.link/"><button>Logout</button></a>
          </>
          : <>
            <h2>edit.volt.link</h2>
            <a href="https://volt.link/login?redirect_to=https://edit.volt.link/"><button>Login</button></a>
          </>
      }
    </header>
    <div className={classes.app}>
    </div>
    <footer>
      <a href="mailto:thomas.rosen@volteuropa.org">Contact</a>
      &nbsp; • &nbsp;
      <a href="https://github.com/voltbonn/edit.volt.link">Source Code</a>
    </footer>
  </>)
}

export default App
