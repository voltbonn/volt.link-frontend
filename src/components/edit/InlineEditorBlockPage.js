import React from 'react'

import ViewerAuto from '../view/ViewerAuto.js'

export default function InlineEditorBlockPage({
  block = {},
}) {
  return <div style={{ margin: '0 0 var(--basis) 0' }}>
    <ViewerAuto
      key={block}
      dragable={true}
      size="line"
      block={block}
      style={{
        flexGrow: '1',
        width: '100%',
      }}
      pathSuffix="edit"
    />
  </div>
}
