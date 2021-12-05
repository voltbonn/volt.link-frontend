import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { deleteBlock_Mutation } from '../graphql/mutations.js'

function useSaveBlock() {
  const apollo_client = useApolloClient()

  const handleSaveBlock = useCallback(({ _id }) => {
    return new Promise(resolve => {
      apollo_client.mutate({
        mutation: deleteBlock_Mutation,
        variables: {
          _id,
        },
      })
        .then(async ({ data }) => {
          resolve('got-data')
        })
        .catch(async error => {
          console.error(error)
          resolve('got-error')
        })
    })
  }, [ apollo_client ])

  return handleSaveBlock
}

export default useSaveBlock
