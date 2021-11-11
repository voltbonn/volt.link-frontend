import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalization } from '../../fluent/Localized.js'

import {
  AutoAwesomeSharp as ActionIcon,
} from '@mui/icons-material'

import MdiIcon from '@mdi/react'
import {
  mdiGestureTapButton,
  mdiRayStartArrow,
  mdiWeb,
  mdiApplicationOutline,
  mdiFileCode,
  mdiCubeSend,
  mdiSetRight,
  mdiTimer,
  mdiOpenInApp,
} from '@mdi/js'

import classes from './ViewerActionCard.module.css'

function ViewerActionCard ({ block = {}, actions = {} }) {
  const { fluentByAny, getString } = useLocalization()

  const navigate = useNavigate()

  const blockId = block._id

  const viewBlock = useCallback(()=>{
    navigate(`/view/${blockId}`)
  }, [navigate, blockId])

  const text = fluentByAny(block.properties.text, '') // getString('placeholder_main_headline'))
  const description = fluentByAny(block.properties.description, '')

  let triggerInfo = null
  const triggerProperties = ((block.properties || {}).trigger || {})
  const triggerType = triggerProperties.type
  if (triggerType === 'path') {
    triggerInfo = <>
      <MdiIcon
        path={mdiOpenInApp}
        size={1}
        className={classes.icon}
      />
      <p>volt.link/{triggerProperties.path}</p>
    </>
  } else if (triggerType === 'click') {
    triggerInfo = <>
      <MdiIcon
        path={mdiGestureTapButton}
        size={1}
        className={classes.icon}
      />
      <p>{triggerProperties.blockId}</p>
    </>
  } else if (triggerType === 'cron') {
    triggerInfo = <>
      <MdiIcon
        path={mdiTimer}
        size={1}
        className={classes.icon}
      />
      <p>{triggerProperties.cron}</p>
    </>
  } else if (triggerType === 'block_change') {
    triggerInfo = <>
      <MdiIcon
        path={mdiSetRight}
        size={1}
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

  let actionInfo = null
  const actionProperties = ((block.properties || {}).action || {})
  const actionType = actionProperties.type
  if (actionType === 'open_url') {
    actionInfo = <>
      <MdiIcon
        path={mdiWeb}
        size={1}
        className={classes.icon}
      />
      <p>{actionProperties.url}</p>
    </>
  } else if (actionType === 'render_block') {
    actionInfo = <>
      <MdiIcon
        path={mdiApplicationOutline}
        size={1}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else if (actionType === 'run_block') {
    actionInfo = <>
      <MdiIcon
        path={mdiFileCode}
        size={1}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else if (actionType === 'send_payload') {
    actionInfo = <>
      <MdiIcon
        path={mdiCubeSend}
        size={1}
        className={classes.icon}
      />
      <p>{actionProperties.blockId}</p>
    </>
  } else {
    actionInfo = <>
      <MdiIcon
        path={mdiRayStartArrow}
        size={1}
        className={classes.icon}
      />
      <p>{
        Object.keys(actionProperties).length > 0
        ? JSON.stringify(actionProperties)
        : null
      }</p>
    </>
  }

  return <div
    onClick={actions.hasOwnProperty('click') ? actions.click : viewBlock}
    className={`clickable_card ${classes.root}`}
  >
    <div>
      {text !== '' ? <div dir="auto" className={classes.title}>{text}</div> : null}
      {description !== '' ? <p dir="auto">{description}</p> : null}

      {triggerInfo !== null ? <div className={classes.iconLine}>{triggerInfo}</div> : null}
      {actionInfo !== null ? <div className={classes.iconLine}>{actionInfo}</div> : null}

    </div>
  </div>
}

export default ViewerActionCard
