import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { archiveBlocks_Mutation, unarchiveBlocks_Mutation } from '../graphql/mutations.js'

function useArchiveBlock() {
  const apollo_client = useApolloClient()

  const handleArchiveBlock = useCallback(({ _id, archive }) => {
    return apollo_client.mutate({
      mutation: archive ? archiveBlocks_Mutation : unarchiveBlocks_Mutation,
      variables: { ids: [_id] }
    })
  }, [ apollo_client ])

  return handleArchiveBlock
}

export function useArchiveBlocks() {
  const apollo_client = useApolloClient()

  const handleArchiveBlocks = useCallback(({ ids, archive }) => {
    return apollo_client.mutate({
      mutation: archive ? archiveBlocks_Mutation : unarchiveBlocks_Mutation,
      variables: { ids }
    })
  }, [apollo_client])

  return handleArchiveBlocks
}

export default useArchiveBlock
