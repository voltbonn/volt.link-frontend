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
        .then(async ({ errors, data }) => {
          if (Array.isArray(errors) && errors.length > 0) {
            throw errors
          } else if (Array.isArray(data.blocks)) {
            resolve(data.blocks)
          }else{
            throw new Error('Unknown error while loading blocks.')
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
