import { useLocalization } from '../../fluent/Localized.js'

function ViewerTextCard ({ block }) {
  const { fluentByAny } = useLocalization()

  // console.log('block.properties.text', block.properties.text)
  const text = fluentByAny(block.properties.text, '')
  // console.log('text', text)
  return <p dir="auto">{text}</p>
}

export default ViewerTextCard
