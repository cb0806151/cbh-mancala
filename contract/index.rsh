'reach 0.1';

// Key
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);

const Players = {
  gameEnds: Fun([], Null),
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
  let distance = houseIndex + pebbleCount
  let newPoints = 0
  while (distance > turnaround) {
    distance -= 12
    newPoints++
  }
  playerStores.set(playerIndex, playerStores[playerIndex] + newPoints);
  return houseIndex + pebbleCount - newPoints;
}

const makeMove = (houseIndex, playerIndex) => {
  // turnaround is the name for the point on the board at which the player drops a point in their store
  const turnaround = playerIndex === 0 ? 11 : 5;
  const pebbleCount = deductPointsFromPebbleCount(houseIndex, board[houseIndex], turnaround, playerIndex);
  
  // empty the house that you just took all the pieces from
  board.set(houseIndex, 0)

  // shift the house index so that the first piece is added to the next house
  houseIndex++

  // go around the board adding the pieces to their respective houses
  for (nextHouseIndex = 0; nextHouseIndex < pebbleCount; nextHouseIndex++) {
    let currentHouseIndex = (houseIndex + nextHouseIndex) % 12
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
  
  // while (no winner) {
  //   if (itsAlicesTurn) {
  //     makeMove(houseIndex, playerIndex)

  //     flip turn boolean
  //     continue
  //   } else {
    // makeMove(houseIndex, playerIndex)
    //     flip turn boolean
    //     continue
  //   }
  // }

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  endOfGame()
  commit();
  exit();

});
