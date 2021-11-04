import { useLocalization } from '../../fluent/Localized.js'

function ViewerButtonCard ({ block, actions = {} }) {
  const { fluentByAny } = useLocalization()

  let url = ''
  if (
    block
    && block.properties
    && block.properties.trigger
    && block.properties.action
    && block.properties.action.url
    && block.properties.trigger.type === 'click'
    && block.properties.action.type === 'open_url'
  ) {
    url = block.properties.action.url
  }

  const text = fluentByAny(block.properties.text, '')

  const hasClickAction = actions.hasOwnProperty('click')

  if (hasClickAction === false && url !== '') {
    return <a href={url}>
      <button
        dir="auto"
        style={{
          margin: '0',
        }}
      >
        {text}
      </button>
    </a>
  }

  if (hasClickAction === true) {
    return <button
      dir="auto"
      disabled="disabled"
      style={{
        margin: '0',
      }}
      onClick={actions.onclick}
    >{text}</button>
  }

  return <button
    dir="auto"
    disabled="disabled"
    style={{
      margin: '0',
    }}
  >{text}</button>
}

export default ViewerButtonCard
