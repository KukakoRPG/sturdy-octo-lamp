# Copilot Instructions for AI Coding Agents

## Project Overview
This project is a browser-based terminal simulation, designed to enhance gameplay for the sci-fi horror tabletop role-playing game (TTRPG) **Mothership®**.

### Mothership TTRPG Context
In Mothership, players take on roles like Teamsters, Scientists, and Androids, exploring a dangerous universe filled with corporate greed, cosmic horrors, and derelict spacecraft. The game is known for its deadly encounters, stress and panic mechanics, and a low-poly, retro-futuristic aesthetic inspired by films like *Alien* and *Event Horizon*.

### Mothership TTRPG uses standard d10s for all of its rolls, though it uses them in 3 different ways
- xd10: Roll a certain number of d10s and add them together. 2d10 would give players a number between 2-20.
- xd10: Note the underline. This means to roll a certain number of d10s and add them together and multiply the result by ten. 2d10 would give players a number between 20-200. If players have a set of d10s with just the tens digits on them, they’re perfect for rolls like this.
- d%: Roll 1d10 and 1d10 and add them together (reading the result as a percentile). This gives players a number between 0-99. You’ll need two sets of d% dice that you players tell apart easily.

### Mothership TTRP uses four different character stats, and players check them trying to roll d% under the appropriate stat
- Strength: How able-bodied PCs are. Lifting, pushing, hitting things hard.
- Speed: How quickly PCs can act and react under pressure.
- Intellect: How knowledgeable and experienced PCs are.
- Combat: How good PCs are at fighting.

Whenever players make a Stat check and players have a situational Advantage, players roll d% twice and use the best result.

### Mothership TTRPG uses following skills
Trained skills
- Archealogy: Ancient cultures and their artifacts.
- Art: The expression of application of a species' creative ability and imagination.
- Athletics: Physical sports and games.
- Biology: Stydy of life.
- Chemistry: The identifucation of the substances of which matter is composed.
- Computers: Fluent use of cimputers and networks.
- Driving: Operation and control of motor vehicles.
- First Aid: Emergency medical care and treatment.
- Geology: The solid features of any terrestial planet or natural satellite.
- Heavy Machinery: Operation and use of large pieces of equipment (cranes, exosuits, forklifts, etc).
- Hydrophonics: Growing plants in nutrient solutions without soil (farming in space).
- Linguistics: Study of language.
- Mathematics: The science of numbers, quantity and space.
- Mechanical Repair: Fixing broken machines.
- Military Training: Standard basic training given to all military personnel.
- Piloting: Operation and control of air and spacecraft.
- Rimwise: Outer rim colonies and seedy parts of the galaxy.
- Scavenging: Searching fiscarded waste for useful items.
- Theology: Stydy of religion.
- Zero-G: Working in a vacuum, vacsuits, etc.

Expert skills
- Asteroid Mining: Training in the tools and procedures used in mining asteroids.
- Astrogation: Nagivation in outer space.
- Botany: The study of plant life.
- Close-Quarters Combat: Hand-to-hand, melee fighting.
- Engineering: Design, building and use of engines, machines and structures.
- Explosives: Bombs and incendiary devices.
- Firearms: Use and maintenace of guns.
- Genetics: Heredity and the variation of inherited characteristics.
- Gunnery: Starship weapon systems.
- Hacking: Unathorized access to computer systems.
- Jury-Rigging: Makeshift repairs and modifications.
- Mysticism: Spiritual apprehension of hidden knowledge.
- Pathology: The study of cause and effect of diseases.
- Physics: The nature and properties of matter and energy.
- Planetology: The study of planets and other celestial bodies.
- Psychology: The study of the mind and behavior.
- Tactics: Maneuvering forces in battle.
- Vehicle Specialization: Operation and control of a specific type of vehicle.

Master Skills
- Artificial Intelligence: Knowledge of simulacrum of human consciousness.
- Command: Leadership and authority over others.
- Cybernetics: Interface between humans and machines.
- Hyperspace: Faster-than-light travel.
- Robotics: Design, construction and operation of robots, drones and androids.
- Sophontology: Alien psychology.
- Weapon Specialization: Use and maintenance of a specific type of weapon.
- Xenobiology: The study of alien biology.
- Xenoesotericism: Obscure alien mysticism, religion and beliefs.

