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
            `Scanning for "${ query }"...`,
            "ERROR: No object found with that ID in local range."
        ];
    }

    if ( matches.length > 1 ) {
        const ambiguousOutput = [
            `Multiple objects found matching "${ query }". Please be more specific:`,
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
        return `ERROR: Found match "${ targetId }" but could not retrieve details.`;
    }

    return { text: output, delayed: 250 };
}
