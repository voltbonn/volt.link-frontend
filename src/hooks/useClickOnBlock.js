import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useClickOnBlock() {
  let navigate = useNavigate()

  const clickOnBlock = useCallback(({ block = null })=>{
    if (block !== null) {
      const blockId = block._id

      const triggerProperties = ((block.properties || {}).trigger || {})
      const triggerType = triggerProperties.type

      const actionProperties = ((block.properties || {}).action || {})
      const actionType = actionProperties.type

      console.log('triggerType', triggerType)
      console.log('actionType', actionType)
      console.log('actionProperties.url', actionProperties.url)

      if (
        triggerType === 'path'
        || triggerType === 'click'
      ) {
        if (
          actionType === 'open_url'
          && typeof actionProperties.url === 'string'
          && actionProperties.url.length > 0
        ) {
          const url =  actionProperties.url || ''
          window.open(url, '_blank')
        } else if (
          window.env === 'prod'
          && typeof triggerProperties.path === 'string'
          && triggerProperties.path.length > 0
        ) {
          navigate(`/${triggerProperties.path}`)
        } else {
          navigate(`/${blockId}/view`)
        }
        // TODO: add support for other trigger types (run_script, ...)
      } else {
        navigate(`/${blockId}/view`)
      }
    }
  }, [ navigate ])

  return { clickOnBlock }
}
