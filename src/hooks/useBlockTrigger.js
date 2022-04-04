import { useState, useEffect } from 'react' // useCallback
// import { useNavigate } from 'react-router-dom'

export default function useBlockTrigger({ block = null }) {
  const [link, setLink] = useState(null)
  const [path, setPath] = useState(null)
  // const [onClick, setOnClick] = useState(null)

  // let navigate = useNavigate()

  useEffect(() => {
    let newLink = null
    let newPath = null
    // let newOnClick = null

    if (block !== null) {
      const blockId = block._id

      const triggerProperties = ((block.properties || {}).trigger || {})
      const triggerType = triggerProperties.type

      const actionProperties = ((block.properties || {}).action || {})
      const actionType = actionProperties.type

      if (
        triggerType === 'path'
        || triggerType === 'click'
      ) {
        if (
          actionType === 'open_url'
          && typeof actionProperties.url === 'string'
          && actionProperties.url.length > 0
        ) {
          const url = actionProperties.url || ''
          newLink = url
          newPath = null // `/${triggerProperties.path}`
          // newOnClick = () => window.open(newLink, '_blank')
        } else if (
          actionType === 'render_block'
          && typeof triggerProperties.path === 'string'
          && triggerProperties.path.length > 0
        ) {
          if (
            typeof actionProperties.blockId === 'string'
            && actionProperties.blockId.length > 0
          ) {
            newLink = `${window.domains.frontend}${triggerProperties.path}=${actionProperties.blockId}`
            newPath = `/${triggerProperties.path}=${actionProperties.blockId}`
            // newOnClick = () => navigate(newLink)
          } else {
            newLink = `${window.domains.frontend}${triggerProperties.path}=${blockId}`
            newPath = `/${triggerProperties.path}=${blockId}`
            // newOnClick = () => navigate(newLink)
          }
        } else {
          newLink = `/${blockId}/view`
          newPath = `/${blockId}`
          // newOnClick = () => navigate(newLink)
        }
        // TODO: add support for other trigger types (run_script, ...)
      } else {
        newLink = `${window.domains.frontend}${blockId}/view`
        newPath = `/${blockId}`
        // newOnClick = () => navigate(newLink)
      }
    }

    setLink(newLink)
    setPath(newPath)
    // setOnClick(newOnClick)
  }, [block, setLink, setPath]) // setOnClick, navigate

  return { link, path } // onClick
}
