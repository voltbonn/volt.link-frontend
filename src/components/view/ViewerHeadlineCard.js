import { useLocalization } from '../../fluent/Localized.js'

function ViewerHeadlineCard ({ block }) {
  const { fluentByAny } = useLocalization()

  const text = fluentByAny(block.properties.text, '')
  return <h2 dir="auto">{text}</h2>
}

export default ViewerHeadlineCard
