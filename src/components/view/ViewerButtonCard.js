import { useLocalization } from '../../fluent/Localized.js'

function ViewerButtonCard ({ block }) {
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

  if (url !== '') {
    return <a href={url}>
      <button
        dir="auto"
        style={{
          marginLeft: '0',
          marginRight: '0',
        }}
      >
        {text}
      </button>
    </a>
  }
  return <button
    dir="auto"
    disabled="disabled"
    style={{
      marginLeft: '0',
      marginRight: '0',
    }}
  >{text}</button>
}

export default ViewerButtonCard
