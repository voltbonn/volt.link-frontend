import { useState, useEffect } from 'react'

export default function useUser(forceRefetch = false) {
  const [user, setUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (forceRefetch !== true && window.hasOwnProperty('useUser_user') && window.hasOwnProperty('useUser_loggedIn')) {
      setUser(window.useUser_user)
      setLoggedIn(window.useUser_loggedIn)
    }else{
      fetch(`${window.domains.backend}user.json`, {
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
            data.user.username = (!!data.user.email ? data.user.email || '' : '').split('@')[0]

            window.useUser_user = data.user
            window.useUser_loggedIn = true
            setUser(data.user)
            setLoggedIn(true)
          } else {
            window.useUser_user = {}
            window.useUser_loggedIn = false
            setUser({})
            setLoggedIn(false)
          }
        })
        .catch(error => console.error(error))
    }
  }, [forceRefetch, setUser, setLoggedIn])

  return [user, loggedIn]
}
