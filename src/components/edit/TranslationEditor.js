import React, { useEffect, useState, useCallback } from 'react'

import {
  Modal,
} from '@mui/material'

import { Localized } from '../../fluent/Localized.js' // useLocalization

import classes from './TranslationEditor.module.css'

import HtmlInput from './HtmlInput.js'
import InputWithLocal from './InputWithLocal.js'
import ViewerAuto from '../view/ViewerAuto.js'
import LocaleSelect from './LocaleSelect.js'
import Repeater from '../Repeater.js'

import useSaveBlock from '../../hooks/useSaveBlock.js'
import useLoadBlocks from '../../hooks/useLoadBlocks.js'

function SimpleTranslationRepeater({ onSaveProperty, block, isFirst }) {

  const addDefaultValue = () => ({
    locale: null,
    value: '',
  })

  let translations = block.properties.translations || []
  if (translations.length === 0) {
    translations = [addDefaultValue]
  }

  const onRepeaterChange = useCallback(newTranslations => {
    newTranslations = newTranslations
      .map(translation => ({
        ...translation,
        text: translation.value || '',
      }))

    onSaveProperty('translations', newTranslations)
  }, [ onSaveProperty ])

  const onBlockLocaleChange = useCallback(newLocale => {
    onSaveProperty('locale', newLocale)
  }, [ onSaveProperty ])

  const block2display = { ...block }
  if (isFirst === true && block2display.type === 'page') {
    block2display.type = 'text'
    block2display.properties.text_style = 'h1'
  }

  return <div style={{
    width: '100%',
  }}>

    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: 'var(--basis)',
      gap: 'var(--basis)',
    }}>
      <LocaleSelect
        onChange={onBlockLocaleChange}
        defaultValue={block.properties.locale || null}
      />

      <ViewerAuto
        block={block2display}
        style={{
          margin: '0',
          minHeight: '30px',
        }}
        actions={{
          click: false,
        }}
      />
    </div>

    <Repeater
      onChange={onRepeaterChange}
      defaultValue={translations}
      addDefaultValue={addDefaultValue}
      addButtonText="+"
      render={
        ({ defaultValue, ...repeater_props }) => {
          const {
            onChange,
            ...other_repeater_props
          } = repeater_props

          const locale = defaultValue.locale
          const value = defaultValue.text
          return <InputWithLocal
            onBlur={onChange}
            locale={locale}
            defaultValue={value}
            style={{
              marginBottom: 'var(--basis)',
            }}
            {...other_repeater_props}
          >
            {InputWithLocal_props => <HtmlInput
              {...InputWithLocal_props}
              style={{
                ...InputWithLocal_props.style,
                margin: '0',
              }}
            />}
          </InputWithLocal>
        }
      }
    />
  </div>
}

function TranslationEditor({
  defaultBlock = {},
  open = false,
  onSaveProperty, // to not overwrite the translatins by the PageEditor
  onClose,
}) {

  const [blocks, setBlocks] = useState([])

  const loadBlocks = useLoadBlocks()
  useEffect(() => {
    async function loadContentBlocks () {
      const ids2load = [
        ...defaultBlock.content
          .filter(contentConfig =>
            contentConfig.hasOwnProperty('blockId')
            && contentConfig.hasOwnProperty('block')
          )
          .map(contentConfig => contentConfig.blockId || contentConfig.block._id),
      ]

      let loadedBlocks = []
      if (ids2load.length > 0) {
        loadedBlocks = await loadBlocks({ ids: ids2load })
      }

      let contentBlocks = ids2load.map(id => { // map to the ids to keep the order
        const block = loadedBlocks.find(block => block._id === id)
        if (
          block
          && block.type !== 'divider'
          && !!block.properties.text
        ) {
          return block
        } else {
          return null
        }
      })
      .filter(Boolean) // remove null values

      return contentBlocks
    }

    if (blocks.length === 0) {
      loadContentBlocks()
        .then(contentBlocks => {
          const newBlocks = [
            defaultBlock,
            ...contentBlocks,
          ]

          setBlocks(newBlocks)
        })
    } else if (JSON.stringify(defaultBlock) !== JSON.stringify(blocks[0])) {
      // replace the first block of blocks with defaultBlock
      setBlocks([
        defaultBlock,
        ...blocks.slice(1),
      ])
    }
  }, [ defaultBlock, loadBlocks, setBlocks, blocks ])

  const saveBlock = useSaveBlock()
  const onSaveChildProperty = useCallback((block, key, value) => {
    const newBlock = {
      ...block,
      properties: {
        ...block.properties,
        [key]: value,
      },
    }

    saveBlock(newBlock)
      .then(gottenBlock => { // only the id changed in gottenBlock      
        const blockId = newBlock._id

        // find the block in the blocks array by _id
        const blockIndex = blocks.findIndex(block => block._id === blockId)
        
        // replace the block at blockIndex in the blocks array by newBlock
        const newBlocks = [
          ...blocks.slice(0, blockIndex),
          newBlock,
          ...blocks.slice(blockIndex + 1),
        ]

        setBlocks(newBlocks)
      })
  }, [ saveBlock, blocks, setBlocks ])

  if (!open) {
    return null
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop={true}
      style={{
        zIndex: '1000',
      }}
    >
      <>
        <div className={classes.backdrop} onClick={onClose}></div>

        <div className={classes.dialog}>

          
          <div className={classes.actions}>
            <h1 style={{ margin: '0 0 var(--basis_x4) 0' }}>
              <Localized id="translate_dialog_title" />
            </h1>
            <button onClick={onClose} className="green" style={{ marginInlineEnd: '0' }}>
              <Localized id="dialog_done" />
            </button>
          </div>
          <p>
            <Localized id="translate_dialog_description" />
          </p>

          <hr style={{ opacity: 0.2 }} />

          {
            blocks
            .flatMap((block, index) => ([
              <hr key={'hr-'+index} style={{ opacity: 0 }} />,
              <div key={'div-'+index} style={{ margin: 'var(--basis_x4) 0' }}>
                <SimpleTranslationRepeater
                  onSaveProperty={
                    block._id === defaultBlock._id
                    ? onSaveProperty
                    : (...attr) => onSaveChildProperty(block, ...attr)
                  }
                  block={block}
                  isFirst={index === 0}
                />
              </div>
            ]))
          }

          <hr style={{ opacity: 0.2 }} />

          <div className={classes.actions}>
            <div></div>
            <button onClick={onClose} className="green" style={{ marginInlineEnd: '0' }}>
              <Localized id="dialog_done" />
            </button>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default TranslationEditor
