import React, { useState, useCallback, useRef } from 'react'

import classes from './StorageFileInput.module.css'

function resize(file) {
  return new Promise((resolve, reject) => {
    const MAX_HEIGHT = 2000 // This is kinda arbitrary. But a limit is probably good.
    const MAX_WIDTH = 2000 // This is kinda arbitrary. But a limit is probably good.

    const image = new Image()
    image.onload = function () {
      const canvas = document.createElement('canvas')
      if (image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height
        image.height = MAX_HEIGHT
      }
      if (image.width > MAX_WIDTH) {
        image.height *= MAX_WIDTH / image.width
        image.width = MAX_WIDTH
      }
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0, image.width, image.height)
    
      const fileType = file.type || 'image/jpeg'

      canvas.toBlob(newBlob => {
        const resizedFile = new File([newBlob], file.name, {
          type: fileType,
          lastModified: file.lastModified || new Date(),
        })
        resolve(resizedFile)
      }, fileType, 0.90) // to make the file a bit smaller
    }
    image.onerror = reject
    const data_url = URL.createObjectURL(file)
    image.src = data_url
  })
}

function StorageFileInput({ onChange, onError, style }) {
  const fileInputRef = useRef(null)

  const [uploadProgressText, setUploadProgressText] = useState('')
  const [loading, setLoading] = useState(false)

  const singleUpload = useCallback(async () => {
    setUploadProgressText('')
    setLoading(true)
    if (typeof onError === 'function') {
      onError('')
    }

    try {
      const files = [...fileInputRef.current.files]
        .filter(file => file.type.startsWith('image/') && file.size < 5000000) // 5000000 bytes = 5MB
      
      if (files.length > 0) {
        const thisFile = files[0]

        let new_file = thisFile
        if (thisFile.type.startsWith('image/')) {
          new_file = await resize(thisFile)
        }

        const formData = new FormData()
        const operations = {
          query: `
            mutation($file: Upload!) {
              upload(file: $file)
            }
          `,
          variables: {
            file: null
          }
        }
        formData.append('operations', JSON.stringify(operations))

        const map = `{"0": ["variables.file"]}`
        formData.append('map', map)
        formData.append('0', new_file)





        // 1. Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true

        // 2. Configure it: GET-request for the URL /article/.../load
        xhr.open('POST', window.graphql_uri, true)
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data')

        // 4. This will be called after the response is received
        xhr.onload = function () {
          setLoading(false)
          if (xhr.status !== 200) { // analyze HTTP status of the response
            if (typeof onError === 'function') {
              onError(`Error ${xhr.status}: ${xhr.statusText}`) // e.g. 404: Not Found
            }
          } else {
            let data = null
            try {
              data = JSON.parse(xhr.response) || null
            } catch (e) {
              if (typeof onError === 'function') {
                onError(e.message)
              }
            }

            if (typeof data === 'object' && data !== null) {
              if (data.hasOwnProperty('errors')) {
                if (typeof onError === 'function') {
                  onError(data.errors)
                }
              } else if (typeof data.data === 'object' && typeof data.data.upload === 'string') {
                onChange(data.data.upload)
                setLoading(false)
              }
            } else {
              if (typeof onError === 'function') {
                onError('Error: Invalid response')
              }
            }
          }
        }
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            const percentComplete = parseInt((event.loaded / event.total) * 100)
            setUploadProgressText(`${percentComplete}% (${event.loaded} of ${event.total} bytes)`)
          } else {
            setUploadProgressText(`${event.loaded} bytes`) // no Content-Length
          }
        }
        xhr.onerror = function () {
          setLoading(false)
          if (typeof onError === 'function') {
            onError('Request failed')
          }
        }


        // 3. Send the request over the network
        xhr.send(formData)


        
        // fetch(window.graphql_uri, {
        //   body: formData,
        //   method: 'post',
        //   credentials: 'include',
        //   allowHTTP1ForStreamingUpload: true,
        // })
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log('data', data)
        //     if (data.errors) {
        //       throw new Error(data.errors)
        //     } else if (data && data.data && data.data.upload) {
        //       onChange(data.data.upload)
        //       setLoading(false)
        //     }
        //   })
        //   .catch(error => {
        //     console.log('error', error)
        //     setLoading(false)
        //     if (typeof onError === 'function') {
        //       onError(String(error))
        //     }
        //   })

     
      
      
      } else {
        console.error('no file')
        setLoading(false)
        if (typeof onError === 'function') {
          onError('no file')
        }
      }
    } catch (error) {
      console.error(error)
      if (typeof onError === 'function') {
        onError(String(error.message))
      }
    }
  }, [onChange, onError, setUploadProgressText])

  return (<div className={classes.root} style={style}>
    <p className={classes.loadingText} style={{
      display: loading === false ? 'none' : 'flex'
    }}>
      Uploading… {uploadProgressText}
    </p>

    <div className={classes.inputWrapper} style={{
      display: loading === true ? 'none' : 'flex'
    }}>
      <label>
        <input type="file" ref={fileInputRef} accept="image/png, image/jpeg" />
      </label>
      <button className="default" onClick={singleUpload}>Upload</button>
    </div>
  </div>)
}

export default StorageFileInput
