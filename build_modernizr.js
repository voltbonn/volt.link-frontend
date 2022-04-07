const modernizr = require('modernizr')
const fs = require('fs')

modernizr.build({
  classPrefix: 'modernizr-',
  minify: true,
  'feature-detects': [
    // 'img/webp-alpha',
    // 'img/webp-animation',
    // 'img/webp-lossless',
    'img/webp',
  ]
}, new_js_file_text => {
  fs.writeFile('public/modernizr.js', new_js_file_text, error => {
    if (error) {
      return console.error(error)
    }
    console.info('Modernizr-file was saved!')
  })
})
