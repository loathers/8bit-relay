Object.assign(globalThis, require("kolmafia"));

module.exports.main = () => {
    // This will give us the current page's HTML as a big string
    // Since the relay script loads when the 8bit realm does, it'll be 8bit's HTML
    var pageText = visitUrl();

    // We don't want to do anything when we visit the treasure house
    if (pageText.include(`<b>Treasure House</b>`)) return;

    // This tracks which zone you're getting double points in
    // They're stored as the zone's corresponding color (black, red, blue, green)
    const bonusZone = getProperty("8BitColor");

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
    const initModifier = numericModifier("Initiative");
    const meatModifier = numericModifier("Meat Drop");
    const daModifier = numericModifier("Damage Absorption");
    const itemModifier = numericModifier("Item Drop");

    // These are estimations of how many points you'll get when adventuring in each zone
    // They may be a bit off if you're in a path like HR that applies a hidden stat penalty
    const vanyaPoints =
        (bonusZone == "black" ? 100 : 50) +
        round(
            min(300, max(0, initModifier - 300)) /
                (bonusZone == "black" ? 10 : 20)
        ) *
            10;

    const fungusPoints =
        (bonusZone == "red" ? 100 : 50) +
        round(
            min(300, max(0, meatModifier - 150)) /
                (bonusZone == "red" ? 10 : 20)
        ) *
            10;

    const megaloPoints =
        (bonusZone == "blue" ? 100 : 50) +
        round(
            min(300, max(0, daModifier - 300)) / (bonusZone == "blue" ? 10 : 20)
        ) *
            10;

    const fieldPoints =
        (bonusZone == "green" ? 100 : 50) +
        round(
            min(300, max(0, itemModifier - 100)) /
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
     y: swap
    }

    .cheatsheet {
        border: 2px solid black;
        border-radius: 5px;
        padding: 10px;
        width: max-content;
        min-width: 250;
        text-align: center;
    }

    .sheet-bonus {
        border: 2px solid #D6D6D6;
        border-radius: 5px;
        background-color: #EEEEEB;
    }

    .bonus-overlay {
        font-family: nes;
        font-size: small;
        mix-blend-mode: darken;
        z-index: 1;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #EEEEEB;
    }
    `;

    // First we add our CSS to the few styles already defined on the page
    pageText = pageText.replace(`<style type='text/css'>`, css);

    // Setup the div where we put our cheat sheet
    pageText = pageText.replace(
        `<td><center>`,
        `<td><center><div style="display:flex;"><div class="cheatsheet"><div style='font-family:nes; margin-bottom: 15px'>Cheat Codes</div><div class="zone-status"></div></div>`
    );
    pageText = pageText.replace(
        `<p><a href=place.php?whichplace=woods>`,
        `</div><p><a href=place.php?whichplace=woods></p>`
    );

    // This is the value of the modifer that affects each location
    // We needed to format them specifically here, which is why they're different than above
    const vanyaStatusModifier = max(0, round(initModifier));
    const fungusStatusModifier = max(0, round(meatModifier));
    const megaloStatusModifier = max(0, round(daModifier));
    const fieldStatusModifier = max(0, round(itemModifier));

    // Little tables for each zone to list your modifiers and expected point gains
    const vanyaStatus = `<a  style="text-decoration: none;" href=adventure.php?snarfblat=565><table style='width: 100%; text-align: center;'><tr><th>Vanya's Castle</th></tr><tr><td>${
        vanyaStatusModifier >= 600
            ? "<b>" + vanyaStatusModifier + "</b>"
            : vanyaStatusModifier
    }% / 600% Initiative</td></tr><tr><td>Expected Points: ${
        vanyaPoints == 400 ? "<b>" + vanyaPoints + "</b>" : vanyaPoints
    }</td></tr></table></a>`;
    const fungusStatus = `<a  style="text-decoration: none;" href=adventure.php?snarfblat=563><table style='width: 100%; text-align: center;''><tr><th style="color: red;">The Fungus Plains</th></tr><tr><td>${
        fungusStatusModifier >= 450
            ? "<b>" + fungusStatusModifier + "</b>"
            : fungusStatusModifier
    }% / 450% Meat Drop</td></tr><tr><td>Expected Points: ${
        fungusPoints == 400 ? "<b>" + fungusPoints + "</b>" : fungusPoints
    }</td></tr></table></a>`;
    const megaloStatus = `<a  style="text-decoration: none;" href=adventure.php?snarfblat=566><table style='width: 100%; text-align: center;''><tr><th style="color: blue;">Megalo-City</th></tr><tr><td>${
        megaloStatusModifier >= 600
            ? "<b>" + megaloStatusModifier + "</b>"
            : megaloStatusModifier
    } / 600 Damage Absorption</td></tr><tr><td>Expected Points: ${
        megaloPoints == 400 ? "<b>" + megaloPoints + "</b>" : megaloPoints
    }</td></tr></table></a>`;
    const fieldStatus = `<a  style="text-decoration: none;" href=adventure.php?snarfblat=564><table style='width: 100%; text-align: center;''><tr><th style="color: green;">Hero's Field</th></tr><tr><td>${
        fieldStatusModifier >= 400
            ? "<b>" + fieldStatusModifier + "</b>"
            : fieldStatusModifier
    }% / 400% Item Drop</td></tr><tr><td>Expected Points: ${
        fieldPoints == 400 ? "<b>" + fieldPoints + "</b>" : fieldPoints
    }</td></tr></table></a>`;

    // This will serve as the text we use to mark which area has a bonus
    const bonusIndication = `<table style='width: 100%; text-align: center;'><tr><td style='font-family: nes; font-size: small;'>Bonus</td></tr></table>`;

    // This is just going to add a row below our active bonus zone listing out how many turns til the swap
    const bonusRemainingCheat = `<table style='width: 100%; text-align: center;'><tr><th>Bonus shifts in ${bonusTurnsRemaining} turns!</th></tr></table>`;

    // We want the zone that currently has the bonus to be listed first
    const cheatTable = () => {
        switch (bonusZone) {
            case "black":
                return `<div class="sheet-bonus">${bonusIndication}${vanyaStatus}${bonusRemainingCheat}</div>${fungusStatus}${megaloStatus}${fieldStatus}`;
            case "red":
                return `<div class="sheet-bonus">${bonusIndication}${fungusStatus}${bonusRemainingCheat}</div>${vanyaStatus}${megaloStatus}${fieldStatus}`;
            case "blue":
                return `<div class="sheet-bonus">${bonusIndication}${megaloStatus}${bonusRemainingCheat}</div>${vanyaStatus}${fungusStatus}${fieldStatus}`;
            case "green":
                return `<div class="sheet-bonus">${bonusIndication}${fieldStatus}${bonusRemainingCheat}</div>${vanyaStatus}${fungusStatus}${megaloStatus}`;
        }
    };

    // Put our cheatsheet data into the cheatsheet
    pageText = pageText.replace(
        `<div class="zone-status"></div>`,
        `<div class="zone-status" style='text-align: center; width:100%; display: grid; gap: 10px;'>${cheatTable()}</div>`
    );

    // Resizing divs to match clickable areas
    pageText = pageText.replace(
        `<div id=8castle class="element" style=' position: absolute; top: 117; left: 287; height: 110; width: 110;'>`,
        `<div id=8castle class="element" style=' position: absolute; top: 117; left: 287; height: 110; width: 110;'>`
    );
    pageText = pageText.replace(
        `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 150; width: 240;'>`,
        `<div id=8mario class="element" style=' position: absolute; top: 256; left: 169; height: 144; width: 231;'>`
    );
    pageText = pageText.replace(
        `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`,
        `<div id=8megaman class="element" style=' position: absolute; top: 4; left: 214; height: 110; width: 100;'>`
    );
    pageText = pageText.replace(
        `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 160;'>`,
        `<div id=8zelda class="element" style=' position: absolute; top: 12; left: 3; height: 200; width: 171;'>`
    );

    // Adding background color to the clickable area for each zone and lightening it based on the background image
    // Will turn the underlying black lines into the zone's corresponding color
    pageText = pageText.replace(
        `width=240 height=150 border=0 alt="The Fungus Plains (1)" title="The Fungus Plains (1)"`,
        `width=227 height=141 border=0 alt="The Fungus Plains (1)" title="The Fungus Plains (1)" style='mix-blend-mode: lighten; background-color: red;'`
    );
    pageText = pageText.replace(
        `title="Megalo-City (1)"`,
        `title="Megalo-City (1)" style='mix-blend-mode: lighten; background-color: blue;'`
    );
    pageText = pageText.replace(
        `width=160 height=200 border=0 alt="Hero's Field (1)" title="Hero's Field (1)"`,
        `width=171 height=200 border=0 alt="Hero's Field (1)" title="Hero's Field (1)" style='mix-blend-mode: lighten; background-color: green;'`
    );

    // A little piece on styled html for the bonus zone indicator on the map
    const bonusOverlay = `<div class="bonus-overlay">${bonusIndication}</div>`;

    // Adds a border around the bonus zone's clickable area
    switch (bonusZone) {
        case "black":
            pageText = pageText.replace(
                `'><a  href=adventure.php?snarfblat=565>`,
                `border: 2px solid #D6D6D6; border-radius: 5px;'><a  href=adventure.php?snarfblat=565>${bonusOverlay}`
            );
            break;
        case "red":
            pageText = pageText.replace(
                `'><a  href=adventure.php?snarfblat=563>`,
                `border: 2px solid #D6D6D6; border-radius: 5px;'><a  href=adventure.php?snarfblat=563>${bonusOverlay}`
            );
            break;
        case "blue":
            pageText = pageText.replace(
                `'><a  href=adventure.php?snarfblat=566>`,
                `border: 2px solid #D6D6D6; border-radius: 5px;'><a  href=adventure.php?snarfblat=566>${bonusOverlay}`
            );
            break;
        case "green":
            pageText = pageText.replace(
                `'><a  href=adventure.php?snarfblat=564>`,
                `border: 2px solid #D6D6D6; border-radius: 5px;'><a  href=adventure.php?snarfblat=564>${bonusOverlay}`
            );
            break;
    }

    // Take the massive string of HTML that we've altered and use it in place of the native 8bit page
    write(pageText);
};
