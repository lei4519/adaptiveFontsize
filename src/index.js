const fs = require('fs')
let rtVal; let fontSize = 12; let init = true
const loader = (options) => {
  const {
    rootValue = 100,
    minHTMLFontSize = 12,
    outputPath
  } = options
  if (init) {
    init = false
    rtVal = rootValue
    if (!outputPath) return console.error('adaptiveFontsize 缺少 outputPath 参数')
    let data = `/*内容编译生成，请勿手动修改*/
    :root {`
    while (fontSize / rootValue * minHTMLFontSize < 12) {
      data += `
      --font-size-${fontSize}: ${fontSize / rootValue}rem;`
      fontSize++
    }
    data += '}'
    fs.writeFile(outputPath, data, err => err && console.error(err))
  }
  return css => {
    // 遍历所有的选择器
    css.walkRules(function(rule) {
      // 遍历所有的属性
      rule.walkDecls(function(decl) {
        if (decl.prop === 'font-size' && decl.value.includes('rem')) {
          const fs = (parseFloat(decl.value) * rootValue) | 0
          if (fs < fontSize) { // 只有小于非安全值，才进行处理
            // 保留旧属性兼容ie
            decl.cloneAfter({ prop: decl.prop, value: `var(--font-size-${fs})` })
          }
        }
      })
    })
  }
}
/* raw
(function() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  var isChrome = userAgent.indexOf('Chrome') > -1
  if (isIE || isEdge || isIE11 || isChrome) return
  function adaptiveFS() {
    var rootValue = 'plugin inject'
    var rt = document.documentElement
    var rootFS = parseFloat(getComputedStyle(document.documentElement).fontSize)
    var minFontsize = 12
    var fs = 12
    while (fs / rootValue * rootFS < minFontsize) {
      rt.style.setProperty('--font-size-' + fs, '12px')
      fs++
    }
  }
  adaptiveFS()
  var timer
  window.addEventListener('resize', function() {
    clearTimeout(timer)
    timer = setTimeout(adaptiveFS, 300);
  })
})()
*/
const cheerio = require('cheerio')
class Plugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('adaptiveFontsize.Plugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('adaptiveFontsize.Plugin', (data, cb) => {
        const $ = cheerio.load(data.html)
        $(`<script>(function(){var d=navigator.userAgent;var a=d.indexOf("compatible")>-1&&d.indexOf("MSIE")>-1;var c=d.indexOf("Edge")>-1&&!a;var f=d.indexOf("Trident")>-1&&d.indexOf("rv:11.0")>-1;var e=d.indexOf("Chrome")>-1;if(a||c||f||e){return}function b(){var k=${rtVal};var j=document.documentElement;var i=parseFloat(getComputedStyle(document.documentElement).fontSize);var l=12;var h=12;while(h/k*i<l){j.style.setProperty("--font-size-"+h,"12px");h++}}b();var g;window.addEventListener("resize",function(){clearTimeout(g);g=setTimeout(b,300)})})();</script>`)
          .appendTo('head')
        data.html = $.html()
        cb(null, data)
      })
    })
  }
}
const adaptiveFontsize = {
  loader,
  Plugin
}
module.exports = adaptiveFontsize
