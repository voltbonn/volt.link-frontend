import { useRef, useEffect } from 'react'

import { Transmat, addListeners, TransmatObserver } from 'transmat'

import classes from './DataTransmat.module.css'

function getTransmatOptions(transmat, mimetypes) {
  let data = {}
  for (const mimetype of mimetypes) {
    if (transmat.hasType(mimetype)) {
      if (mimetype === 'application/json') {
        data[mimetype] = JSON.parse(transmat.getData(mimetype))
      } else {
        data[mimetype] = transmat.getData(mimetype)
      }
    }
  }

  const options = {
    data,
    transmat,
  }

  return options
}

export function DataReceiver({ onReceive, style, className, children, checkEntry, mimetypes = ['application/json'] }){
  const receiverRef = useRef(null)

  useEffect(() => {
    const unlisten = addListeners(receiverRef.current, 'receive', event => {
      const transmat = new Transmat(event)
      const options = getTransmatOptions(transmat, mimetypes)
      
      let isOkay = false
      if (typeof checkEntry === 'function') {
        isOkay = checkEntry(options)
      }

      if (isOkay && transmat.accept()) {
        if (typeof onReceive === 'function') {
          onReceive(options)
        }
        event.preventDefault()
      }
    })

    const obs = new TransmatObserver(entries => {
      for (const entry of entries) {
        const transmat = new Transmat(entry.event)

        const options = getTransmatOptions(transmat, mimetypes)
      
        let isOkay = false
        if (typeof checkEntry === 'function') {
          isOkay = checkEntry(options)
        }

        if (isOkay) {
          entry.target.classList.toggle(classes.drag_over, entry.isTarget)
          entry.target.classList.toggle(classes.drag_active, entry.isActive)
        }
      }
    })
    obs.observe(receiverRef.current)

    return () => {
      unlisten()
      obs.disconnect()
    }
  }, [ onReceive, checkEntry, mimetypes ])

  return <div ref={receiverRef} style={style} className={className}>
    {children}
  </div>
}

export function DataTransmiter({ onTransmit, draggable, style, className, children }){
  const transmiterRef = useRef(null)

  useEffect(() => {
    return addListeners(transmiterRef.current, 'transmit', async event => {
      const transmat = new Transmat(event)
      if (typeof onTransmit === 'function') {
        const options = await onTransmit(transmat)
        if (
          typeof options === 'object'
          && options !== null
          && !Array.isArray(options.data)
          && typeof options.data === 'object'
          && options.data !== null
        ) {
          transmat.setData(options.data)
          // transmat.setData({
          //   'text/plain': 'Hello world!',
          //   'text/html': '<h1>Hello world!</h1>',
          //   'text/uri-list': 'http://example.com',
          //   'application/json': {foo:'bar'},
          // })
        }
      }
    })
  }, [ onTransmit ])

  return <div ref={transmiterRef} style={style} className={className} draggable={draggable ? 'true' : 'false'} tabIndex="0">
    {children}
  </div>
}

export function DataBothWays({ onTransmit, onReceive, checkEntry, draggable, style, className, children, mimetypes = ['application/json'] }){
  const bothwayRef = useRef(null)

  useEffect(() => {
    const unlistenTransmit = addListeners(bothwayRef.current, 'transmit', async event => {
      const transmat = new Transmat(event)

      if (typeof onTransmit === 'function') {
        const options = await onTransmit(transmat)
        if (
          typeof options === 'object'
          && options !== null
          && !Array.isArray(options.data)
          && typeof options.data === 'object'
          && options.data !== null
        ) {
          transmat.setData(options.data)
          // transmat.setData({
          //   'text/plain': 'Hello world!',
          //   'text/html': '<h1>Hello world!</h1>',
          //   'text/uri-list': 'http://example.com',
          //   'application/json': {foo:'bar'},
          // })
        }
      }
    })

    const unlistenReceive = addListeners(bothwayRef.current, 'receive', event => {
      const transmat = new Transmat(event)
      const options = getTransmatOptions(transmat, mimetypes)
      
      let isOkay = false
      if (typeof checkEntry === 'function') {
        isOkay = checkEntry(options)
      }

      if (true && transmat.accept()) { // accept everything so wrong stuff like images does not get displayed in the browser
        if (isOkay) {
          if (typeof onReceive === 'function') {
            onReceive(options)
          }
        }
        event.preventDefault()
      }
    })

    const obs = new TransmatObserver(entries => {
      for (const entry of entries) {
        const transmat = new Transmat(entry.event)
        const options = getTransmatOptions(transmat, mimetypes)

        let isOkay = false
        if (typeof checkEntry === 'function') {
          isOkay = checkEntry(options)
        }

        if (isOkay) {
          entry.target.classList.toggle(classes.drag_over, entry.isTarget)
          entry.target.classList.toggle(classes.drag_active, entry.isActive)
        }
      }
    })
    obs.observe(bothwayRef.current)

    return () => {
      unlistenTransmit()
      unlistenReceive()
      obs.disconnect()
    }
  }, [ onTransmit, onReceive, checkEntry, mimetypes ])

  return <div
    ref={bothwayRef}
    style={style}
    className={className}
    draggable={draggable ? 'true' : 'false'}
    tabIndex="0"
  >
    {children}
  </div>
}

// Examples:
//
// <DataTransmiter
//   draggable={true}
//   style={{
//     width: '100%',
//     height: '200px',
//     backgroundColor: 'blue',
//   }}
//   onTransmit={() => ({
//     'text/plain': 'Hello world!',
//     'text/html': '<h1>Hello world!</h1>',
//     'text/uri-list': 'http://example.com',
//     'application/json': {foo:'bar'},
//   })}
// >
//   DataTransmiter
// </DataTransmiter>
//
// <DataReceiver
//   style={{
//     width: '100%',
//     height: '200px',
//     backgroundColor: 'red',
//   }}
//   onReceive={data => console.info('received', data)}
// >
//   DataReceiver
// </DataReceiver>
