import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'

function useMutation() {
  const apollo_client = useApolloClient()

  const handleMutation = useCallback(option => {
    return new Promise((resolve,reject) => {
      apollo_client.mutate(option)
        .then(({ data }) => {
          if (typeof data.error === 'string') {
            reject(data.error)
          } else {
            resolve(data)
          }
        })
        .catch(reject)
    })
  }, [ apollo_client ])

  return handleMutation
}

export default useMutation
