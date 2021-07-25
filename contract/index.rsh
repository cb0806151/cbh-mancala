'reach 0.1';

// Key
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
const Board = Array(UInt, 12);
const Points = Array(UInt, 2)
const State = Object({
  currentTurnIndex: UInt,
  board: Board,
  points: Points,
});

const iniitalBoard = Array.replicate(12, 4);

const initialState = (turnIndex) => ({
  currentTurnIndex: turnIndex,
  board: board,
  points: playerStores,
});

const adjustHouse = (value, index, houseIndex, piecesCount) => {
  const actualDistance = index < houseIndex ? (12 - houseIndex) + index : index - houseIndex
  const remainder = ((piecesCount - actualDistance) * 100) / 12
  const calculation = remainder > 200 ? 3 :
                      remainder > 100 ? 2 :
                      remainder > 0 ? 1 : 0
  const newValue = value + calculation
  return newValue;
}

const caclulateLaps = (index, houseIndex, piecesCount) => {
  const actualDistance = index < houseIndex ? (13 - houseIndex) + index : index - houseIndex
  const remainder = ((piecesCount - actualDistance) * 100) / 13
  const laps = remainder >= 200 ? 3 :
                remainder >= 100 ? 2 :
                remainder >= 0 ? 1 : 0
  return laps
}

const deductPointsFromTotalPieces = (houseIndex, piecesCount, playerIndex) => {
  const turnaroundPoint = playerIndex === 0 ? 12 : 6;
  const points = caclulateLaps(turnaroundPoint, houseIndex, piecesCount);
  const adjustedPieces = piecesCount - points;
  return { piecesCount: adjustedPieces, points: points };
}

const movePieces = (state, houseIndex) => {
  const playersStoreIndex = state.currentTurnIndex;
  const { piecesCount, points } = deductPointsFromTotalPieces(houseIndex, state.board[houseIndex], playersStoreIndex);
  const preparedBoard = state.board.set(houseIndex, 0);
  const updatedBoard = preparedBoard.mapWithIndex((value, index) => adjustHouse(value, index, houseIndex+1, piecesCount));
  const updatedPoints = state.points.set(playersStoreIndex, state.points[playersStoreIndex] + points);
  const updatedState = { 
    currentTurnIndex: 1, 
    board: updatedBoard,
    points: updatedPoints,
  }

  return updatedState;
}


//////////////////////////////////////////////////////

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
  acceptBet: Fun([State], Null),
};

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
    const state = initialState(1);
    const newState1 = movePieces(state, 0);
    const newState2 = movePieces(newState1, 1);
    const newState3 = movePieces(newState2, 2);
    const newState4 = movePieces(newState3, 3);
    const newState5 = movePieces(newState4, 4);
    const newState6 = movePieces(newState5, 5);
    interact.acceptBet(newState6);
  });

  B.pay(initialBet)
    .timeout(deadline, () => closeTo(A, endOfGame));
  
  // const currentTurnIndex = 0;
  // var state = initialState(currentTurnIndex);
  // invariant( 1 === 1 );
  // while ( winner === 0 ) {
    
  //   if (playerIndex === 0) {
  //     commit();
  //     A.only(() => {
  //       const houseIndex = declassify(interact.getMove());
  //     });
  //     A.publish(houseIndex);
  //     state = movePieces(state, houseIndex);
  //     continue;
  //   } else {
  //     commit();
  //     B.only(() => {
  //       const houseIndex = declassify(interact.getMove());
  //     });
  //     B.publish(houseIndex);
  //     state = movePieces(state, houseIndex);
  //     continue;
  //   }
  // }

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  endOfGame()
  commit();
  exit();

});
