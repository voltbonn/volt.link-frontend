import mdit from 'markdown-it'
import kbd from 'markdown-it-kbd'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'

function getMD(options){
  // var hljs = require('highlight.js') // https://highlightjs.org/
  const md = mdit({
    html: false,
    xhtmlOut: false,
    linkify: true,
    typographer: true,
    breaks: false,
    // highlight: function (str, lang) {
    //   const language_obj = hljs.getLanguage(lang)
    //   if (lang && language_obj) {
    //     const language = language_obj.aliases[0]
    //     return '<pre class="hljs language-'+language+'"><code>' +
    //       hljs.highlight(str, { language, ignoreIllegals: true }).value +
    //     '</code></pre>';
    //   } else {
    //     const html = hljs.highlightAuto(str, { ignoreIllegals: true })
    //     return '<pre class="hljs language-'+html.language+'"><code>' +
    //       html.value +
    //     '</code></pre>';
    //   }

    //   return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    // }
    ...options,
  })

  // md.disable([ 'heading', 'heading', 'lheading', 'paragraph', 'image' ])
  md.use(kbd)
  md.use(emoji)

  return md
}

function renderInlineMarkdown(text, options = {}){
  text = text || ''
  // text = text.replace(/\n/g, '<br>')
  // text = text.replace(/\t/g, '&emsp;')

  text = text
  .replace(/\(TM\)/gi, '™')
  .replace(/\(SM\)/gi, '℠')
  .replace(/\(C\)/gi, '©')
  .replace(/\(R\)/gi, '®')

  const md = getMD(options)
  text = md.renderInline(text)

  text = twemoji.parse(text, {
    folder: 'svg',
    ext: '.svg',
    base: '/public/twemoji/assets/',
    // callback: function(icon, options, variant) {
    //   switch ( icon ) {
    //     case 'a9':      // © copyright
    //     case 'ae':      // ® registered trademark
    //     case '2122':    // ™ trademark
    //       return false
    //     default:
    //       return ''.concat(options.base, options.size, '/', icon, options.ext)
    //   }
    // }
  })
    
  return text
}

export {
  renderInlineMarkdown,
}
