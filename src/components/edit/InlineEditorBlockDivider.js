import { getBlockColor } from '../../functions.js'

export default function InlineEditorBlockDivider({ block }) {
  const {
    color,
  } = getBlockColor(block)

  const styles = {}
  if (color) {
    styles['--on-background'] = color
  }

  return <hr style={styles} />
}
