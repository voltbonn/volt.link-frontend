import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { archiveBlock_Mutation, unarchiveBlock_Mutation } from '../graphql/mutations.js'

function useArchiveBlock() {
  const apollo_client = useApolloClient()

  const handleArchiveBlock = useCallback(({ _id, archive }) => {
    return apollo_client.mutate({
      mutation: archive ? archiveBlock_Mutation : unarchiveBlock_Mutation,
      variables: { _id }
    })
  }, [ apollo_client ])

  return handleArchiveBlock
}

export default useArchiveBlock
