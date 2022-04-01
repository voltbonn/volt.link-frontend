import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { checkPath_Query } from '../graphql/queries'

export default function useCheckPath() {
  const apollo_client = useApolloClient()

  const handleCheckPath = useCallback((path = '') => {
    return new Promise(resolve => {
      apollo_client.query({
        query: checkPath_Query,
        variables: {
          path,
        },
      })
        .then(async ({ data }) => {
          if (data.hasOwnProperty('checkPath')) {
            resolve(data.checkPath)
          } else {
            resolve(null)
          }
        })
        .catch(async error => {
          console.error('error', error)
          resolve(null)
        })
    })
  }, [apollo_client])

  return handleCheckPath
}
