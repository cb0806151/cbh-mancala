'reach 0.1';

// Key
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
const Board = Array(UInt, 12);
const State = Object({
  currentTurnIndex: UInt,
  board: Board,
});

const iniitalBoard = Array.replicate(12, 4);

const initialState = (turnIndex) => ({
  currentTurnIndex: turnIndex,
  board: board
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

const movePieces = (state, houseIndex) => {
  const piecesCount = state.board[houseIndex];
  const updatedBoard = state.board.set(houseIndex, 0);
  const changedBoard = updatedBoard.mapWithIndex((value, index) => adjustHouse(value, index, houseIndex+1, piecesCount));
  const updatedState = { 
    currentTurnIndex: 1, 
    board: changedBoard 
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
    const state = initialState(0);
    const newState = movePieces(state, 4);
    interact.acceptBet(newState);
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
