import React, { useState, useEffect } from 'react'

import classes from './App.module.css'

import {
  Routes,
  Route,
  useLocation,
  useMatch,
  // useNavigate,
} from 'react-router-dom'

import { SidebarProvider, Sidebar, SidebarContent, Main } from '../components/Sidebar.js'
// import Shortcode from './Shortcode.js'
import Editor from './Editor.js'
import Viewer from './Viewer.js'

// function useScrollMemory() {
//   // const navigate = useNavigate()
//   const location = useLocation()
//
//   const pathRef = useRef(null)
//
//   useEffect(() => {
//     console.log('location', location)
//     pathRef.current = location.pathname
//   }, [location])
//
//   useEffect(() => {
//     // Listen for location changes and set the scroll position accordingly.
//     const setFromHistoryState = state => {
//       console.log('popstate-state', state)
//       let scrollY = 0
//       if (state && state.scrollY) {
//         scrollY = state.scrollY
//       }
//       console.log('A-popstate-scrollY', scrollY)
//       if (scrollY < 100) {
//         scrollY = 0
//       }
//
//       console.log('B-popstate-scrollY', scrollY)
//       window.scrollTo(0, scrollY)
//       setTimeout(()=>{
//         window.scrollTo(0, scrollY)
//       }, 500)
//     }
//
//     setFromHistoryState(window.history.state)
//     const popstateListener = event => {
//       if (event.type === 'popstate') {
//         setFromHistoryState(event.state)
//       }
//     }
//     window.addEventListener('popstate', popstateListener)
//
//     const scrollListener = () => {
//       const newScrollY = window.scrollY
//       console.log(' ')
//       console.log('scrollListener-window.history.state', window.history.state)
//       console.log('scrollListener-newScrollY', newScrollY)
//       console.log('pathRef.current', pathRef.current)
//
//       if (typeof pathRef.current === 'string') {
//         window.history.replaceState(
//           {
//             ...(window.history.state || {}),
//             scrollY: newScrollY,
//           },
//           '',
//           pathRef.current
//         )
//         console.log('window.history.state', window.history.state)
//
//         // navigate(pathRef.current, {
//         //   replace: true,
//         //   state: {
//         //     // ...(window.history.state || {}),
//         //     scrollY: newScrollY,
//         //   },
//         // })
//       }
//     }
//     window.addEventListener('scroll', scrollListener)
//
//     // Unregister listener when component unmounts.
//     return () => {
//       console.log('Unregister')
//       window.removeEventListener('popstate', popstateListener)
//       window.removeEventListener('scroll', scrollListener)
//     }
//   }, [])
// }

function App() {
  // useScrollMemory()

  const matchesStartpage = useMatch('/')
  const location = useLocation()

  const [customLocation, setCustomLocation] = useState({})

  useEffect(() => {
    //    /slug=id/suffix
    //    /slugOrId/suffix

    const slugAndIdRegex = /^\/([^=/]*)(?:=?)([^=/]*)(.*)/

    const slugAndIdMatch = location.pathname.match(slugAndIdRegex)
    const slugOrId = slugAndIdMatch[1]
    let id = slugAndIdMatch[2]
    let suffix = slugAndIdMatch[3]

    if (!id && slugOrId) {
      id = slugOrId
    }

    if (
      id !== ''
      && suffix !== '/edit'
      && suffix !== '/view'
    ) {
      suffix = '/view'
    }

    const newPathname = `/${id}${suffix}`
    if (customLocation.pathname !== newPathname) {
      // TODO: save scroll position
      


      setCustomLocation({
        pathname: newPathname,
      })
    }
  }, [ location, customLocation, setCustomLocation ])

  return (<>
    <div className={`${classes.app} ${matchesStartpage ? classes.isStartpage : ''}`}>
      <SidebarProvider>
        {
          matchesStartpage
          ? null
          : <Sidebar />
        }
        <Main>
          <Routes location={customLocation}>
            <Route path="/:id/view" element={<Viewer />} />
            <Route path="/:id/edit" element={<Editor />} />
            {/* <Route path="/shortcode" element={<Shortcode />} /> */}
            <Route path="/" element={<SidebarContent />} />
          </Routes>
        </Main>
      </SidebarProvider>
    </div>
  </>)
}

export default App
