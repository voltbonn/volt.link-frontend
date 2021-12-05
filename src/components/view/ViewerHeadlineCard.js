function ViewerHeadlineCard ({ block }) {
  return <h2 dir="auto">{block.properties.text || ''}</h2>
}

export default ViewerHeadlineCard
