import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { getBlocks_Query } from '../graphql/queries'

function useLoadBlocks() {
  const apollo_client = useApolloClient()

  const handleLoadBlocks = useCallback(variables => {
    return new Promise(resolve => {
      apollo_client.query({
        query: getBlocks_Query,
        variables,
      })
        .then(async ({ data }) => {
          if (typeof data.error === 'string' || !data.blocks) {
            console.error(data.error)
            resolve([])
          }else{
            resolve(data.blocks || [])
          }
        })
        .catch(async error => {
          console.error('error', error)
          resolve([])
        })
    })
  }, [apollo_client])

  return handleLoadBlocks
}

export default useLoadBlocks
