/*
 This file contains the logic for custom software programs
 that perform more complex actions than just displaying some text or HTML.

 You are invited to edit this file to define your own commands!
 Start by removing the demo ones that you don't need for your game.

 Remember that function names must match the names of the programs in software.json.
 */
/* eslint-disable no-inner-declarations, no-nested-ternary, no-sequences, no-unused-vars */

/**
 * A "cowsay" like command.
 * It takes arguments and displays them in a speech bubble from an ASCII cow.
 * @param {string[]} args - The arguments passed to the command.
 * @returns {string} The formatted string to be displayed.
 */
function cowsay( args ) {
    const text = args.join( " " );
    if ( !text ) {
        return "What should the cow say?";
    }
    const bubble = `
 < ${ text } >
  \\
   \\
     ^__^
     (oo)\\_______
     (__)\\       )\\/\\
         ||----w |
         ||     ||
    `;
    // Using <pre> to preserve whitespace and use a monospace font
    return `<pre>${ bubble }</pre>`;
}

/**
 * A simple number guessing game.
 * This is an example of an interactive command using `readPrompt`.
 * @returns {object} An object to initiate the interactive prompt.
 */
function guess() {
    const number = Math.floor( Math.random() * 10 ) + 1;
    let attempts = 3;

    function checkGuess( input ) {
        const guessNum = parseInt( input, 10 );
        attempts--;

        if ( guessNum === number ) {
            return "You guessed it! You win!";
        }
        if ( attempts > 0 ) {
            const hint = guessNum < number ? "Too low." : "Too high.";
            return {
                message: `${ hint } You have ${ attempts } attempts left.`,
                prompt: "Your guess? > ",
                onInput: checkGuess
            };
        }
        return `Sorry, you're out of attempts. The number was ${ number }.`;
    }

    return {
        message: "I'm thinking of a number between 1 and 10.",
        prompt: "Your guess? > ",
        onInput: checkGuess
    };
}

/**
 * A plasma dweet effect.
 * This is an example of a visual command using the `dweet` helper.
 */
function plasma() {
    // dweet(u, width, height, delay, style) is defined in kernel.js
    // C, S, T are aliases for Math.cos, Math.sin, Math.tan, and R for rgba.
    return dweet( ( t, x, c ) => {
        for ( let i = 0; i < 256; i++ ) {
            const p = S( t - i / 9 - S( t ) * 2 ) * 64;
            x.fillStyle = R( p, i, 128 - p );
            x.fillRect(
                c.width / 2 + S( i / 25.5 ) * 255 + S( i / 16 + t * 2 ) * p,
                c.height / 2 + C( i / 25.5 ) * 255 + C( i / 16 + t * 2 ) * p,
                p / 8, p / 8
            );
        }
    } );
}
