import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
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
    gameEnds: async () => {
      console.log("game ended");
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
      const startingBet = 1
      const deadline = 10
      return { 
        initialBet: startingBet, 
        deadline: deadline 
      };
    }
  }

  const BobActions = {
    acceptBet: () => {
      console.log("bet accepted");
    },
    relayState: (state) => {
      console.log(state);
    }
  }

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...DefaultActions,
      ...AliceActions
    }),
    backend.Bob(ctcBob, {
      ...DefaultActions,
      ...BobActions
    }),
  ]);

  const afterAlice = await getBalance(alice);
  const afterBob = await getBalance(bob);

  console.log(afterAlice);
  console.log(afterBob);

  console.log('Hello, Alice and Bob!');
})();