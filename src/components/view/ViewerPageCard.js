import { useLocalization } from '../../fluent/Localized.js'

function ViewerPageCard ({ block }) {
  const { fluentByAny, getString } = useLocalization()

  const text = fluentByAny(block.properties.text, getString('placeholder_main_headline'))
  const description = fluentByAny(block.properties.description, '')

  return <div>
    <h3 dir="auto">{text}</h3>
    {description !== '' ? <p dir="auto">{description}</p> : null}
  </div>
}

export default ViewerPageCard
