import { useEffect } from 'react'

export default function useKeyPress(keys, callback) {
  useEffect(() => {
    function onKeyup(event) {
      if (keys.includes(event.key)) {
        callback(event)
      }
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, [keys, callback])
}
