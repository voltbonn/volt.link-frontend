function getImageUrl(imageObj) {
  if (
    typeof imageObj === 'object'
    && imageObj !== null
    && !Array.isArray(imageObj)
  ) {
    if (imageObj.type === 'url') {
      return imageObj.url || ''
    }
  }

  return ''
}

module.exports = {
  getImageUrl
}
