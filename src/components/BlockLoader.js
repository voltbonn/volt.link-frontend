import { useRef, useState, useEffect } from 'react'

import { useApolloClient } from '@apollo/client'
import { getBlockBySlug_Query } from '../graphql/queries'

export default function BlockLoader({ slug = null, children, ...props }) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [block, setBlock] = useState(null)

  const apollo_client = useApolloClient()

  useEffect(() => {
    if (!!slug && slug !== null) {
      apollo_client.query({
        query: getBlockBySlug_Query,
        variables: {
          slug,
        },
      })
        .then(async ({ errors, data }) => {
          if (mountedRef.current === true) {
            if (Array.isArray(errors) || data.block === null) {
              throw new Error(errors.map(e => e.message).join('\n'))
            } else {
              const loadedBlock = data.block
              console.log('loadedBlock', loadedBlock)
              setBlock(loadedBlock)
            }
          }
        })
        .catch(async error => {
          console.error('error', error)
        })
    }
  }, [slug, apollo_client, setBlock])

  if (block === null) {
    return null
  }

  if (typeof children !== 'function') {
    return null
  }

  return children({...props, block})
}
