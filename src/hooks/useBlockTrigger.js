import { useState, useEffect } from 'react' // useCallback
// import { useNavigate } from 'react-router-dom'

export default function useBlockTrigger({ block = null, forceId = false, pathSuffix = '' }) {
  const [link, setLink] = useState(null)
  const [path, setPath] = useState(null)
  // const [onClick, setOnClick] = useState(null)

  // let navigate = useNavigate()

  useEffect(() => {
    let newLink = null
    let newPath = null
    // let newOnClick = null

    let changedPathSuffix = pathSuffix.trim().toLowerCase()
    if (changedPathSuffix === 'view') {
      changedPathSuffix = ''
    }

    let pathSuffixFull = changedPathSuffix
    if (pathSuffixFull.length > 0) {
      pathSuffixFull = `/${pathSuffixFull}`
    }


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
        && changedPathSuffix === '' // empty path suffix means that we are in the view page
      ) {
        newLink = url
        newPath = null // `/${properties.slug}`
        // newOnClick = () => window.open(newLink, '_blank')
      } else if (
        typeof slug === 'string'
        && slug.length > 0
      ) {
        if (forceId === true) {
          newLink = `${window.domains.frontend}${slug}=${blockId}${pathSuffixFull}`
          newPath = `/${slug}=${blockId}${pathSuffixFull}`
        } else {
          newLink = `${window.domains.frontend}${slug}${pathSuffixFull}`
          newPath = `/${slug}${pathSuffixFull}`
        }
        // newOnClick = () => navigate(newPath)
      } else {
        newLink = `${window.domains.frontend}${blockId}${pathSuffixFull}`
        newPath = `/${blockId}${pathSuffixFull}`
        // newOnClick = () => navigate(newPath)
      }
    }

    setLink(newLink)
    setPath(newPath)
    // setOnClick(newOnClick)
  }, [block, forceId, pathSuffix, setLink, setPath]) // setOnClick, navigate

  return { link, path } // onClick
}
