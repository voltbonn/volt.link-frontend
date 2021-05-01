import { useEffect } from 'react'
import classes from './App.module.css'

function App() {

  useEffect(()=>{
    fetch('https://volt.link/user.json')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
  }, [])

  return (<>
    <div className={classes.app}>
    </div>
    <footer>
      <a href="mailto:thomas.rosen@volteuropa.org">Contact</a>
    </footer>
  </>)
}

export default App
