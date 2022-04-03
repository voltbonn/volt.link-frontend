import { useState, useEffect } from 'react' // useCallback
// import { useNavigate } from 'react-router-dom'

export default function useBlockTrigger({ block = null }) {
  const [link, setLink] = useState(null)
  // const [onClick, setOnClick] = useState(null)

  // let navigate = useNavigate()

  useEffect(() => {
    let newLink = null
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
            newLink = `/${triggerProperties.path}=${actionProperties.blockId}`
            // newOnClick = () => navigate(newLink)
          } else {
            newLink = `/${triggerProperties.path}=${blockId}`
            // newOnClick = () => navigate(newLink)
          }
        } else {
          newLink = `/${blockId}/view`
          // newOnClick = () => navigate(newLink)
        }
        // TODO: add support for other trigger types (run_script, ...)
      } else {
        newLink = `/${blockId}/view`
        // newOnClick = () => navigate(newLink)
      }
    }

    setLink(newLink)
    // setOnClick(newOnClick)
  }, [block, setLink]) // setOnClick, navigate

  return { link } // onClick
}