### Mothership TTRPG has four different saves
 - Sanity: Ability to explain away logical inconsistencies in the universe, rationalize and make sense out of chaos, detect illusions and mimicry, and think quickly under pressure.
 - Fear: How well a character can cope with emotional trauma, and covers not only fear but also loneliness, depression, or any other emotional surge.
 - Body: Reflexes, and how well characters can resist hunger, disease, or any other organism that might attempt to invade their body.
 - Armor: How resistant a characters are to damage sustained during combat, whether that be through bullets, claws, teeth, etc.


### Example item prices in Mothership TTRPG
|-------------------------------|----------|
| Item                          | Cost (₡) |
|-------------------------------|----------|
| Advanced Battle Dress         | 1500     |
| Atomed (x6)                   | 300      |
| Binoculars                    | 35       |
| Bioscanner                    | 150      |
| Body Cam                      | 50       |
| Camping Gear                  | 250      |
| Crowbar                       | 25       |
| Cybernetic Diagnostic Scanner | 500      |
| Electronic Tool Set           | 650      |
| Emergency Beacon              | 30       |
| Field Recorder                | 50       |
| First Aid Kit                 | 75       |
| Flashlight                    | 10       |
| Frag Grenade (x6)             | 400      |
| Hazard Suit                   | 750      |
| Heads-Up Display              | 75       |
| Infrared Goggles              | 100      |
| Locator                       | 45       |
| Lockpick Set                  | 40       |
| Long-range Comms              | 65       |
| Mag-Boots                     | 55       |
| Medscanner                    | 150      |
| MRE (x7)                      | 70       |
| Oxygen Tank                   | 50       |
| Pain Pills (x6)               | 450      |
| Radio Jammer                  | 175      |
| Rebreather                    | 45       |
| Scalpel                       | 50       |
| Short-range Comms             | 30       |
| Standard Battle Dress         | 750      |
| Standard Crew Attire          | 20       |
| Stimpaks (x6)                 | 600      |
| Survey Kit                    | 200      |
| Vaccsuit                      | 1000     |
| Vibechete                     | 75       |
| Water Filter                  | 15       |
|-------------------------------|----------|

### Space Travel Time Costs in Mothership TTRPG
There are two possible ways for a ship to travel:
via jump drive or via thrusters. Jump drives are
powerful engines designed to allow a ship to
move faster than the speed of light and travel
great distances by “jumping” into hyperspace.
Many ships don’t need them and rely strictly on
their thrusters, powerful jets that propel ships
between planets and occasionally solar systems
(albeit at a much slower speed than Jump drives).
All ships must have thrusters for maneuvering in
and out of spaceports and from planet to planet,
but not all ships need a jump drive.
Each ship has a Speed Stat (determined by its
thrusters). As a general rule, you can determine
how long it’ll take to get places, using thruster
speed alone,

Jump drives are rated from 1-9, with the rating
showing how large of a jump they can make at a
time as determined by the Warden. Most crews
spend their time in hyperspace in cryosleep with
an android manning the astrogation computer
during the jump. Those who stay awake during
hypersleep have reported strange and conflicting
stories about the experience, and often androids’
memories of the experience are at best described
as unsettling.

Time dilation due to the effects of relativity on
Faster-Than-Light travel are uncertain and
sometimes seemingly random. A crew will return
from a standard Jump 3 voyage to find that they
have been gone for several years. Others return
to find it has only been a month. Standardized
trade routes seem to wear down the chaotic
effects, but those who make long jumps, like
the legendary Jump-9 colony ships, are never
expected to return, their settlers leaving their
previous lives behind. Part of it is the expense
of building the colony ship, but the other part is
that no one is certain what the effects of multiple
Jump-9s would be. And perhaps they have
returned, just millenia into our future. Or else
somewhere in our past.

It costs 1 unit of fuel per day to run the Thrusters.
Jump require fuel equal to the jump (so a Jump
2 requires 2 units of fuel). While in orbit, the
ship only consumes 1 unit of fuel per week. To
launch from the surface of an average gravity
planet consumes 3 fuel. Complicated shipto-
ship combat with lots of maneuvering may
also consume a unit of fuel, depending on the
Warden’s ruling. All of these units are in refined
fuel, which is what most star ports use. However,
unrefined fuel can be found in some asteroids, as
well as distant star ports. It costs twice as much
unrefined fuel as refined fuel to do the same job.
Refined fuel costs vary by system, but start at
10,000 credits per unit.

