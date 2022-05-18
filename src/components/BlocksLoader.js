import { useRef, useState, useEffect } from 'react'

import { useApolloClient } from '@apollo/client'
import { getBlocks_Query } from '../graphql/queries'

export default function BlocksLoader({ slugs = [], children, ...props }) {
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [blocks, setBlocks] = useState([])

  const apollo_client = useApolloClient()

  useEffect(() => {
    if (Array.isArray(slugs) && slugs.length > 0) {
      apollo_client.query({
        query: getBlocks_Query,
        variables: {
          slugs,
        },
      })
        .then(async ({ errors, data }) => {
          if (mountedRef.current === true) {
            if (Array.isArray(errors) || !Array.isArray(data.blocks)) {
              throw new Error(errors.map(e => e.message).join('\n'))
            } else {
              setBlocks(data.blocks)
            }
          }
        })
        .catch(async error => {
          console.error('error', error)
          setBlocks([])
        })
    } else {
      setBlocks([])
    }
  }, [slugs, apollo_client])

  if (blocks === null || blocks.length === 0) {
    return null
  }

  if (typeof children !== 'function') {
    return null
  }

  return children({...props, blocks, slugs})
}
