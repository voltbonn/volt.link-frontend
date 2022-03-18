import { useCallback } from 'react'

import { useLocalization } from '../fluent/Localized.js'

import { useApolloClient } from '@apollo/client'
import { saveBlock_Mutation } from '../graphql/mutations.js'

import { useSnackbar } from 'notistack'

function removeProperty(obj, prop) {
  // remove property from objects, arrays and sub-objects

  obj = JSON.parse(JSON.stringify(obj)) // clone object to make everything mutable

  if (obj.hasOwnProperty(prop)) {
    delete obj[prop]
  }
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj[i] == 'object' && obj[i] !== null) {
        removeProperty(obj[i], prop)
      }
    }
  }

  return obj
}

function useSaveBlock() {
  const { getString } = useLocalization()

  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleSaveBlock = useCallback((initialBlock) => {
    return new Promise(final_resolve => {
      let snackbarKey = null

      let newBlock = {...initialBlock}
      newBlock = removeProperty(newBlock, '__typename')
      if (newBlock.hasOwnProperty('content') && Array.isArray(newBlock.content)) {
        newBlock.content = newBlock.content.map(contentConfig => ({
          blockId: contentConfig.blockId,
        }))
      }

      const loadingDataPromise = new Promise(resolve => {
        apollo_client.mutate({
          mutation: saveBlock_Mutation,
          variables: {
            block: newBlock
          },
        })
          .then(async ({ data }) => {
            resolve('got-data')

            if (snackbarKey !== null) {
              closeSnackbar(snackbarKey)
            }

            if (typeof data.error === 'string') {
              if (data.error === 'no_edit_permission') {
                enqueueSnackbar(getString('path_editor_edit_permission_error'), {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 2000,
                })
              } else {
                enqueueSnackbar('' + data.error, {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 2000,
                })
              }
            } else {
              final_resolve({
                ...initialBlock,
                _id: data.saveBlock,
              })

              enqueueSnackbar(getString('path_editor_status_saved'), {
                variant: 'success',
                preventDuplicate: false,
                autoHideDuration: 2000,
              })
            }
          })
          .catch(async error => {
            console.error(error)
            resolve('got-error')

            if (snackbarKey !== null) {
              closeSnackbar(snackbarKey)
            }

            enqueueSnackbar(getString('path_editor_status_error_while_saving', {
              error: error.message,
            }), {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 2000,
            })
          })
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
            snackbarKey = enqueueSnackbar(getString('path_editor_status_started_saving'), {
              persist: true,
              preventDuplicate: true,
            })
          }
        })
        .catch(error => console.error)

    })
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
  ])

  return handleSaveBlock
}

export default useSaveBlock
