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



function hexToRGBArray(color) {
  if (color.startsWith('#')) {
    color = color.substring(1)
  }

  if (color.length === 3) {
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
  } else if (color.length !== 6) {
    throw(new Error('Invalid hex color: ' + color));
  }

  let rgb = [];
  for (var i = 0; i <= 2; i++) {
    rgb[i] = parseInt(color.substr(i * 2, 2), 16);
  }

  return rgb;
}
function luma(color) { 
  // color can be a hex string or an array of RGB values 0-255
  const rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
  return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}
function getContrastingColor(color) {
  // source: https://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript
  // exact answer: https://stackoverflow.com/a/6511606/2387277
  // example: https://jsfiddle.net/thomasrosen/9njo6t7s/20/
  
  return (luma(color) >= 165) ? '000' : 'fff';
}



// function randomHexColor () {
//   let color = ''
//   for (let i = 0; i < 6; i++){
//     const random = Math.random()
//     const bit = (random * 16) | 0
//     color += (bit).toString(16)
//   }
//   return '#'+color
// }



function colorToRGBA(color) {
  // source: https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
  // source: https://stackoverflow.com/a/24390910/2387277

  // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
  // color must be a valid canvas fillStyle. This will cover most anything
  // you'd want to use.
  // Examples:
  // colorToRGBA('red')  # [255, 0, 0, 255]
  // colorToRGBA('#f00') # [255, 0, 0, 255]
  var cvs, ctx;
  cvs = document.createElement('canvas');
  cvs.height = 1;
  cvs.width = 1;
  ctx = cvs.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data;
}
function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    return ('0'+num.toString(16)).slice(-2);
}
function colorToHex(color) {
    // Convert any CSS color to a hex representation
    // Examples:
    // colorToHex('red')            # '#ff0000'
    // colorToHex('rgb(255, 0, 0)') # '#ff0000'
    var rgba, hex;
    rgba = colorToRGBA(color);
    hex = [0,1,2].map(
        function(idx) { return byteToHex(rgba[idx]); }
        ).join('');
    return "#"+hex;
}



function getBlockColor(block = {}) {
  const colors = {
    color: null,
    colorRGB: null,
    contrastingColor: null,
    contrastingColorRGB: null,
  }

  block.properties = block.properties || {}

  if (block.hasOwnProperty('properties') && block.properties.hasOwnProperty('color') && !!block.properties.color) {
    const defaultColors = ['purple', 'red', 'green', 'blue', 'yellow']
    let newColor = block.properties.color

    if (defaultColors.includes(newColor)) {
      colors.color = `var(--${newColor})`
      colors.colorRGB = `var(--${newColor}-rgb)`
      colors.contrastingColor = `var(--on-${newColor})`
      colors.contrastingColorRGB = `var(--on-${newColor}-rgb)`
    } else {
      if (newColor.startsWith('#')) {
        if (newColor.length !== 4 && newColor.length !== 7) {
          newColor = null
        }
      } else {
        const parsedColor = colorToHex(newColor)
        if (parsedColor === '#000000' && newColor !== 'black') {
          newColor = null
        } else {
          newColor = parsedColor
        }
      }

      if (newColor) {
        colors.color = newColor
        const colorRGB = hexToRGBArray(newColor)
        colors.colorRGB = colorRGB.join(', ')
        colors.contrastingColor = '#'+getContrastingColor(newColor)
        colors.contrastingColorRGB = hexToRGBArray(colors.contrastingColor)
      }
    }
  }

  return colors
}

module.exports = {
  getImageUrl,
  getBlockColor,
}
