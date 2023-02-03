import React from 'react'

import classes from './List.module.css'

const node = {
  id: '123',
  type: 'url',
  properties: {
    // url: 'https://volt-bonn.de',
    url: 'https://assets.volteuropa.org/2021-05/Koalitionsvertrag%20Bonn%20Endfassung.pdf',
  },
  metadata: {
    modified: '2021-09-01T12:00:00Z',
    modified_by: '123@123.org',
  },
  edges: [
    {
      id: '123',
      type: 'slug',
      properties: {
        slug: 'bonn',
      },
      metadata: {
        modified: '2021-09-01T12:00:00Z',
        modified_by: '123@123.org',
      },
    }
  ]
}
const nodes = [node, node].map((node, index) => {
  node.id = index
  node.edges[0].id = index
  return node
})

export default function Overview() {
  
  return <div className={classes.root}>

    <div className={classes.list}>
      <button style={{ textAlign: 'start' }}>Slug</button>
      <button style={{ textAlign: 'start' }}>Points to URL</button>
      <button style={{ textAlign: 'start' }}>Actions</button>

      <hr className={classes.full_width} />

      {nodes.map(node => {
        return <React.Fragment key={node.id}>
          <div>{
            node.edges
              .filter(edge => edge.type === 'slug')
              .map(edge => <button key={edge.id}>{edge.properties.slug}</button>)
          }</div>
          <div>
            <code>
              <a href={node.properties.url} target="_blank" rel="noreferrer">{node.properties.url}</a>
            </code>
          </div>
          <div style={{ justifySelf: 'end' }}>
            <button className="default">edit</button>
          </div>
        </React.Fragment>
      })}
    </div>

  </div>
}
