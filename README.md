# Mancala on Conflux 

<details><summary>Description</summary>
<p>  

Creating the game of Mancala on Conflux as part of the Conflux/Reach Bounty Hack.  

</p>
</details>
<details><summary>Environment Setup Instructions</summary>
<p>

- clone the repository
- open a terminal to the `cbh-mancala` folder 
- from there run the command `yarn install`
- once that has completed run `cd lib/contract`
- (if on Windows) run the `wsl` command to switch over to linux
- run the `curl https://docs.reach.sh/reach -o reach ; chmod +x reach` command to download reach into the contract folder
- run the `./reach version` command to ensure it installed
- run the `./reach compile` command to build the contract
- run the `REACH_CONNECTOR_MODE=CFX ./reach devnet` command
- start up a new terminal and navigate to the `cbh-mancala` folder 
- now run the `yarn dev` command to run the application

</p>
</details>
<details><summary>Development Log</summary>
<p>

7/14/21
- create github for project
- check out next.js fireship tutorial
- create initital next.js boilerplate
- review bounty hack document
- create readme after implementing boilerplate
- check out next.js tutorial
- watch video on mancala rules
- ask mentor about mancala ruleset for this project
- look into component libraries (UIKit looks like it'll work)
- consult past projects and recount missteps

7/17/21
- check out next.js hosting tutorial
- deploy the boilerplate on vercel
- sketch out some ideas on how this will look

7/19/21
- create state management system
- create basic account connect setup

7/20/21
- write up some ideas on how the contract will work
- set up the boilerplate of the rsh + mjs files

7/21/21
- create pseudo-code draft of contract
- set up place bets and end

7/22/21
- start work on basic piece moving logic

7/23/21: busy all day 

7/24/21
- wrap up draft of piece moving logic
- attempt to implement draft of piece moving logic
- consult the reach tic tac toe example to see how games are actually done inside reach contracts
- start rebuilding piece moving logic

7/25/21
- complete initial draft of piece moving logic

7/26/21
- test and modify broken piece moving logic

7/27/21
- test and modify broken piece moving logic

7/28/21
- test and modify broken piece moving logic
- implement require() and assume() in piece moving draft

7/29/21
- test and modify broken piece moving logic

7/30/21
- fix errors with draft of piece moving logic

7/31/21
- create draft of board
- start plotting out the frontend architecture
- start work on wallet layer
- decide on file naming convention
- decide on using semicolons or not
- start work on draft of branching modal system
- build out drafts of the rest of the pages for the modal
- validate bet value

8/1/21
- work on "have the index.mjs file complete one actual test of the game"

8/2/21
- complete "have the index.mjs file complete one actual test of the game"
- get caught on an issue while trying to implement contract layer

8/4/21
- start work on contract layer

8/5/21
- organize folder structure

8/6/21
- 11th hour dash: add commented out features while contract is being fixed
    - have "connect wallet" button open modal
    - figure out how to randomize starting turns
    - add in extra turn when you score a point
    - add in win logic that transfers the contract balance to the winner

8/7/21
- update package.json to eliminate [refresh issue](https://github.com/vercel/next.js/issues/10061)
- get moves from players through the UI 
- let the player know when its their turn
- update board after player moves a houses pieces
- open modal, with option to start a new game, when the game ends
- enable win logic in contract and update the frontend game end message
- add in "copy invite link" button
- enable random starting player

8/8/21
- display timer/loader/message while contract deploys
- display timer/loader/message while other player takes their turn
- display timer/loader/message while the coin flips
- update favicon
- update page name
- update 'how to play' rules
- start integrating UI framework
- style the home page
- style the board
- style the modals
- fix 'open modal' flow

8/9/21
- Learn some ways to optimize the contract

8/10/21
- disable start button while game is in session
- fix error introduced while optimizing the contract
- Add in extra turn logic
- fix betting system

Backlog
- test out connecting to the Conflux network
- set up timeout system in contract
- optimize reach contract further

</p>
</details>
<details><summary>Stretch Goals</summary>
<p>  

- No copy-and-pasting of contract invites: A system that allows users to pick their next game based on currently running games  
- Alternate rules: different common rulesets that can be chosen by the user who starts the game.
- Make bets optional
- Possibly change state management systems
- add in win logic for emptying the board to the winner
- Add in take-opposite-house rule
- A clock that starts when another player takes their turn, if it runs all the way down the other player forfeits the game
- change theme to dark mode

</p>
</details>
<details><summary>Notes and Such</summary>
<p>  

Notes:
- Start with rsh + mjs files, move to frontend, then add styling
- The board has 14 inlets. 12 of these have pieces moving through them, but two of them are linear in that the pool either increases or resets. This contract needs to track the movement of pieces through or to those inlets. 
- Due to the first player having an advantage, there will need to be a coinflip to ensure fairness
- While the game is running it flips back and forth between two player. However, there are extra turns and other things that change matters
- An array can be mutated using `set`
- Unlike in tic tac toe, you don’t need to check if a move is valid
- The board loops which should make this interesting
- The passage of time inside the game is going to take place inside a while loop
- You’d have a moveStack function that would take an array index and disperse the number of pieces at that array index farther down the chain
- I might want to start with an automated (static) game just to get an idea of how it would work
- In that case the first iteration would be the while loop automatically flipping back and forth as the pieces choose their turns randomly
- The rsh and mjs file need to be done by the 30th
- something in the updatedBoard is not allowing it to be returned to the frontend
- something is also happening when the board is given a houseIndex of 7
- when I don't return the updatedPoints, I can give the function 0 through 12 and it'll be fine
- start adding new stuff to the contract even if it isn't working; it be commented out for now and enabled later
- start setting up the frontend even though it isn't functional yet
- completing one game as a test took roughly half an hour 
- how do I check if the player dropped the last piece in the store?

- frontend architecture stuff
    - create the components for the basic board
    - create the "contract layer" through which contract data will be accessed
    - start work on a branching modal system

- syntax rules
    - files names will be in PascalCase unless they need to be in a different format due to functionality convetions (i.e. how Next.js deals with page routes);
    - no semicolons will be used in the frontend of this project


Questions: 
- I still have no idea how to get the board looping idea to work
    - You would have a dynamic function that consumes the number of pieces and then uses a modulus function to place them across the array
- Now how does this loop know whether or not to place a piece in the end box?
    - I might be able to fix this with one check at the beginning to see if the dispersal will get to your box, deduct it from the amount, and then trigger the dispersal
- How extra moves would work?
    - I think this would just be a trigger that inverts the boolean that determines whose turn it is
    - Or a check to see if you get an extra turn that skips the existing functionality
- What is the first iteration of this contract?
    - The first iteration would be the while loop automatically flipping back and forth as the pieces choose their turns randomly


</p>
</details>
