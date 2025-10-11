/*
 This file contains the logic for custom software programs
 that perform more complex actions than just displaying some text or HTML.

 You are invited to edit this file to define your own commands!
 Start by removing the demo ones that you don't need for your game.

 Remember that function names must match the names of the programs in software.json.
 */
/* eslint-disable no-inner-declarations, no-nested-ternary, no-sequences, no-unused-vars */

function scan( args ) {
    const query = args.join( " " ).toLowerCase();
    if ( !query ) {
        return "Scan requires a target. Usage: scan [object-id]";
    }

    // scannableList is a global variable loaded by kernel.js
    const allScannableIds = Object.keys( scannableList );

    const matches = allScannableIds.filter( ( id ) => id.toLowerCase().includes( query ) );

    if ( matches.length === 0 ) {
        return [
            `Scanning for \"${ query }\"...`,
            "ERROR: No object found with that ID in local range."
        ];
    }

    if ( matches.length > 1 ) {
        const ambiguousOutput = [
            `Multiple objects found matching \"${ query }\". Please be more specific:`,
            ...matches.map( ( id ) => `- ${ scannableList[ id ].name } (${ id })` )
        ];
        return ambiguousOutput;
    }

    // Exactly one match found
    const targetId = matches[ 0 ];
    const targetObject = scannableList[ targetId ];

    let output = [];
    if ( targetObject ) {
        output = [
            `Scanning ${ targetObject.name }...`,
            "----------------------------------------",
            ...targetObject.description,
            "----------------------------------------"
        ];
    } else {
        // This case should ideally not be reached if matches are found
        return `ERROR: Found match \"${ targetId }\" but could not retrieve details.`;
    }

    return { text: output, delayed: 250 };
}

function roll(args) {
    if (args.length === 0) {
        return "Usage: roll [Xd10|d%]";
    }

    const input = args[0].toLowerCase();

    if (input === 'd%') {
        const roll = Math.floor(Math.random() * 100);
        return `Rolling d%... Result: ${roll}`;
    }

    const match = input.match(/^(\d+)d10$/);
    if (match) {
        const numDice = parseInt(match[1], 10);
        if (numDice > 0 && numDice <= 100) { // Let's cap it at 100 dice
            let total = 0;
            for (let i = 0; i < numDice; i++) {
                total += Math.floor(Math.random() * 10) + 1;
            }
            return `Rolling ${numDice}d10... Result: ${total}`;
        }
    }

    return `Invalid roll format. Use Xd10 (e.g., 2d10) or d%.`;
}

function getStatusColor(percentage) {
    if (percentage > 75) {
        return 'status-good';
    }
    if (percentage > 30) {
        return 'status-warning';
    }
    return 'status-danger';
}

function lifesupport() {
    const lifeSupportData = serverDatabase.lifeSupport;

    if (!lifeSupportData) {
        return "ERROR: Life support data not available for this server.";
    }

    const o2Color = getStatusColor(lifeSupportData.o2_percentage);
    const powerColor = getStatusColor(lifeSupportData.power_percentage);
    const co2Status = lifeSupportData.co2_scrubber.includes("OFFLINE") ? "status-danger" : "status-good";
    const co2Text = lifeSupportData.co2_scrubber;


    const output = `
        <div class="notice">Life Support Systems</div>
        <div>O2 Levels: <span class="${o2Color}">${lifeSupportData.o2_percentage}%</span> (${lifeSupportData.o2_levels})</div>
        <div>CO2 Scrubber: <span class="${co2Status}">${co2Text}</span></div>
        <div>Power: <span class="${powerColor}">${lifeSupportData.power_percentage}%</span> (${lifeSupportData.power})</div>
    `;
    return output;
}
