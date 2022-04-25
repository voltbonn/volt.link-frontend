import { useState, useEffect } from 'react' // useCallback
// import { useNavigate } from 'react-router-dom'

export default function useBlockTrigger({ block = null }) {
  const [link, setLink] = useState(null)
  const [path, setPath] = useState(null)
  // const [onClick, setOnClick] = useState(null)

  // let navigate = useNavigate()

  useEffect(() => {
    let newLink = null
    let newPath = null
    // let newOnClick = null

    if (block !== null) {
      const blockId = block._id
      const type = block.type
      const properties = block.properties || {}
      const slug = properties.slug || ''
      const url = properties.url || ''

      if (
        type === 'redirect'
        && typeof url === 'string'
        && url.length > 0
      ) {
        newLink = url
        newPath = null // `/${properties.slug}`
        // newOnClick = () => window.open(newLink, '_blank')
      } else if (
        typeof slug === 'string'
        && slug.length > 0
      ) {
        newLink = `${window.domains.frontend}${slug}=${blockId}`
        newPath = `/${slug}=${blockId}`
        // newOnClick = () => navigate(newPath)
      } else {
        newLink = `${window.domains.frontend}${blockId}/view`
        newPath = `/${blockId}`
        // newOnClick = () => navigate(newPath)
      }
    }

    setLink(newLink)
    setPath(newPath)
    // setOnClick(newOnClick)
  }, [block, setLink, setPath]) // setOnClick, navigate

  return { link, path } // onClick
}
