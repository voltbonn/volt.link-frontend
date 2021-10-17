import React, { useEffect, useState, useCallback } from 'react'

import {
  Modal,
} from '@mui/material'
import {
  QrCodeSharp as QrCodeIcon,
  AssessmentSharp as AssessmentIcon,
  ContentCopySharp as CopyIcon,
} from '@mui/icons-material'

import { Localized } from '../../fluent/Localized.js' // useLocalization

import classes from './SharingEditor.module.css'

import HtmlInput from './HtmlInput.js'

function fallbackCopyTextToClipboard(text) {
  // Source: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  // Source: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function SharingEditor({
  defaultBlock = {},
  open = false,
  onChange,
  onClose,
}) {
  const [ path, setPath ] = useState('')

  useEffect(() => {
    const properties = defaultBlock.properties || {}
    const initialPath = (properties.trigger || {}).path || ''

    setPath(initialPath)
  }, [ defaultBlock, setPath ])

  const savePath = useCallback(newPath => {
    const newProperties = {...(defaultBlock.properties || {})}

    if (newPath === '') {
      if (newProperties.hasOwnProperty('trigger')) {
        delete newProperties.trigger
      }
      if (newProperties.hasOwnProperty('action')) {
        delete newProperties.action
      }
    } else {
      newProperties.trigger = {
		  	type: 'path',
		  	path: newPath,
		  }
		  newProperties.action = {
		  	type: 'render_block',
		  }
    }

    setPath(newPath)
    onChange(newProperties)
  }, [
    defaultBlock,
    onChange,
    setPath,
  ])

  const viewStatistics = () => {
    const a = document.createElement('a')
    a.href = `https://umami.qiekub.org/share/s0ZHBZbb/volt.link?url=%2F${path}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  const gotoQrcodePage = () => {
    const a = document.createElement('a')
    a.href = `https://qrcode.volt.link/?c=volt.link/${path}`
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  const copyUrl = () => {
    copyTextToClipboard(`https://volt.link/${path}`)
  }

  if (!open) {
    return null
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop={true}
      // BackdropComponent={<Backdrop open={true} className={classes.backdrop} />}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <>
        <div className={classes.backdrop} onClick={onClose}></div>

        <div className={classes.dialog}>

            <h1 style={{ margin: '0 0 var(--basis_x4) 0' }}>Get the link</h1>
            {/* <p>Enter @volteuropa.org addresses to give editing rights.<br/>Groups addresses are not supported.</p> */}

            {/* <hr style={{ opacity: 0.2 }} /> */}

            <div className={classes.inputWrapper}>
             <span style={{ paddingRight: 'var(--basis)' }}>volt.link/</span>
             <HtmlInput
                defaultValue={path}
                onBlur={savePath}
                linebreak={false}
                className={classes.input}
                style={{ margin: '0' }}
              />
            </div>

            <hr style={{ opacity: 0.2 }} />

            <div className={classes.actions}>
              {
                path !== ''
                ? <div>
                    <button className="text hasIcon" onClick={gotoQrcodePage} style={{ marginInlineStart: '0' }}>
                      <QrCodeIcon className="icon" />
                      <span className="hideOnSmallScreen"><Localized id="sharing_qrcode" /></span>
                    </button>
                    <button className="text hasIcon" onClick={viewStatistics}>
                      <AssessmentIcon className="icon" />
                      <span className="hideOnSmallScreen"><Localized id="sharing_statistics" /></span>
                    </button>
                    <button className="text hasIcon" onClick={copyUrl}>
                      <CopyIcon className="icon" />
                      <span className="hideOnSmallScreen"><Localized id="sharing_copy_url" /></span>
                    </button>
                  </div>
                : <div></div>
              }

              <button onClick={onClose} className="green" style={{ marginInlineEnd: '0' }}>Done</button>
            </div>
        </div>
      </>
    </Modal>
  )
}

export default SharingEditor
