import { useLocalization } from '../../fluent/Localized.js'

function ViewerHeadline ({ block }) {
  const { fluentByAny } = useLocalization()

  const text = fluentByAny(block.properties.text, '')
  return <h2 dir="auto">{text}</h2>
}

export default ViewerHeadline
