import React, { useState, useCallback, useEffect } from 'react'

import { useApolloClient } from '@apollo/client'
import { getBlock_Query } from '../graphql/queries'
import { saveBlock_Mutation } from '../graphql/mutations.js'

import { useSnackbar } from 'notistack'

// import { v4 as uuidv4 } from 'uuid'

import { withLocalization } from '../fluent/Localized.js'

// import MultiButton from './MultiButton.js'
// import UrlInput from './UrlInput.js'
// import HtmlInput from './HtmlInput.js'
// import FancyInput from './FancyInput.js'
// import TranslationRepeater from './TranslationRepeater.js'
// import { useOverflowMenu } from '../components/OverflowMenu.js'

import BlockMenu from './BlockMenu.js'

import InlineEditorBlockText from './InlineEditorBlockText.js'
import InlineEditorBlockButton from './InlineEditorBlockButton.js'
// import InlineEditorBlockHeadline from './InlineEditorBlockHeadline.js'

import classes from './InlineEditorBlock.module.css'

// function addIds(array){
//   if (Array.isArray(array)) {
//     return array.map(item => {
//       let new_item = { ...item }
//       if (!new_item.hasOwnProperty('_id')) {
//         new_item._id = uuidv4()
//       }
//       return new_item
//     })
//   }
//   return array
// }

// function stripIDs(array){
//   return [...array].map(obj => {
//     const obj_new = { ...obj }
//     delete obj_new._id
//     return obj_new
//   })
// }

function InlineEditorBlockInbetweenComponent({ type, ...props }){
  let component = null

  switch (type) {
    case 'button':
      component = <InlineEditorBlockButton {...props} />
    break;
    // case 'headline':
    //   component = <InlineEditorBlockHeadline {...props} />
    // break;
    default:
      component = <InlineEditorBlockText {...props} />
  }

  return component
}

