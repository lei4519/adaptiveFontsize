配置scss
```css
html {
  $designSize: 19.2; /* 设计稿尺寸 */
  $minWidth: 960;
  $maxWidth: 1920;
  font-size: calc(100vw / #{$designSize});
  height: 100%;
  box-sizing: border-box;
  @media screen and (max-width: #{$minWidth}px) {
    font-size: #{$minWidth / $designSize}PX;
  }
  @media screen and (min-width: #{$maxWidth}px) {
    font-size: #{$maxWidth / $designSize}PX;
  }
}
body {
  font-size: 16px;
}
```
在postcss配置中
```js
const adaptiveFontsize = require('adaptivefontsize')
const path = require('path')
module.exports = {
  plugins: [
    require('autoprefixer')(),
    require('postcss-pxtorem')({
      rootValue: 100,
      propList: ['*', '!border*']
    }),
    adaptiveFontsize.loader({
      outputPath: path.resolve(__dirname, './src/styles/fontsizeVar.css'),
      rootValue: 100,
      minHTMLFontSize: 50
    })
  ]
}
```
在webpack plugin中
```js
const adaptiveFontsize = require('adaptivefontsize')
config.plugin('adaptiveFontsize.Plugin').use(adaptiveFontsize.Plugin)
```