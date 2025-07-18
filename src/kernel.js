// Global scope variables
const defaultServerAddress = "icarus";
let serverDatabase = {};
let userDatabase = {};
let userList = [];
let mailList = [];
let cmdLine_;
let output_;
let serverDate = { day: "", month: "", year: "", reference: "" };

function initDateObject() {
    const date = new Date();
    const day = serverDatabase.day ? serverDatabase.day : date.getDate();
    const month = serverDatabase.month ? serverDatabase.month : date.getMonth() + 1;
    const baseYear = serverDatabase.year ? serverDatabase.year : date.getFullYear();
    // Change the number below to add or remove from current real year display in server information.
    const year = baseYear + 512;
    const reference = serverDatabase.reference ? serverDatabase.reference : "(HTC, Hexa-Temporal Code)";
    serverDate = { day, month, year, reference };
}

function debugObject( obj ) {
    for ( const property in obj ) {
        console.log( `${ property }: ${ JSON.stringify( obj[ property ] ) }` );
        output( `${ property }: ${ JSON.stringify( obj[ property ] ) }` );
    }
}

/**
 * Set Header and Prompt informations.
 *
 * This function is useful to avoid code repetition.
 *
 * @param {String} msg A message to be showed when done
 */
function setHeader( msg ) {
    // Setting correct header icon and terminal name
    const promptText = `[${ userDatabase.userName }@${ serverDatabase.terminalID }] # `;

    initDateObject();
    const yearHex = parseInt( serverDate.year, 10 ).toString( 16 ).toUpperCase().padStart( 4, "0" );
    const monthHex = parseInt( serverDate.month, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
    const dayHex = parseInt( serverDate.day, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
    const date = new Date();
    const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    const scaledTime = Math.floor( ( totalSeconds / 86400 ) * 65535 );
    const hexTime = scaledTime.toString( 16 ).toUpperCase().padStart( 4, "0" );
    const dateStr = `${ yearHex }${ monthHex }${ dayHex }${ hexTime }`;
    const imgUrl = `config/network/${ serverDatabase.serverAddress }/${ serverDatabase.iconName }`;
    const imgSize = serverDatabase.iconSize || 100;
    const header = `
    <img src="${ imgUrl }" width="${ imgSize }" height="${ imgSize }"
         style="float: left; padding-right: 10px" class="${ serverDatabase.iconClass || "" }">
    <h2 style="letter-spacing: 4px">${ serverDatabase.serverName }</h2>
    <p>Logged in: ${ serverDatabase.serverAddress } (&nbsp;${ dateStr }&nbsp;) </p>
    ${ serverDatabase.headerExtraHTML || "" }
    <p>Enter "help" for more information.</p>
    <div style="clear: both;"></div>
    `;
    // Clear content:
    output_.innerHTML = "";
    cmdLine_.value = "";
    if ( term ) {
        term.loadHistoryFromLocalStorage( serverDatabase.initialHistory );
    }
    output( [ header, msg ] ).then( () => applySFX() );
    $( ".prompt" ).html( promptText );
}

/**
 * Cross-browser impl to get document's height.
 *
 * This function is necessary to auto-scroll to the end of page after each terminal command.
 */
function getDocHeight_() {
    const doc = document;
    return Math.max(
        Math.max( doc.body.scrollHeight, doc.documentElement.scrollHeight ),
        Math.max( doc.body.offsetHeight, doc.documentElement.offsetHeight ),
        Math.max( doc.body.clientHeight, doc.documentElement.clientHeight )
    );
}

/**
 * Scroll to bottom and clear the input value for a new line.
 */
function newLine() {
    window.scrollTo( 0, getDocHeight_() );
    cmdLine_.value = ""; // Clear/setup line for next input.
}

/**
 * Display content as terminal output.
 *
 * @param {String} data The string to be returned as a print in terminal
 * @param {Array} data The array to be returned as a print in terminal
 */
function output( data ) {
    return new Promise( ( resolve ) => {
        let delayed = 0;

        if ( data && data.constructor === Object ) {
            delayed = data.delayed;
            data = data.text;
        }

        if ( data && data.constructor === Array ) {
            if ( delayed && data.length > 0 ) {
                outputLinesWithDelay( data, delayed, () => resolve( newLine() ) );
                return;
            }
            $.each( data, ( _, value ) => {
                printLine( value );
            } );
        } else if ( data ) {
            printLine( data );
        }
        resolve( newLine() );
    } );
}

/**
 * Print lines of content with some delay between them.
 *
 * @param {Array} lines list of content to display
 * @param {Number} delayed delay in milliseconds between which to display lines
 */
function outputLinesWithDelay( lines, delayed, resolve ) {
    const line = lines.shift();
    printLine( line );
    if ( lines.length > 0 ) {
        setTimeout( outputLinesWithDelay, delayed, lines, delayed, resolve );
    } else if ( resolve ) {
        resolve();
    }
}

/**
 * Display some text, or an image, on a new line.
 *
 * @param {String} data text to display
 * @param {Object} data information on what to display
 */
function printLine(data) {
    data ||= ""; // Ensure data is not null/undefined
    if (!data.startsWith("<")) {
        // If it's not already HTML, wrap it in a paragraph tag.
        // Use a non-breaking space for empty lines to ensure they render with height.
        data = `<p>${data.trim() === "" ? "&nbsp;" : data}</p>`;
    }
    output_.insertAdjacentHTML("beforeEnd", data);
    applySFX();
}

function applySFX() {
    $( output_ ).find( ".desync" ).each( ( _, elem ) => {
        const text = elem.textContent.trim();
        if ( text ) {
            elem.dataset.text = text;
        }
    } );
    $( output_ ).find( "img.glitch" ).filter( once ).each( ( _, img ) => {
        // If the image is already loaded (e.g. from cache), apply the effect.
        // Otherwise, wait for it to load before applying the effect.
        if ( img.complete ) {
            glitchImage( img );
        } else {
            img.onload = () => glitchImage( img );
        }
    } );
    $( output_ ).find( "img.particle" ).filter( once ).each( ( _, img ) => {
        if ( img.complete ) {
            particleImage( img );
        } else {
            img.onload = () => particleImage( img );
        }
    } );
    $( output_ ).find( ".hack-reveal" ).filter( once ).each( ( _, elem ) => hackRevealText( elem, elem.dataset ) );
}

function once( _, elem ) {
    if ( elem.dataset.marked ) {
        return false;
    }
    elem.dataset.marked = true;
    return true;
}

/**
 * The Kernel will handle all software (system calls).
 *
 * The app name will be checked first if it exists as a system 'native' command.
 * If it doesn't, it will look for a custom software defined at software.json.
 *
 * You can define commands with filetypes by naming the function as command_type.
 * The kernel will handle every `.` as a `_` when looking for the correct software.
 * i.e. the `bar_exe` function needs to be called as the `bar.exe` command in the Terminal.
 *
 * @param {String} app The app name
 * @param {Array} args A list of Strings as args
 */
function kernel( appName, args ) {
    const program = allowedSoftwares()[ appName ];
    if ( program ) {
        return software( appName, program, args );
    }
    const systemApp = system[ appName ] || system[ appName.replace( ".", "_" ) ];
    const appDisabled = ( program === null );
    if ( !systemApp || appDisabled ) {
        return Promise.reject( new CommandNotFoundError( appName ) );
    }
    return systemApp( args );
}

/**
 * Attempts to connect to a server.
 * If successful, sets global variables serverDatabase / userDatabase / userList / mailList
 */
kernel.connectToServer = function connectToServer( serverAddress, userName, passwd ) {
    return new Promise( ( resolve, reject ) => {
        if ( serverAddress === serverDatabase.serverAddress ) {
            reject( new AlreadyOnServerError( serverAddress ) );
            return;
        }
        $.get( `config/network/${ serverAddress }/manifest.json`, ( serverInfo ) => {
            if ( !userName && serverInfo.defaultUser ) {
                serverDatabase = serverInfo;
                userDatabase = serverInfo.defaultUser;
                $.get( `config/network/${ serverInfo.serverAddress }/userlist.json`, ( users ) => {
                    userList = users;
                } );
                $.get( `config/network/${ serverInfo.serverAddress }/mailserver.json`, ( mails ) => {
                    mailList = mails;
                } );
                setHeader( "Connection successful" );
                resolve();
            } else if ( userName ) {
                $.get( `config/network/${ serverInfo.serverAddress }/userlist.json`, ( users ) => {
                    const matchingUser = users.find( ( user ) => user.userId === userName );
                    if ( !matchingUser ) {
                        reject( new UnknownUserError( userName ) );
                        return;
                    }
                    if ( matchingUser.password && matchingUser.password !== passwd ) {
                        reject( new InvalidPasswordError( userName ) );
                        return;
                    }
                    serverDatabase = serverInfo;
                    userDatabase = matchingUser;
                    userList = users;
                    $.get( `config/network/${ serverInfo.serverAddress }/mailserver.json`, ( mails ) => {
                        mailList = mails;
                    } );
                    setHeader( "Connection successful" );
                    resolve();
                } ).fail( () => {
                    reject( new AddressNotFoundError( serverAddress ) );
                } );
            } else {
                reject( new ServerRequireUsernameError( serverAddress ) );
            }
        } ).fail( ( ...args ) => {
            console.error( "[connectToServer] Failure:", args );
            reject( new AddressNotFoundError( serverAddress ) );
        } );
    } );
};

/**
 * This will initialize the kernel function.
 *
 * It will define the help functions, set some important variables and connect the databases.
 *
 * @param {Object} cmdLineContainer The Input.cmdline right of the div.prompt
 * @param {Object} outputContainer The output element inside the div#container
 */
kernel.init = function init( cmdLineContainer, outputContainer ) {
    return new Promise( ( resolve, reject ) => {
        cmdLine_ = document.querySelector( cmdLineContainer );
        output_ = document.querySelector( outputContainer );

        $.when(
            $.get( "config/software.json", ( softwareData ) => {
                softwareInfo = softwareData;
                kernel.connectToServer( defaultServerAddress );
            } )
        )
            .done( () => {
                resolve( true );
            } )
            .fail( ( err, msg, details ) => {
                console.error( "[init] Failure:", err, msg, details );
                reject( new JsonFetchParseError( msg ) );
            } );
    } );
};

/**
 * Internal command functions.
 *
 * This is where the internal commands are located.
 * This should have every non-custom software command functions.
 */
system = {
    dumpdb() {
        return new Promise( () => {
            output( ":: serverDatabase - connected server information" );
            debugObject( serverDatabase );
            output( "----------" );
            output( ":: userDatabase - connected user information" );
            debugObject( userDatabase );
            output( "----------" );
            output( ":: userList - list of users registered in the connected server" );
            debugObject( userList );
        } );
    },

    whoami() {
        return new Promise( ( resolve ) => {
            resolve(
                `${ serverDatabase.serverAddress }/${ userDatabase.userId }`
            );
        } );
    },

    clear() {
        return new Promise( ( resolve ) => {
            setHeader();
            resolve( false );
        } );
    },

    date() {
        return new Promise( ( resolve ) => {
            const date = new Date();
            const yearHex = parseInt( serverDate.year, 10 ).toString( 16 ).toUpperCase().padStart( 4, "0" );
            const monthHex = parseInt( serverDate.month, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
            const dayHex = parseInt( serverDate.day, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
            const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
            // Scale total seconds (0-86399) to a 16-bit value (0-65535) for a 4-digit hex representation.
            const scaledTime = Math.floor( ( totalSeconds / 86400 ) * 65535 );
            const hexTime = scaledTime.toString( 16 ).toUpperCase().padStart( 4, "0" );
            resolve( String( `${ yearHex }${ monthHex }${ dayHex }${ hexTime } ${ serverDate.reference }` ) );
        } );
    },

    echo( args ) {
        return new Promise( ( resolve ) => {
            resolve( args.join( " " ) );
        } );
    },

    help( args ) {
        return new Promise( ( resolve ) => {
            const programs = allowedSoftwares();
            if ( args.length === 0 ) {
                const cmdNames = Object.keys( system ).filter(
                    ( cmd ) => {
                        const program = programs[ cmd ];
                        return program !== null && !( program && program.secretCommand ) && cmd !== "dumpdb"; // hidden system command
                    }
                );
                const progNames = Object.keys( programs ).filter(
                    ( pName ) => programs[ pName ] && !programs[ pName ].secretCommand
                );
                Array.prototype.push.apply( cmdNames, progNames );
                cmdNames.sort();
                resolve( [
                    "You can read the help of a specific command by entering as follows: 'help commandName'",
                    "List of useful commands:",
                    `<div class="ls-files">${ cmdNames.join( "<br>" ) }</div>`,
                    "You can navigate in the commands usage history using the UP & DOWN arrow keys.",
                    "The TAB key will provide command auto-completion."
                ] );
            } else if ( args[ 0 ] === "exit" ) {
                resolve( [ "Usage:", "> exit", "The exit command logout the current user and return to the dashboard." ] );
            } else if ( args[ 0 ] === "clear" ) {
                resolve( [ "Usage:", "> clear", "The clear command will wipe the content of the terminal, but it will not affect the history." ] );
            } else if ( args[ 0 ] === "date" ) {
                resolve( [ "Usage:", "> date", "Displays the current server date and time using full HTC (Hexa-Temporal Code) format (YYYYMMDDHHHH)." ] );
            } else if ( args[ 0 ] === "echo" ) {
                resolve( [ "Usage:", "> echo args", "The echo command will print args into terminal." ] );
            } else if ( args[ 0 ] === "help" ) {
                resolve( [ "Usage:", "> help", "The default help message. It will show the commands available on the server." ] );
            } else if ( args[ 0 ] === "htcdecode" ) {
                resolve( [ "Usage:", "> htcdecode YYYYMMDDHHHH", "Converts a full HTC timestamp back to a standard date and time." ] );
            } else if ( args[ 0 ] === "htcencode" ) {
                resolve( [ "Usage:", "> htcencode YYYY-MM-DD HH:MM:SS", "Converts a standard date and time to a full HTC timestamp." ] );
            } else if ( args[ 0 ] === "history" ) {
                resolve( [ "Usage:", "> history", "The history command will list all the commands you alread typed in this terminal." ] );
            } else if ( args[ 0 ] === "login" ) {
                resolve( [ "Usage:", "> login username:password", "Switch account: log in as another registered user on the server, to access your data files and messages." ] );
            } else if ( args[ 0 ] === "mail" ) {
                resolve( [ "Usage:", "> mail", "If you're logged in you can list your mail messages if any. Use the read command to access a specific message." ] );
            } else if ( args[ 0 ] === "ping" ) {
                resolve( [
                    "Usage:",
                    "> ping address",
                    "The ping command will try to reach a valid address.",
                    "If the ping doesn't return a valid response, the address may be incorrect, may not exist or can't be reached locally."
                ] );
            } else if ( args[ 0 ] === "read" ) {
                resolve( [ "Usage:", "> read x", "If you're logged in you can read your mail messages if any. Provide the message index as x." ] );
            } else if ( args[ 0 ] === "ssh" ) {
                resolve( [
                    "Usage:",
                    "> ssh address",
                    "> ssh username@address",
                    "> ssh username:password@address",
                    "You can connect to a valid address to access a specific server on the Internet.",
                    "You may need to specify a username if the server has no default user.",
                    "You may need to specify a password if the user account is protected."
                ] );
            } else if ( args[ 0 ] === "whoami" ) {
                resolve( [ "Usage:", "> whoami", "Display the server you are currently connected to, and the login you are registered with." ] );
            } else if ( args[ 0 ] in softwareInfo ) {
                const customProgram = programs[ args[ 0 ] ];
                if ( customProgram.help ) {
                    resolve( [ "Usage:", `> ${ args[ 0 ] }`, customProgram.help ] );
                }
            } else if ( args[ 0 ] in system && args[ 0 ] !== "dumpdb" ) {
                console.error( `Missing help message for system command: ${ args[ 0 ] }` );
            } else {
                resolve( [ `Unknown command ${ args[ 0 ] }` ] );
            }
        } );
    },

    login( args ) {
        return new Promise( ( resolve, reject ) => {
            if ( !args ) {
                reject( new UsernameIsEmptyError() );
                return;
            }
            let userName = "";
            let passwd = "";
            try {
                [ userName, passwd ] = userPasswordFrom( args[ 0 ] );
            } catch ( error ) {
                reject( error );
                return;
            }
            if ( !userName ) {
                reject( new UsernameIsEmptyError() );
                return;
            }
            const matchingUser = userList.find( ( user ) => user.userId === userName );
            if ( !matchingUser ) {
                reject( new UnknownUserError( userName ) );
                return;
            }
            if ( matchingUser.password && matchingUser.password !== passwd ) {
                reject( new InvalidPasswordError( userName ) );
                return;
            }
            userDatabase = matchingUser;
            setHeader( "Login successful" );
            resolve();
        } );
    },

    // logout() {
    //     return new Promise( () => {
    //         location.reload();
    //     } );
    // },

    exit() {
        return new Promise( () => {
            location.reload();
        } );
    },
    //ISSUE: history() seems to be storing commands between uses. Commenting out to prevent spoilers for players!
    history() {
        return new Promise( ( resolve ) => {
            const messageList = history_.map( ( line, i ) => `[${ i }] ${ line }` ); // eslint-disable-line no-undef
            resolve( messageList );
        } );
    },

    htcdecode( args ) {
        return new Promise( ( resolve ) => {
            if ( args.length === 0 || !args[ 0 ] || args[ 0 ].length !== 12 ) {
                resolve( "Usage: htcdecode YYYYMMDDHHHH" );
                return;
            }

            const htcString = args[ 0 ].toUpperCase();

            if ( !/^[0-9A-F]{12}$/.test( htcString ) ) {
                resolve( "Invalid HTC format. Timestamp must contain only hexadecimal characters (0-9, A-F)." );
                return;
            }

            const yearHex = htcString.substring( 0, 4 );
            const monthHex = htcString.substring( 4, 6 );
            const dayHex = htcString.substring( 6, 8 );
            const timeHex = htcString.substring( 8, 12 );

            const year = parseInt( yearHex, 16 );
            const month = parseInt( monthHex, 16 ).toString().padStart( 2, "0" );
            const day = parseInt( dayHex, 16 ).toString().padStart( 2, "0" );
            const scaledTime = parseInt( timeHex, 16 );

            const totalSeconds = Math.round( ( scaledTime / 65535 ) * 86400 );
            const hours = Math.floor( totalSeconds / 3600 ).toString().padStart( 2, "0" );
            const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 ).toString().padStart( 2, "0" );
            const seconds = ( totalSeconds % 60 ).toString().padStart( 2, "0" );

            resolve( `HTC ${ htcString } corresponds to: ${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }` );
        } );
    },

    htcencode( args ) {
        return new Promise( ( resolve ) => {
            if ( args.length === 0 || !args[ 0 ] || !args[ 0 ].includes( "T" ) ) {
                resolve( "Usage: htcencode YYYY-MM-DD HH:MM:SS" );
                return;
            }

            const [ datePart, timePart ] = args[ 0 ].split( "T" );
            const [ year, month, day ] = datePart.split( "-" );
            const [ hours, minutes, seconds ] = timePart.split( ":" );

            const yearHex = parseInt( year, 10 ).toString( 16 ).toUpperCase().padStart( 4, "0" );
            const monthHex = parseInt( month, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
            const dayHex = parseInt( day, 10 ).toString( 16 ).toUpperCase().padStart( 2, "0" );
            const totalSeconds = parseInt( hours, 10 ) * 3600 + parseInt( minutes, 10 ) * 60 + parseInt( seconds, 10 );
            const scaledTime = Math.floor( ( totalSeconds / 86400 ) * 65535 );
            const hexTime = scaledTime.toString( 16 ).toUpperCase().padStart( 4, "0" );
            const htcString = `${ yearHex }${ monthHex }${ dayHex }${ hexTime }`;
            resolve( `Standard date ${ args[ 0 ] } corresponds to: HTC ${ htcString }` );
        } );
    },

    mail() {
        return new Promise( ( resolve, reject ) => {
            const messageList = mailList.filter( ( mail ) => mail.to.includes( userDatabase.userId ) )
                .map( ( mail, i ) => `[${ i }] ${ mail.title }` );
            if ( messageList.length === 0 ) {
                reject( new MailServerIsEmptyError() );
                return;
            }
            resolve( messageList );
        } );
    },

    read( args ) {
        return new Promise( ( resolve, reject ) => {
            const mailIndex = Number( args[ 0 ] );
            const messageList = mailList.filter( (mail) => mail.to.includes( userDatabase.userId ) );
            const mailAtIndex = messageList[ mailIndex ];
            if ( !mailAtIndex || !mailAtIndex.to.includes( userDatabase.userId ) ) {
                reject( new InvalidMessageKeyError() );
                return;
            }
            let message = [];
            message.push( "---------------------------------------------" );
            message.push( `From: ${ mailAtIndex.from }` );
            message.push( `To: ${ userDatabase.userId }@${ serverDatabase.terminalID }` );
            message.push( "---------------------------------------------" );

            if ( Array.isArray( mailAtIndex.body ) ) {
                // If body is an array of strings, just use it directly.
                message.push( ...mailAtIndex.body );
            } else if ( typeof mailAtIndex.body === "string" ) {
                // For backward compatibility, handle the old string format.
                const bodyLines = mailAtIndex.body.split( /\n| {2}/ );
                message.push( ...bodyLines );
            }

            resolve( message );
        } );
    },

    ping( args ) {
        return new Promise( ( resolve, reject ) => {
            if ( args === "" ) {
                reject( new AddressIsEmptyError() );
                return;
            }
            else if ( args == "+00+" || args == "+11+" ) {
                resolve( [ "STOP.", "<p class=desync>OIIO Cat</p>" ] );
                return;
            }

            $.get( `config/network/${ args }/manifest.json`, ( serverInfo ) => {
                resolve( `Server ${ serverInfo.serverAddress } (${ serverInfo.serverName }) can be reached` );
            } )
                .fail( () => reject( new AddressNotFoundError( args ) ) );
        } );
    },

    // telnet() {
    //     return new Promise( ( _, reject ) => {
    //         reject( new Error( "telnet is unsecure and is deprecated - use ssh instead" ) );
    //     } );
    // },

    ssh( args ) {
        return new Promise( ( resolve, reject ) => {
            if ( args === "" ) {
                reject( new AddressIsEmptyError() );
                return;
            }
            let userName = "";
            let passwd = "";
            let serverAddress = args[ 0 ];
            if ( serverAddress.includes( "@" ) ) {
                const splitted = serverAddress.split( "@" );
                if ( splitted.length !== 2 ) {
                    reject( new InvalidCommandParameter( "ssh" ) );
                    return;
                }
                serverAddress = splitted[ 1 ];
                try {
                    [ userName, passwd ] = userPasswordFrom( splitted[ 0 ] );
                } catch ( error ) {
                    reject( error );
                    return;
                }
            }
            kernel.connectToServer( serverAddress, userName, passwd ).then( resolve ).catch( reject );
        } );
    }
};

function userPasswordFrom( creds ) {
    if ( !creds.includes( ":" ) ) {
        return [ creds, "" ];
    }
    const splitted = creds.split( ":" );
    if ( splitted.length !== 2 ) {
        throw new InvalidCredsSyntaxError();
    }
    return splitted;
}

/**
 * The custom software caller.
 *
 * This will look for custom softwares from `software.json`.
 *
 * @param {String} progName The software name
 * @param {String} args Args to be handled if any
 */
function software( progName, program, args ) {
    return new Promise( ( resolve, reject ) => {
        if ( !program ) {
            return reject( new CommandNotFoundError( progName ) );
        }

        const executeProgram = () => {
            // Special handling for the 'map' command to preserve ASCII art formatting.
            if ( progName === "map" && program.message ) {
                // We join the array into a single string with newlines and wrap it
                // in a <pre> tag. The .ascii-map class ensures the correct font
                // and the <pre> tag preserves all whitespace and line breaks.
                const mapOutput = `<pre class="ascii-map">${ program.message.join( "\n" ) }</pre>`;
                resolve( mapOutput );
                return;
            }
            // For all other commands, use the generic runner
            runSoftware( progName, program, args ).then( resolve, reject );
        };

        if ( program.clear ) {
            system.clear().then( executeProgram );
        } else {
            executeProgram();
        }
    } );
}

/**
 * Run the specified program
 *
 * @param {String} progName The software name
 * @param {Object} program Command definition from sofwtare.json
 * @param {String} args Args to be handled if any
 */
function runSoftware( progName, program, args ) {
    return new Promise( ( resolve ) => {
        let msg;
        if ( program.message ) {
            msg = { text: program.message, delayed: program.delayed };
        } else {
            msg = window[ progName ]( args ) || "";
            if ( msg.constructor === Object ) {
                if ( !msg.onInput ) {
                    throw new Error( "An onInput callback must be defined!" );
                }
                if ( msg.message ) {
                    output( msg.message );
                }
                readPrompt( msg.prompt || ">" ).then( ( input ) => msg.onInput( input ) )
                    .then( ( finalMsg ) => resolve( finalMsg ) );
                return;
            }
        }
        resolve( msg );
    } );
}

/**
 * Read user input
 *
 * @param {String} promptText The text prefix to display before the <input> prompt
 */
function readPrompt( promptText ) {
    return new Promise( ( resolve ) => {
        const prevPromptText = $( "#input-line .prompt" ).text();
        $( "#input-line .prompt" ).text( promptText );
        term.removeCmdLineListeners();
        cmdLine_.addEventListener( "keydown", promptSubmitted );
        function promptSubmitted( e ) {
            if ( e.keyCode === 13 ) {
                cmdLine_.removeEventListener( "keydown", promptSubmitted );
                term.addCmdLineListeners();
                $( "#input-line .prompt" ).text( prevPromptText );
                resolve( this.value.trim() );
            }
        }
    } );
}

/**
 * List only details about programs the current user has access on the current server.
 */
function allowedSoftwares() {
    const softwares = {};
    for ( const app in softwareInfo ) {
        const program = softwareInfo[ app ];
        if ( program === null ) {
            softwares[ app ] = null;
        } else if (
            ( !program.location || program.location.includes( serverDatabase.serverAddress ) ) &&
            ( !program.protection || program.protection.includes( userDatabase.userId ) )
        ) {
            softwares[ app ] = program;
        }
    }
    return softwares;
}

/*
 * Wrapper to easily define sofwtare programs that act as dweets.
 * Reference code: https://github.com/lionleaf/dwitter/blob/master/dwitter/templates/dweet/dweet.html#L250
 * Notable difference with https://dwitter.net : default canvas dimensions are width=200 & height=200
 * There are usage examples in config/software.js
 */
const FPS = 60;
const epsilon = 1.5;
/* eslint-disable no-unused-vars */
const C = Math.cos;
const S = Math.sin;
const T = Math.tan;

let lastDweetId = 0;
function dweet( u, width, height, delay, style ) {
    width = width || 200;
    height = height || 200;
    delay = delay || 0;
    style = style || "";
    const id = ++lastDweetId;
    let frame = 0;
    let nextFrameMs = 0;
    function loop( frameTime ) {
        frameTime = frameTime || 0;
        const c = document.getElementById( id );
        if ( !c ) {
            console.log( `Stopping dweet rendering: no element with id=${ id } found` );
            return;
        }
        requestAnimationFrame( loop );
        if ( frameTime < nextFrameMs - epsilon ) {
            return; // Skip this cycle as we are animating too quickly.
        }
        nextFrameMs = Math.max( nextFrameMs + 1000 / FPS, frameTime );
        let time = frame / FPS;
        if ( time * FPS | frame - 1 === 0 ) {
            time += 0.000001;
        }
        frame++;
        const x = c.getContext( "2d" );
        x.fillStyle = "white";
        x.strokeStyle = "white";
        x.beginPath();
        x.resetTransform();
        x.clearRect( 0, 0, width, height ); // clear canvas
        u( time, x, c );
    }
    setTimeout( loop, delay + 50 ); // Minimal small delay to let time for the canvas to be inserted
    return `<canvas id="${ id }" width="${ width }" height="${ height }" style="${ style }">`;
}

function R( r, g, b, a ) {
    a = typeof a === "undefined" ? 1 : a;
    return `rgba(${ r | 0 },${ g | 0 },${ b | 0 },${ a })`;
}
