const kol = require('kolmafia')

module.exports.main = () => {

    var pageText = kol.visitUrl()

    pageText = pageText.replace(`<style type='text/css'>
    .faded {
        zoom: 1;
        filter: alpha(opacity=35);
        opacity: 0.35;
        -khtml-opacity: 0.35; 
        -moz-opacity: 0.35;
    }
    </style>`, `<style type='text/css'>
    .faded {
        zoom: 1;
        filter: alpha(opacity=35);
        opacity: 0.35;
        -khtml-opacity: 0.35; 
        -moz-opacity: 0.35;
    }
    @font-face {
        font-family: nes;
        src: url('images/otherimages/nes.ttf') format('truetype'), url('images/otherimages/nes.woff2') format('woff2'), url('images/otherimages/nes.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap
    }
    @keyframes color-change {
        0% { color: red; border-color: red;}
        50% { color: blue; border-color: blue;}
        100% { color: red; border-color: red;}
    }
    .nes {
        font-family: nes;
        font-size: 14px;
        /*animation: color-change 1s infinite;*/
    }
    </style>`)

    pageText = pageText.replace(`<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 150; width: 240;'>`, `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 144; width: 231; background-color: red; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`, `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100; background-color: blue; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 160;'>`, `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 171; background-color: green; mix-blend-mode: lighten;'>`);

    kol.write(pageText)
}
