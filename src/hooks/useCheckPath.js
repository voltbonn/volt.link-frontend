import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { checkSlug_Query } from '../graphql/queries'

export default function useCheckSlug() {
  const apollo_client = useApolloClient()

  const handleCheckSlug = useCallback((slug = '') => {
    return new Promise(resolve => {
      apollo_client.query({
        query: checkSlug_Query,
        variables: {
          slug,
        },
      })
        .then(async ({ data }) => {
          if (data.hasOwnProperty('checkSlug')) {
            resolve(data.checkSlug)
          } else {
            resolve(null)
          }
        })
        .catch(async error => {
          console.error('error', error)
          resolve(null)
        })
    })
  }, [apollo_client])

  return handleCheckSlug
}
