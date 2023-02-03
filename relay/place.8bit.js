const kol = require("kolmafia");

module.exports.main = () => {
    // This will give us the current page's HTML as a big string
    // Since the relay script loads when the 8bit realm does, it'll be 8bit's HTML
    var pageText = kol.visitUrl();

    // This tracks which zone you're getting double points in
    // They're stored as the zone's corresponding color (black, red, blue, green)
    const bonusZone = kol.getProperty("8BitColor");

    // This will estimate the number of turns until the bonus zone shifts
    // Seems to work but turnsSpent can be a little weird
    const bonusTurnsRemaining =
        5 -
        ((Location.get("Vanya's Castle").turnsSpent +
            Location.get("The Fungus Plains").turnsSpent +
            Location.get("Megalo City").turnsSpent +
            Location.get("Hero's Field").turnsSpent) %
            5);

    // These are the modifiers that are relevant to 8bit
    // We're going to use them a couple times so we'll set them to variables here
    const initModifier = kol.numericModifier("Initiative");
    const meatModifier = kol.numericModifier("Meat Drop");
    const daModifier = kol.numericModifier("Damage Absorption");
    const itemModifier = kol.numericModifier("Item Drop");

    // These are estimations of how many points you'll get when adventuring in each zone
    // They may be a bit off if you're in a path like HR that applies a hidden stat penalty
    const vanyaPoints =
        (bonusZone == "black" ? 100 : 50) +
        kol.round(
            kol.min(300, kol.max(0, initModifier - 300)) /
                (bonusZone == "black" ? 10 : 20)
        ) *
            10;

    const fungusPoints =
        (bonusZone == "red" ? 100 : 50) +
        kol.round(
            kol.min(300, kol.max(0, meatModifier - 150)) /
                (bonusZone == "red" ? 10 : 20)
        ) *
            10;

    const megaloPoints =
        (bonusZone == "blue" ? 100 : 50) +
        kol.round(
            kol.min(300, kol.max(0, daModifier - 300)) /
                (bonusZone == "blue" ? 10 : 20)
        ) *
            10;

    const fieldPoints =
        (bonusZone == "green" ? 100 : 50) +
        kol.round(
            kol.min(300, kol.max(0, itemModifier - 100)) /
                (bonusZone == "green" ? 10 : 20)
        ) *
            10;

    // This is our CSS stuff
    const css = `<style type='text/css'>
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
    }
    .nes .tooltiptext {
        visibility: hidden;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px;
        border-radius: 6px;
        font-family: Arial,Helvetica,sans-serif;
        font-size: medium;
        position: absolute;
        z-index: 2;
        width: 160px;
        top: 100%;
        left: 50%;
        margin-left: -80px;
    }
      
    .nes:hover .tooltiptext {
        visibility: visible;
    }

    .cheatsheet {
        border: 2px solid black;
        padding: 5px;
        width: max-content;
        min-width: 250;
        text-align: center;
        position: fixed;
        left: 10%;
    }

    #background {
    
    }
    `;

    // First we add our CSS to the few styles already defined on the page
    pageText = pageText.replace(`<style type='text/css'>`, css);

    // Setup the div where we put our cheat sheet
    pageText = pageText.replace(
        `<td><center>`,
        `<td><center><div class="cheatsheet"><div style='font-family:nes;'>Cheat Codes</br></br></div><div class="zone-status"></div></div>`
    );

    // Little tables for each zone to list your modifiers and expected points
    const vanyaStatus = `<table style='width: 100%; text-align: center;'><tr><th>Vanya's Castle</th></tr><tr><td>${kol.min(600, kol.max(0, kol.round(
        initModifier
    )))}% / 600% Initiative</td></tr><tr><td>Expected Points: ${vanyaPoints}</td></tr></table>`;
    const fungusStatus = `<table style='width: 100%; text-align: center;''><tr><th style="color: red;">The Fungus Plains</th></tr><tr><td>${kol.min(450, kol.max(0, kol.round(
        meatModifier
    )))}% / 450% Meat Drops</td></tr><tr><td>Expected Points: ${fungusPoints}</td></tr></table>`;
    const megaloStatus = `<table style='width: 100%; text-align: center;''><tr><th style="color: blue;">Megalo-City</th></tr><tr><td>${kol.min(600, kol.max(0, kol.round(
        daModifier
    )))}% / 600 D.A.</td></tr><tr><td>Expected Points: ${megaloPoints}</td></tr></table>`;
    const fieldStatus = `<table style='width: 100%; text-align: center;''><tr><th style="color: green;">Hero's Field</th></tr><tr><td>${kol.min(400, kol.max(0, kol.round(
        itemModifier
    )))}% / 400% Item Drops</td></tr><tr><td>Expected Points: ${fieldPoints}</td></tr></table>`;

    // This is just going to add a row below our active bonus zone listing out how many turns til the swap
    const bonusRemainingCheat = `<table style='width: 100%; text-align: center;'><tr><th>Bonus shifts in ${bonusTurnsRemaining} turns!</th></tr></table></br>`;

    // We want the zone that currently has the bonus to be listed first
    const cheatTable = () => {
        switch (bonusZone) {
            case "black":
                return `${vanyaStatus}${bonusRemainingCheat}${fungusStatus}${megaloStatus}${fieldStatus}`;
            case "red":
                return `${fungusStatus}${bonusRemainingCheat}${vanyaStatus}${megaloStatus}${fieldStatus}`;
            case "blue":
                return `${megaloStatus}${bonusRemainingCheat}${vanyaStatus}${fungusStatus}${fieldStatus}`;
            case "green":
                return `${fieldStatus}${bonusRemainingCheat}${vanyaStatus}${fungusStatus}${megaloStatus}`;
        }
    };

    // Put our cheatsheet data into the cheatsheet
    pageText = pageText.replace(
        `<div class="zone-status"></div>`,
        `<div class="zone-status" style='text-align: center; width:100%;'>${cheatTable()}</div>`
    );

    // Adding tooltip spans
    pageText = pageText.replace(
        `<div id=8castle class="element" style=' position: absolute; top: 117; left: 287; height: 110; width: 110;'>`,
        `<div id=8castle class="nes" style=' position: absolute; top: 117; left: 287; height: 110; width: 110;'><span class="tooltiptext">Expected Points:<br />${vanyaPoints} / 400</span>`
    );
    pageText = pageText.replace(
        `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 150; width: 240;'>`,
        `<div id=8mario class="nes" style=' position: absolute; top: 256; left: 169; height: 144; width: 231;'><span class="tooltiptext">Expected Points:<br />${fungusPoints} / 400</span>`
    );
    pageText = pageText.replace(
        `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`,
        `<div id=8megaman class="nes" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'><span class="tooltiptext">Expected Points:<br />${megaloPoints} / 400</span>`
    );
    pageText = pageText.replace(
        `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 160;'>`,
        `<div id=8zelda class="nes" style=' position: absolute; top: 12; left: 3; height: 200; width: 171;'><span class="tooltiptext">Expected Points:<br />${fieldPoints} / 400</span>`
    );

    // Adding background color to the clickable area for each zone and lightening it based on the background image
    // Will turn the underlying black lines into the zone's corresponding color
    pageText = pageText.replace(`width=240 height=150 border=0 alt="The Fungus Plains (1)" title="The Fungus Plains (1)"`, `width=225 height=141 border=0 alt="The Fungus Plains (1)" title="The Fungus Plains (1)" style='mix-blend-mode: lighten; background-color: red;'`)
    pageText = pageText.replace(`title="Megalo-City (1)"`, `title="Megalo-City (1)" style='mix-blend-mode: lighten; background-color: blue;'`)
    pageText = pageText.replace(`width=160 height=200 border=0 alt="Hero's Field (1)" title="Hero's Field (1)"`, `width=171 height=200 border=0 alt="Hero's Field (1)" title="Hero's Field (1)" style='mix-blend-mode: lighten; background-color: green;'`)

    // A little piece on styled html for the bonus zone indicator
    const bonusOverlay = `<div class="nes" style="z-index: 1; position: absolute; top: 0; text-align: center; width: 100%; padding: 3px;">Bonus</div><div class="nes" style="z-index: 1; position: absolute; bottom: 0; text-align: center; width: 100%; padding: 3px;">Bonus</div>`;

    // Sets the bonus zone based on the 8bitColor property, and adds a border
    switch (bonusZone) {
        case "black":
            pageText = pageText.replace(
                `'><span class="tooltiptext">Expected Points:<br />${vanyaPoints} / 400</span><a  href=adventure.php?snarfblat=565>`,
                `border: 3px solid; border-radius: 5px;'><span class="tooltiptext">Expected Points:<br />${vanyaPoints} / 400</span><a  href=adventure.php?snarfblat=565>${bonusOverlay}`
            );
            break;
        case "red":
            pageText = pageText.replace(
                `'><span class="tooltiptext">Expected Points:<br />${fungusPoints} / 400</span><a  href=adventure.php?snarfblat=563>`,
                `border: 3px solid; border-radius: 5px;'><span class="tooltiptext">Expected Points:<br />${fungusPoints} / 400</span><a  href=adventure.php?snarfblat=563>${bonusOverlay}`
            );
            break;
        case "blue":
            pageText = pageText.replace(
                `'><span class="tooltiptext">Expected Points:<br />${megaloPoints} / 400</span><a  href=adventure.php?snarfblat=566>`,
                `border: 3px solid; border-radius: 5px;'><span class="tooltiptext">Expected Points:<br />${megaloPoints} / 400</span><a  href=adventure.php?snarfblat=566>${bonusOverlay}`
            );
            break;
        case "green":
            pageText = pageText.replace(
                `'><span class="tooltiptext">Expected Points:<br />${fieldPoints} / 400</span><a  href=adventure.php?snarfblat=564>`,
                `border: 3px solid; border-radius: 5px;'><span class="tooltiptext">Expected Points:<br />${fieldPoints} / 400</span><a  href=adventure.php?snarfblat=564>${bonusOverlay}`
            );
            break;
    }

    // Take the massive string of HTML that we've altered and use it in place of the native 8bit page
    kol.write(pageText);
};
