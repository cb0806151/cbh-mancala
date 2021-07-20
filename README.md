# Mancala on Conflux 

<details><summary>Description</summary>
<p>  

Creating the game of Mancala on Conflux as part of the Conflux/Reach Bounty Hack.  

</p>
</details>
<details><summary>Environment Setup Instructions</summary>
<p>

Coming soon

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

Backlog
- check out next.js tips and tricks
- sunday recap
- update favicon
- start work on the contract

</p>
</details>
<details><summary>Stretch Goals</summary>
<p>  

- No copy-and-pasting of contract invites: A system that allows users to pick their next game based on currently running games  
- Alternate rules: different common rulesets that can be chosen by the user who starts the game.

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
