import { useState, useEffect, useRef } from 'react'

import { useApolloClient } from '@apollo/client'
import { getSelf_Query } from '../graphql/queries'

const defaultUser = {
  userroles: [],
}

export default function useUser(forceRefetch = false) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [user, setUser] = useState(defaultUser)
  const [loggedIn, setLoggedIn] = useState(false)

  const apollo_client = useApolloClient()

  useEffect(() => {
    if (forceRefetch !== true && window.hasOwnProperty('user')) {
      setUser({
        ...window.user,
        userroles: window.user.userroles || [],
      })
      setLoggedIn(window.user.logged_in)
    } else {
      apollo_client.query({
        query: getSelf_Query,
      })
        .then(async ({ data }) => {
          if (mountedRef.current === true) {
            if (data.hasOwnProperty('self') && data.self !== null) {
              window.user = data.self
              setUser({
                ...data.self,
                userroles: data.self.userroles || [],
              })
              setLoggedIn(data.self.logged_in)
            } else {
              setUser(defaultUser)
              setLoggedIn(false)
            }
          }
        })
        .catch(error => {
          console.error(error)
          if (mountedRef.current === true) {
            setUser(defaultUser)
            setLoggedIn(false)
          }
        })
    }
  }, [forceRefetch, setUser, setLoggedIn, apollo_client])

  return {
    ...user,
    loggedIn,
  }
}
