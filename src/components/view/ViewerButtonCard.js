import { useLocalization } from '../../fluent/Localized.js'

function ViewerButtonCard ({ block }) {
  const { fluentByAny } = useLocalization()

  const text = fluentByAny(block.properties.text, '')
  return <button dir="auto" style={{ marginLeft: '0', marginRight: '0' }}>{text}</button>
}

export default ViewerButtonCard
