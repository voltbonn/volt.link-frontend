import { useCallback } from 'react'

import { useLocalization } from '../fluent/Localized.js'

import { useApolloClient } from '@apollo/client'
import { getBlock_Query, getBlockBySlug_Query, checkSlug_Query } from '../graphql/queries'

import { useSnackbar } from 'notistack'

function useLoadPage() {
  const { getString } = useLocalization()

  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const loadBlock = useCallback(_id => {
    return new Promise(final_resolve => {
      if (!_id || _id === '') {
        final_resolve(null)
      } else {
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
          final_resolve(preloaded_block)
        } else {
          apollo_client.query({
            query: getBlock_Query,
            variables: {
              _id,
            },
          })
            .then(({ errors, data }) => {
              if (Array.isArray(errors)) {
                final_resolve(null)
              } else if (data.block !== null && data.block._id !== null) {
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
      }
    })
  }, [apollo_client])

  const loadBlockBySlug = useCallback(slug => {
    return new Promise(final_resolve => {
      if (!slug || slug === '') {
        final_resolve(null)
      } else {
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
          && preloaded_block.hasOwnProperty('properties')
          && preloaded_block.properties.hasOwnProperty('slug')
          && preloaded_block.properties.slug === slug
        ) {
          window.SERVER_DATA = { preloaded_block: null }
          final_resolve(preloaded_block)
        } else {
          apollo_client.query({
            query: getBlockBySlug_Query,
            variables: {
              slug,
            },
          })
            .then(({ errors, data }) => {
              if (Array.isArray(errors)) {
                final_resolve(null)
              } else if (data.block !== null && data.block._id !== null) {
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
            const block = await loadBlockBySlug(slugOrId)
            if (!!block && !!block._id) {
              // This gets called for "/:slug"
              // slugOrId is a slug
              // redirect it accoringly
              done = true
              resolve('got-data')

              if (snackbarKey !== null) {
                closeSnackbar(snackbarKey)
              }

              final_resolve(block)
            }

            if (done === false) {
              // This gets called for "/:id"
              // check if slugOrId is ID by finding it in the database
              const block = await loadBlock(slugOrId)
              if (!!block && !!block._id) {
                done = true
                resolve('got-data')

                if (snackbarKey !== null) {
                  closeSnackbar(snackbarKey)
                }

                final_resolve(block)
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
    loadBlock,
    loadBlockBySlug,
    loadSlugInfos,
    enqueueSnackbar,
    closeSnackbar,
    getString,
  ])

  return handleLoadPage
}

export default useLoadPage
