const kol = require('kolmafia')

module.exports.main = () => {

    var pageText = kol.visitUrl()

    const bonusZone = kol.getProperty('8BitColor');

    pageText = pageText.replace(`<style type='text/css'>`, `<style type='text/css'>
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
        font-size: 16px;
        animation: color-change 1s infinite;
    }`)

    pageText = pageText.replace(`<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 150; width: 240;'>`, `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 144; width: 231; background-color: red; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`, `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100; background-color: blue; mix-blend-mode: lighten;'>`);
    pageText = pageText.replace(`<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 160;'>`, `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 171; background-color: green; mix-blend-mode: lighten;'>`);

    switch (bonusZone) {
        case "black": pageText = pageText.replace(`title="Vanya's Castle (1)"></a></div>`, `title="Vanya's Castle (1)"></div> <div class="nes" style=' position: absolute; top: 117; left: 287; height: 110; width: 110; border: 3px solid; border-radius: 5px; padding: 2px;'><div class="nes" style="text-align: center; width: 100%; padding: 2px;">Bonus</div><div class="nes" style="position: absolute; bottom: 0; text-align: center; width: 100%; padding: 2px;">Bonus</div></div></a>`);
            break;
        case "red": pageText = pageText.replace(`title="The Fungus Plains (1)"></a></div>`, `title="The Fungus Plains (1)"></div> <div class="nes" style=' position: absolute; top: 256; left: 169; height: 150; width: 240; border: 3px solid; border-radius: 5px; padding: 2px;'><div class="nes" style="text-align: center; width: 100%; padding: 2px;">Bonus</div><div class="nes" style="position: absolute; bottom: 0; text-align: center; width: 100%; padding: 2px;">Bonus</div></div></a>`);
            break;
        case "blue": pageText = pageText.replace(`title="Megalo-City (1)"></a></div>`, `title="Megalo-City (1)"></div> <div class="nes" style=' position: absolute; top: 4; left: 214; height: 110; width: 100; border: 3px solid; border-radius: 5px; padding: 2px;'><div class="nes" style="text-align: center; width: 100%; padding: 2px;">Bonus</div><div class="nes" style="position: absolute; bottom: 0; text-align: center; width: 100%; padding: 2px;">Bonus</div></div></a>`);
            break;
        case "green": pageText = pageText.replace(`title="Hero's Field (1)"></a></div>`, `title="Hero's Field (1)"></div> <div class="nes" style=' position: absolute; top: 12; left: 3; height: 200; width: 171; border: 3px solid; border-radius: 5px; padding: 2px;'><div class="nes" style="text-align: center; width: 100%; padding: 2px;">Bonus</div><div class="nes" style="position: absolute; bottom: 0; text-align: center; width: 100%; padding: 2px;">Bonus</div></div></a>`);
            break;
    }

    kol.write(pageText)
}
