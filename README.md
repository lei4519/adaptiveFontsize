```js
npm i adaptivefontsize --save-dev
```
解决pc端rem适配技术，font-size在非chrome浏览器小于12px的问题。（使用css变量实现，不兼容ie浏览器）。
- 遇见的问题
  - pc端需要使用rem做布局适配时，UI要求字号也使用rem。在chrome浏览器中最小字号为12px，小于12px也会显示为12px。但其他浏览器则没有此限制，这就导致了chrome与别的浏览器显示不一致的问题。加上小于12px的字号在pc端很难看清，故此插件将小于12px的字号全部重设置为12px。

- 实现原理
  - 使用postcss-loader替换字号`px`为`--font-size`css变量。监听`html-webpack-plugin`的hooks注入js，根据html的fontsize值计算小于12px的css变量，改变css变量的值为12px。
- 配置scss 实现rem布局
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
在postcss配置中引入`adaptivefontsize`, 保证`adaptivefontsize.plugin`在`postcss-pxtorem`之后引入，`rootValue`值与`postcss-pxtorem`保持一致，`outputPath`是指生成的css 变量文件，需要自行在项目主css文件中引入。`minHTMLFontSize`是指HTML font-size的最小值。一般来说我们不会让字体无限缩小或无限放大，所以根据项目需求来设置这个字段。
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
在webpack plugin中引入`adaptiveFontsize.Plugin`
```js
const adaptiveFontsize = require('adaptivefontsize')
config.plugin('adaptiveFontsize.Plugin').use(adaptiveFontsize.Plugin)
```