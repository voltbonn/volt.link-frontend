import { useState, useEffect, useRef } from 'react'

import { useApolloClient } from '@apollo/client'
import { getSelf_Query } from '../graphql/queries'

export default function useUser(forceRefetch = false) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [user, setUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)

  const apollo_client = useApolloClient()

  useEffect(() => {
    apollo_client.query({
      query: getSelf_Query,
    })
      .then(async ({ data }) => {
        if (mountedRef.current === true) {
          if (data.hasOwnProperty('self')) {
            setUser(data.self)
            setLoggedIn(data.self.logged_in)
          } else {
            setUser({})
            setLoggedIn(false)
          }
        }
      })
      .catch(error => {
        console.error(error)
        if (mountedRef.current === true) {
          setUser({})
          setLoggedIn(false)
        }
      })
  }, [forceRefetch, setUser, setLoggedIn, apollo_client])

  return {
    ...user,
    loggedIn,
  }
}
