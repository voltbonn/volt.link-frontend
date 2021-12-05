function ViewerTextCard ({ block }) {
  return <p dir="auto">{block.properties.text || ''}</p>
}

export default ViewerTextCard
