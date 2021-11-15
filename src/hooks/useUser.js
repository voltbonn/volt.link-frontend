import { useState, useEffect } from 'react'

import { useApolloClient } from '@apollo/client'
import { getSelf_Query } from '../graphql/queries'

export default function useUser(forceRefetch = false) {
  const [user, setUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)

  const apollo_client = useApolloClient()

  useEffect(() => {
    if (forceRefetch !== true && window.hasOwnProperty('useUser_user') && window.hasOwnProperty('useUser_loggedIn')) {
      setUser(window.useUser_user)
      setLoggedIn(window.useUser_loggedIn)
    }else{
      apollo_client.query({
        query: getSelf_Query,
      })
        .then(async ({ data }) => {
          if (data.hasOwnProperty('self')) {
            window.useUser_user = data.self
            window.useUser_loggedIn = data.self.logged_in
            setUser(data.self)
            setLoggedIn(data.self.logged_in)
          } else {
            window.useUser_user = {}
            window.useUser_loggedIn = false
            setUser({})
            setLoggedIn(false)
          }
        })
        .catch(error => {
          window.useUser_user = {}
          window.useUser_loggedIn = false
          setUser({})
          setLoggedIn(false)
        })
    }
  }, [forceRefetch, setUser, setLoggedIn, apollo_client])

  return {
    ...user,
    loggedIn,
  }
}
