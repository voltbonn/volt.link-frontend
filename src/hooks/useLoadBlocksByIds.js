import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { getBlocks_Query } from '../graphql/queries'

function useLoadBlocksByIds() {
  const apollo_client = useApolloClient()

  const handleLoadBlocksByIds = useCallback(ids => {
    return new Promise(resolve => {
      if (Array.isArray(ids) || ids.length > 0) {
        apollo_client.query({
          query: getBlocks_Query,
          variables: {
            ids,
          },
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
      } else {
        resolve([])
      }
    })
  }, [apollo_client])

  return handleLoadBlocksByIds
}

export default useLoadBlocksByIds
