import { useCallback } from 'react'

import { useLocalization } from '../fluent/Localized.js'

import { useApolloClient } from '@apollo/client'
import { getBlocksWithContent_Query, checkSlug_Query } from '../graphql/queries'

import { useSnackbar } from 'notistack'

function useLoadPage() {
  const { getString } = useLocalization()

  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const loadBlocks = useCallback(slugOrId => {
    return new Promise(final_resolve => {
      if (!slugOrId || slugOrId === '') {
        final_resolve(null)
      } else {
        let preloaded_blocks = []
        if (
          typeof window.SERVER_DATA === 'object'
          && window.SERVER_DATA !== null
          && !Array.isArray(window.SERVER_DATA)
        ) {
          preloaded_blocks = window.SERVER_DATA.preloaded_blocks || []
        }

        console.log('preloaded_blocks', preloaded_blocks)

        if (!Array.isArray(preloaded_blocks)) {
          preloaded_blocks = []
        }

        preloaded_blocks = preloaded_blocks
          .filter(block => block?._id !== null && (block?._id === slugOrId || block?.properties?.slug === slugOrId))

        if (preloaded_blocks.length > 0) {
          window.SERVER_DATA = { preloaded_blocks: null }
          final_resolve(preloaded_blocks)
        } else {
          apollo_client.query({
            query: getBlocksWithContent_Query,
            variables: {
              slugs: [slugOrId],
              ids: [slugOrId].filter(id => id.length === 24), // A very basic check. A mongoid is 24 chars long).But it can still
            },
          })
            .then(({ errors, data }) => {
              if (Array.isArray(errors)) {
                final_resolve(null)
              } else if (Array.isArray(data.blocks) && data.blocks.length > 0) {
                const loadedBlocks = data.blocks
                  .filter(block => block?._id !== null)

                  if (loadedBlocks.length > 0) {
                    final_resolve(loadedBlocks)
                  } else {
                    final_resolve(null)
                  }
              } else {
                final_resolve(null)
              }
            })
            .catch(error => {
              console.error('error', error)
              final_resolve(null)
            })
        }
      }
    })
  }, [apollo_client])

  const loadSlugInfos = useCallback(slug => {
    return new Promise(final_resolve => {
      if (!slug || slug === '') {
        final_resolve(null)
      } else {
        apollo_client.query({
          query: checkSlug_Query,
          variables: {
            slug,
          },
        })
          .then(({ errors, data }) => {
            if (Array.isArray(errors)) {
              final_resolve(null)
            } else if (data.block !== null) {
              final_resolve(data.block)
            } else {
              final_resolve(null)
            }
          })
          .catch(error => {
            console.error('error', error)
            final_resolve(null)
          })
      }
    })
  }, [apollo_client])

  const handleLoadPage = useCallback(slugOrId => {
    return new Promise((final_resolve, final_reject) => {
      let snackbarKey = null

      if (!slugOrId || slugOrId === '') {
        final_reject({ code: 'error_404' })
      } else {
        const loadingDataPromise = new Promise(async resolve => {
          let done = false

          if (done === false && typeof slugOrId === 'string' && slugOrId !== '') {
            const blocks = await loadBlocks(slugOrId)
            if (Array.isArray(blocks)) {
              if (blocks.length === 1) {
                // This gets called for "/:slug"
                // slugOrId is a slug
                // redirect it accoringly
                done = true
                resolve('got-data')

                if (snackbarKey !== null) {
                  closeSnackbar(snackbarKey)
                }

                final_resolve(blocks[0])
              } else if (blocks.length > 1) {
                done = true
                resolve('got-error')

                if (snackbarKey !== null) {
                  closeSnackbar(snackbarKey)
                }

                final_reject({
                  code: 'error_300',
                  blocks,
                })

                enqueueSnackbar('Error 300: Multiple blocks found..', { // todo: remove me
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 2000,
                })
              }
            }
          }

          if (
            done === false
            && typeof slugOrId === 'string' && slugOrId !== ''
          ) {
            const {
              existsAsSlug = false,
              existsAsId = false,
            } = await loadSlugInfos(slugOrId) || {}

            done = true
            resolve('got-error')

            if (snackbarKey !== null) {
              closeSnackbar(snackbarKey)
            }

            if (existsAsId === true || existsAsSlug === true) {
              // show error page: now permission to view this block
              final_reject({ code: 'error_403' })

              enqueueSnackbar('Error 403: You are not allowed to view this page.', { // todo: remove me
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 2000,
              })
            } else {
              // show error page: the block does not exist
              final_reject({ code: 'error_404' })

              enqueueSnackbar('Error 404: The page does not exist.', { // todo: remove me
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 2000,
              })
            }
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
    loadBlocks,
    loadSlugInfos,
    enqueueSnackbar,
    closeSnackbar,
    getString,
  ])

  return handleLoadPage
}

export default useLoadPage
