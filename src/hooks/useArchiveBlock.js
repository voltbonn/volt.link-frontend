import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { archiveBlock_Mutation } from '../graphql/mutations.js'

function useArchiveBlock() {
  const apollo_client = useApolloClient()

  const handleArchiveBlock = useCallback(({ _id }) => {
    return async function () {
      return await apollo_client.mutate({
        mutation: archiveBlock_Mutation,
        variables: { _id }
      })
    }
  }, [ apollo_client ])

  return handleArchiveBlock
}

export default useArchiveBlock
