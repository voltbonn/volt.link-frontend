import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { getLastModifiedBlocks_Query } from '../graphql/queries'

export default function useLoadLastModifiedBlocks() {
  const apollo_client = useApolloClient()

  const handleLoadLastModifiedBlocks = useCallback(variables => {
    return new Promise(resolve => {
      apollo_client.query({
        query: getLastModifiedBlocks_Query,
        variables,
      })
        .then(async ({ errors, data }) => {
          console.log('errors', errors)
          if (Array.isArray(errors) && errors.length > 0) {
            throw errors
          } else if (Array.isArray(data.lastModifiedBlocks)) {
            resolve(
              data.lastModifiedBlocks
              .sort((a, b) => {
                return new Date(b.metadata.modified) - new Date(a.metadata.modified)
              })
            )
          } else {
            throw new Error('Unknown error while loading blocks.')
          }
        })
        .catch(async error => {
          console.error('error', error)
          resolve([])
        })
    })
  }, [apollo_client])

  return handleLoadLastModifiedBlocks
}
