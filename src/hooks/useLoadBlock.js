import { useCallback } from 'react'

import { useLocalization } from '../fluent/Localized.js'

import { useApolloClient } from '@apollo/client'
import { getBlock_Query } from '../graphql/queries'

import { useSnackbar } from 'notistack'

function useLoadBlock() {
  const { getString } = useLocalization()

  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleLoadBlock = useCallback(_id => {
    return new Promise(final_resolve => {
    let snackbarKey = null

    if (!_id || _id === '') {
      final_resolve({
        type: 'text',
      })
    } else {
      const loadingDataPromise = new Promise(resolve => {
        let preloaded_block = null
        if (
          typeof window.SERVER_DATA === 'object'
          && window.SERVER_DATA !== null
          && !Array.isArray(window.SERVER_DATA)
        ) {
          preloaded_block = window.SERVER_DATA.preloaded_block || null
        }

        if (
          typeof preloaded_block === 'object'
          && preloaded_block !== null
          && preloaded_block.hasOwnProperty('_id')
          && preloaded_block._id === _id
        ) {
          window.SERVER_DATA = { preloaded_block: null }
          resolve('got-preloaded-data')
          final_resolve(preloaded_block)
        } else {
          apollo_client.query({
            query: getBlock_Query,
            variables: {
              _id,
            },
          })
            .then(async ({ errors, data }) => {
              resolve('got-data')

              if (snackbarKey !== null) {
                closeSnackbar(snackbarKey)
              }

              if (Array.isArray(errors)) {
                enqueueSnackbar(errors.map(e => e.message).join('\n'), {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 5000,
                })
                final_resolve(null)
              } else if (data.block === null) {
                enqueueSnackbar(`Could not load the content.`, {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 5000,
                })
                final_resolve(null)
              } else {
                const loadedBlock = data.block
                final_resolve(loadedBlock)
              }
            })
            .catch(async error => {
              console.error('error', error)
              resolve('got-error')

              if (snackbarKey !== null) {
                closeSnackbar(snackbarKey)
              }

              enqueueSnackbar('[could not load data] ' + error.message, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 2000,
              })
            })
        }
      })

      // Show a loading-info-snackbar if loading the data takes too long.
      Promise.race([
        new Promise(resolve => {
          setTimeout(() => {
            resolve('show-loading')
          }, 300)
        }),
        loadingDataPromise,
      ])
        .then(response => {
          if (response === 'show-loading') {
            snackbarKey = enqueueSnackbar(getString('path_editor_status_started_loading'), {
              persist: true,
              preventDuplicate: true,
            })
          }
        })
        .catch(error => console.error)
    }
    })
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
  ])

  return handleLoadBlock
}

export default useLoadBlock