function InlineEditorBlockRaw({
  fluentByObject,
  getString,
  defaultContentConfig = {},
  className,
  onChange,
  reorderHandle,
  onRemoveRow,
  actionButton,
  dataset = {},
  addRowBefore,
  addRowAfter,
  permissions = [],

  onInputRef,
  onGoToPrevInput,
  onGoToNextInput,
  onSplitText,
  onMergeToPrevInput,
  onMergeToNextInput,
}) {
  const apollo_client = useApolloClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // const defaultLocale = getString('default_locale')

  const [block, setBlock] = useState({
    _id: defaultContentConfig.blockId || null,
  })
  const _id = block._id || ''
  const type = block.type || null
  const properties = block.properties || {}
  const active = typeof properties.active === 'boolean' ? properties.active : true


  const handleChange_Type = useCallback(newValue => {
    console.log('block', block)
    setBlock({
      ...block,
      type: newValue,
    })
  }, [setBlock, block])

  // const handleChange = useCallback(newBlock => {
  //   setBlock(newBlock)

  //   if (onChange) {
  //     const target = wrapperDiv.current
  //     target.value = newBlock
  //     onChange({ target })
  //   }
  // }, [setBlock, onChange])

  const toggle_active = useCallback(() => {
    setBlock({
      ...block,
      properties: {
        ...block.properties,
        active: !active,
      },
    })
  }, [setBlock, block, active])

  useEffect(() => {
    let snackbarKey = null

    if (_id === '') {
      setBlock({
        type: 'text',
      })
    } else {
      const loadingDataPromise = new Promise(resolve => {
        apollo_client.query({
          query: getBlock_Query,
          variables: {
            _id,
          },
        })
          .then(async ({ data }) => {
            resolve('got-data')

            if (snackbarKey !== null) {
              closeSnackbar(snackbarKey)
            }

            if (typeof data.error === 'string' || !data.block) {
              if (data.error === 'no_edit_permission') {
                enqueueSnackbar(getString('path_editor_edit_permission_error'), {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 5000,
                })
              } else {
                enqueueSnackbar('' + data.error, {
                  variant: 'error',
                  preventDuplicate: true,
                  autoHideDuration: 5000,
                })
              }
            }else{
              const loadedBlock = data.block
              console.log('loadedBlock', loadedBlock)
              setBlock(loadedBlock)
            }
          })
          .catch(async error => {
            console.error('error', error)
            resolve('got-error')

            if (snackbarKey !== null) {
              closeSnackbar(snackbarKey)
            }

            enqueueSnackbar('[could not load data] '+error.message, {
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
    }
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
    setBlock,
    _id,
  ])

  const handleSaveBlock = useCallback((newBlock, callback) => {
    console.log('newBlock', newBlock)
    let snackbarKey = null
    if (true) {
    const loadingDataPromise = new Promise(resolve => {
      apollo_client.mutate({
        mutation: saveBlock_Mutation,
        variables: {
          block: newBlock,
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
            console.log('save-response', data)

            if (typeof callback === 'function') {
              callback(data.saveBlock)
            } else if (!block._id || block._id !== data.saveBlock) {
              setBlock({
                ...block,
                _id: data.saveBlock,
              })
              console.log('newBlock', newBlock)
              onChange({
                dataset,
                value: {
                  ...newBlock,
                  blockId: data.saveBlock,
                }
              })
            }
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

    }
  }, [
    enqueueSnackbar,
    closeSnackbar,
    apollo_client,
    getString,
    setBlock,
    block,
    onChange,
    dataset,
  ])








  // const { updateMenu } = useOverflowMenu()
  //
  // const showMenu = useCallback(() => {
  //   updateMenu({
  //     editorBlock: {
  //       menu: <>
  //         {
  //           !!type
  //           ? (
  //             active
  //             ? <label className={classes.active_toggle_wrapper}>
  //               <button onClick={toggle_active} className={active ? 'text' : 'red'}>
  //                 <VisibilityIcon className={`${classes.active_toggle_icon} ${classes.active}`} /> <span className="hideOnSmallScreen"><Localized id="path_editor_item_active" /></span>
  //               </button>
  //             </label>
  //             : <label className={classes.active_toggle_wrapper}>
  //               <button onClick={toggle_active} className={active ? 'text' : 'red'}>
  //                 <VisibilityOffIcon className={classes.active_toggle_icon} /> <span className="hideOnSmallScreen"><Localized id="path_editor_item_not_active" /></span>
  //               </button>
  //             </label>
  //           )
  //           : null
  //         }
  //
  //         <MultiButton
  //           className={active ? classes.form_active : classes.form_deactivated}
  //           onChange={handleChange_Type}
  //           ariaLabel="Use as"
  //           defaultValue={type}
  //           items={[
  //             { value: 'link', icon: <SVG src={icon_link} className="icon" />, title: getString('path_editor_item_choose_type_value_link') },
  //             { value: 'headline', icon: <SVG src={icon_title} className="icon" />, title: getString('path_editor_item_choose_type_value_headline') },
  //             // { value: 'headline3', title: getString('path_editor_item_choose_type_value_headline3') },
  //             { value: 'text', icon: <SVG src={icon_notes} className="icon" />, title: getString('path_editor_item_choose_type_value_text') }
  //           ]}
  //         />
  //       </>
  //     }
  //   })
  // }, [
  //   updateMenu,
  //   active,
  //   toggle_active,
  //   type,
  //   getString,
  //   handleChange_Type,
  // ])

  return <div
    className={`${classes.block} ${!!type ? '' : classes.chooseTypeScreen} ${className}`}
    {...dataset}
  >

    <BlockMenu
      {...{
        type,
        setType: handleChange_Type,
        toggle_active,
        active,
        onRemoveRow,
        addRowBefore,
        addRowAfter,
      }}

      trigger={props => (
        <div
          {...props}
          className={classes.reorderHandle}
        >
          {reorderHandle}
        </div>
      )}
    />

    <div className={`${classes.block_input} ${(active ? classes.form_active : classes.form_deactivated)}`}>
    {
      !!type
        ? <InlineEditorBlockInbetweenComponent
            type={type}
            block={block}
            onChange={handleSaveBlock}
            onSaveBlock={handleSaveBlock}

            onInputRef={onInputRef}
            onGoToPrevInput={onGoToPrevInput}
            onGoToNextInput={onGoToNextInput}
            onSplitText={onSplitText}
            onMergeToPrevInput={onMergeToPrevInput}
            onMergeToNextInput={onMergeToNextInput}

            onAddRowAfter={addRowAfter}
          />
        : null
    }
    </div>

  </div>
}

const InlineEditorBlock = withLocalization(InlineEditorBlockRaw)

export default InlineEditorBlock


/*
          <TranslationRepeater
            onChange={handleChange_Text}
            defaultValue={text}
            addDefaultValue={() => ({ _id: uuidv4(), locale: defaultLocale, value: '' })}
            addButtonText={getString('path_editor_add_translation')}
            style={{
              marginTop: 'var(--basis_x2)'
            }}
            input={InputWithLocal_props => <HtmlInput
              placeholder={
                type === 'text'
                ? getString('path_editor_item_text_label')
                : getString('path_editor_item_title_label')
              }
              {...InputWithLocal_props}
              style={{ ...InputWithLocal_props.style, margin: '0' }}
              linebreaks={ type === 'text' }
              className={type_classname}
            />}
          />

          {
            type === 'link'
              ? <FancyInput>
                {({ setError }) => (
                  <UrlInput
                    onError={setError}
                    onChange={handleChange_Link}
                    type="text"
                    defaultValue={link}
                    placeholder={getString('path_editor_item_link_label')}
                    style={{
                      marginRight: '0',
                      marginBottom: '0',
                      marginLeft: '0',
                      width: 'calc(100% - var(--basis_x2))',
                    }}
                  />
                )}
              </FancyInput>
              : null
          }
*/
