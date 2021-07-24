'reach 0.1';

// Key
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);

const Players = {
  gameEnds: Fun([], Null),
  getMove: Fun([], UInt),
};

const Alice = {
  getBet: Fun([], Object({
    initialBet: UInt,
    deadline: UInt
  })),
};

const Bob = {
  acceptBet: Fun([], Null),
};

const deductPointsFromPebbleCount = (houseIndex, pebbleCount, turnaround, playerIndex) => {
  var [ distance, newPoints ] = [ houseIndex + pebbleCount, 0 ];
  invariant(1 === 1);
  while (distance > turnaround) {
    distance = distance - 12;
    newPoints++;
    continue;
  }
  playerStores.set(playerIndex, playerStores[playerIndex] + newPoints);
  return houseIndex + pebbleCount - newPoints;
}

const makeMove = (houseIndex, playerIndex) => {
  // turnaround is the name for the point on the board at which the player drops a point in their store
  const turnaround = playerIndex === 0 ? 11 : 5;
  const pebbleCount = board[houseIndex] //deductPointsFromPebbleCount(houseIndex, board[houseIndex], turnaround, playerIndex);
  
  // empty the house that you just took all the pieces from
  const newArray = Array.set(board, houseIndex, 0)

  // go around the board adding the pieces to their respective houses
  for (nextHouseIndex = 0; nextHouseIndex < pebbleCount; nextHouseIndex++) {
    let currentHouseIndex = (houseIndex + 1 + nextHouseIndex) % 12
    board.set(currentHouseIndex, board[currentHouseIndex] + 1)
  }
}

export const main = Reach.App(() => {
  const A = Participant('Alice', {...Players, ...Alice});
  const B   = Participant('Bob', {...Players, ...Bob});
  deploy();

  const endOfGame = () => {
    each([A, B], () => {
        interact.gameEnds()
    });
  };
  
  A.only(() => {
    const { initialBet, deadline } = declassify(interact.getBet());
  });

  A.publish(initialBet, deadline)
       .pay(initialBet);

  commit();

  B.only(() => {
    interact.acceptBet();
  });

  B.pay(initialBet)
    .timeout(deadline, () => closeTo(A, endOfGame));
  

  var [ playerIndex, winner ] = [ 0, 0 ]
  invariant( 1 === 1 );
  while ( winner === 0 ) {
    
    if (playerIndex === 0) {
      commit();
      A.only(() => {
        const moveHouseIndex = declassify(interact.getMove());
      });
      A.publish(moveHouseIndex);
      // makeMove(moveHouseIndex, playerIndex);
      playerIndex = 1;
      continue;
    } else {
      commit();
      B.only(() => {
        const moveHouseIndex = declassify(interact.getMove());
      });
      B.publish(moveHouseIndex);
      // makeMove(moveHouseIndex, playerIndex);
      [ playerIndex, winner ] = [ 0, 1 ];
      continue;
    }
  }

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  endOfGame()
  commit();
  exit();

});
