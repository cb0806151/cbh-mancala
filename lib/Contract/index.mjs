import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const gameEndMessages = ["And the game ends in a draw!", "Alice wins the game!", "Bob wins the game", "Bob leaves the game", "Alice leaves the game"]
  const stdlib = await loadStdlib(process.env);
  const startingBalance = stdlib.parseCurrency(100);

  const alice = await stdlib.newTestAccount(startingBalance);
  const bob = await stdlib.newTestAccount(startingBalance);

  const ctcAlice = alice.deploy(backend);
  const ctcBob = bob.attach(backend, ctcAlice.getInfo());

  const fmt = (amt) => stdlib.formatCurrency(amt, 4);
  const getBalance = async (account) => fmt(await stdlib.balanceOf(account));

  const getRandomMove = (currentTurnIndex) => Math.floor(Math.random() * 6) + (currentTurnIndex == 0 ? 6 : 0)

  const DefaultActions = {
    gameEnds: async (winIndex) => {
      console.log(gameEndMessages[winIndex]);
    },
    getMove: async (state) => {
      let move = getRandomMove(state.currentTurnIndex)
      while (state.board[move] == 0) {
        move = getRandomMove(state.currentTurnIndex)
      }
      return move
    }
  }

  const AliceActions = {
    getBet: () => {
      const startingBet = stdlib.parseCurrency(10)
      return startingBet
    }
  }

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...stdlib.hasRandom,
      ...DefaultActions,
      ...AliceActions
    }),
    backend.Bob(ctcBob, {
      ...stdlib.hasRandom,
      ...DefaultActions,
    }),
  ]);

  const bobsWalletBalance = await getBalance(bob);
  const alicesWalletBalance = await getBalance(alice);

  console.log(`Bobs wallet balance: ${bobsWalletBalance}`);
  console.log(`Alices wallet balance: ${alicesWalletBalance}`);
})();