### Spaceship Upgrades and Repairs in Mothership TTRPG
At a well-equipped star port, upgrades to a ship take
1 week per 10 hull added (or changed). Repairs
take 1 day per 10 hull repaired. Poorly equipped or
remote star ports can double or triple the time taken
to repair or upgrade ships. Repairs cost 100,000
credits per hull, while upgrades cost the standard
10 million credits per hull. If the crew can’t pay the
full cost of the repair or upgrades, then most ports
will let them take out a loan as long as they can pay
30-50% of the cost upfront, paying the remainder
over the coming months. If the crew can’t pay the
upfront charge, then the ship is held until the crew
can come up with the money. There are often
patrons looking to hire mercenaries for dangerous
jobs at these ports and you can often find work with
them in hopes of paying off your ship’s repairs.


### Role of the Terminal
This terminal serves as an interactive tool for the Game Master (known as the "Warden" in Mothership) to immerse players in the game world. Players can interact with the terminal to:
- Access in-game information (emails, logs, system diagnostics).
- Solve puzzles by finding clues hidden in the terminal.
- Control ship systems (e.g., call an elevator, check life support).
- Uncover lore and plot hooks through a realistic, command-line interface.

The core architecture is modular, with distinct responsibilities for terminal UI, command processing, error handling, and custom software logic, allowing Wardens to easily customize the experience for their specific campaigns.

## Key Components
- **index.html**: Entry point. Loads all scripts and styles. Terminal UI is rendered here.
- **src/terminal.js**: Implements terminal behavior, command history, input handling, and tab completion. Defines the `Terminal` class and related event listeners.
- **src/kernel.js**: Manages global state, user/session data, server info, and header rendering. Handles date logic and prompt formatting.
- **src/error.js**: Defines custom error classes for command and system errors. Use these for consistent error handling.
- **src/hack-reveal.js** & **src/glitch-img.js**: Visual effects for text and images, used for immersive feedback.
- **src/particle-img.js**: Additional image effects (see file for details).
- **src/terminal.css**: Terminal look and feel. Uses custom fonts from `src/fonts/`.
- **config/software.json**: Declares available terminal commands/programs, their metadata, and help text. Each entry can specify location, protection (user access), output messages, and more.
- **config/software.js**: Implementations for custom commands listed in `software.json`. Function names must match program names.
- **config/network/**: Contains server manifests, user lists, and mail data for each server (e.g., `∑MAINT`, `icarus`).

## Developer Workflows
- **Add a new command/program**:
  1. Define its metadata in `config/software.json`.
  2. Implement its logic in `config/software.js` (function name must match).
  3. If needed, update server/user data in `config/network/*`.
- **Error handling**: Always throw custom errors from `src/error.js` for predictable terminal feedback.
- **Visual effects**: Use `hackRevealText` and `glitchImage` for immersive UI responses.
- **User/session management**: Server/user state is loaded from manifest and userlist files in `config/network/*`.

## Project-Specific Patterns
- **Hexadecimal date/time formatting**: See `setHeader` in `src/kernel.js` for how server date/time is displayed in hex.
- **Command protection**: Restrict commands to specific users via the `protection` array in `software.json`.
- **Output formatting**: Use HTML in output messages for warnings, notices, and effects.
- **History management**: Initial command history per user/server is set in manifest files.

## External Dependencies
- **jQuery**: Used for DOM manipulation.
- **p5.js**: Used for image effects (glitch rendering).

## Examples
- To add a diagnostic command:
  - Add to `software.json`:
    ```json
    "diagnose": {
      "location": ["∑MAINT"],
      "protection": ["Sonya1"],
      "message": ["..."],
      "help": "Runs system diagnostics."
    }
    ```
  - Implement in `software.js`:
    ```js
    function diagnose() {
      // ...logic...
    }
    ```

## Conventions
- Keep all custom command logic in `config/software.js`.
- Use manifest files for server-specific configuration.
- Prefer HTML output for rich terminal feedback.
- Use custom error classes for all error states.

---
If any section is unclear or missing, please provide feedback for further refinement.
