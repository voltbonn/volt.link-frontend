import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { getImageUrl } from '../../functions.js'

import {
  AutoAwesomeSharp as ActionIcon,
} from '@mui/icons-material'

import MdiIcon from '@mdi/react'
import {
  mdiGestureTapButton,
  mdiSetRight,
  mdiTimer,
  mdiOpenInApp,
  // mdiRayStartArrow,
  // mdiWeb,
  // mdiApplicationOutline,
  // mdiFileCode,
  // mdiCubeSend,
} from '@mdi/js'

import classes from './ViewerRedirectCard.module.css'

const triggerIconSize = 1
// const actionIconSize = 1

function ViewerRedirectCard ({ block = {}, actions = {} }) {
  const navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/${blockId}/view`)
  }, [navigate, blockId])

  const icon_url = getImageUrl(block.properties.icon)
  const text = block.properties.text || '' // getString('placeholder_main_headline'))

  let triggerInfo = null
  const triggerProperties = ((block.properties || {}).trigger || {})
  const triggerType = triggerProperties.type
  if (triggerType === 'path') {
    triggerInfo = <>
      <MdiIcon
        path={mdiOpenInApp}
        size={triggerIconSize}
        className={classes.icon}
      />
      <p>/{triggerProperties.path}</p>
    </>
  } else if (triggerType === 'click') {
    triggerInfo = <>
      <MdiIcon
        path={mdiGestureTapButton}
        size={triggerIconSize}
        className={classes.icon}
      />
      <p>{triggerProperties.blockId}</p>
    </>
  } else if (triggerType === 'cron') {
    triggerInfo = <>
      <MdiIcon
        path={mdiTimer}
        size={triggerIconSize}
        className={classes.icon}
      />
      <p>{triggerProperties.cron}</p>
    </>
  } else if (triggerType === 'block_change') {
    triggerInfo = <>
      <MdiIcon
        path={mdiSetRight}
        size={triggerIconSize}
        className={classes.icon}
      />
      <p>{triggerProperties.blockId}</p>
    </>
  } else {
    triggerInfo = <>
      <ActionIcon
        className={classes.icon}
      />
      <p>{
        Object.keys(triggerProperties).length > 0
        ? JSON.stringify(triggerProperties)
        : null
      }</p>
    </>
  }

  /*
  let actionInfo = null
  const actionProperties = ((block.properties || {}).action || {})
  const actionType = actionProperties.type
  if (actionType === 'open_url') {
    actionInfo = <>
      <MdiIcon
        path={mdiWeb}
        size={actionIconSize}
        className={classes.icon}
      />
      <p>{actionProperties.url}</p>
    </>
  } else if (actionType === 'render_block') {
    actionInfo = <>
      <MdiIcon
        path={mdiApplicationOutline}
        size={actionIconSize}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else if (actionType === 'run_block') {
    actionInfo = <>
      <MdiIcon
        path={mdiFileCode}
        size={actionIconSize}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else if (actionType === 'send_payload') {
    actionInfo = <>
      <MdiIcon
        path={mdiCubeSend}
        size={actionIconSize}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else {
    actionInfo = <>
      <MdiIcon
        path={mdiRayStartArrow}
        size={actionIconSize}
        className={classes.icon}
      />
      <p>{
        Object.keys(actionProperties).length > 0
        ? JSON.stringify(actionProperties)
        : null
      }</p>
    </>
  }
  */

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {
        icon_url === ''
          ? <ActionIcon className={classes.icon} />
          : <div className={classes.icon} style={{ backgroundImage: `url(${window.domains.backend}download_url?f=jpg&w=40&h=40&url=${encodeURIComponent(icon_url)})` }} alt={text}></div>
      }

      <div className={classes.content}>
        {
          text !== ''
          ? <div dir="auto" className={classes.title}>{text}</div>
          : null // <div dir="auto" className={classes.title} style={{ opacity: 0.4 }}>Untitled Action</div>
        }
        
        {triggerInfo !== null ? <div className={classes.iconLine}>{triggerInfo}</div> : null}
        {/* {actionInfo !== null ? <div className={classes.iconLine}>{actionInfo}</div> : null} */}

      </div>
    </div>
  </div>


  // return <div
  //   onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
  //   className={`clickable_card ${classes.root}`}
  // >
  //   <div>
  //     {text !== '' ? <div dir="auto" className={classes.title}>{text}</div> : null}
  //
  //     {triggerInfo !== null ? <div className={classes.iconLine}>{triggerInfo}</div> : null}
  //     {actionInfo !== null ? <div className={classes.iconLine}>{actionInfo}</div> : null}
  //
  //   </div>
  // </div>

}

export default ViewerRedirectCard
