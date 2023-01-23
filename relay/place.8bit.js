const kol = require('kolmafia')

module.exports.main = () => {

    var pageText = kol.visitUrl()

    pageText = pageText.replace(`<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 150; width: 240;'>`, `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 144; width: 231; background-color: red; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`, `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100; background-color: blue; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 160;'>`, `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 171; background-color: green; mix-blend-mode: lighten;'>`);

    kol.write(pageText)
}
