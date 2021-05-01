import { useEffect } from 'react'
import classes from './App.module.css'

function App() {

  useEffect(()=>{
    fetch('https://volt.link/user.json', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
  }, [])

  return (<>
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
