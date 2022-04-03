import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { blockMatchesRoles_Query } from '../graphql/queries'

export default function useBlockMatchesRoles() {
  const apollo_client = useApolloClient()

  const handleLoadRoles = useCallback((_id, roles = []) => {
    return new Promise(resolve => {
      if (!_id || _id === '') {
        resolve(false)
      } else {
        apollo_client.query({
          query: blockMatchesRoles_Query,
          variables: {
            _id,
            roles,
          },
        })
          .then(async ({ data }) => {
            if (data.hasOwnProperty('blockMatchesRoles')) {
              resolve(data.blockMatchesRoles)
            }else{
              resolve(false)
            }
          })
          .catch(async error => {
            console.error('error', error)
            resolve(false)
          })
      }
    })
  }, [ apollo_client ])

  return handleLoadRoles
}
