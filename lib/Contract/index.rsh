'reach 0.1';

// Key
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

/////////////////////////// Game Constants ///////////////////////////////////

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
const Board = Array(UInt, 12);
const Points = Array(UInt, 2)
const State = Object({
  currentTurnIndex: UInt,
  board: Board,
  points: Points,
});

const initialState = (turnIndex) => ({
  currentTurnIndex: turnIndex,
  board: board,
  points: playerStores,
});

/////////////////////////////////////////////////////////////////////////

//////////////////////// Win Conditions /////////////////////////////////

const leftRowIsEmpty = (houses) => {
  return houses[0] == 0 && 
         houses[1] == 0 && 
         houses[2] == 0 && 
         houses[3] == 0 && 
         houses[4] == 0 && 
         houses[5] == 0
}

const rightRowIsEmpty = (houses) => {
  return houses[6] == 0 && 
         houses[7] == 0 && 
         houses[8] == 0 && 
         houses[9] == 0 && 
         houses[10] == 0 && 
         houses[11] == 0
}

const rowsAreNotEmpty = (state) => {
  return (leftRowIsEmpty(state.board) == false && rightRowIsEmpty(state.board) == false)
}

// GAME WON LOGIC

// const winnerIsAlice = (state) => state.points[0] > state.points[1];

// const winnerIsBob = (state) => state.points[1] > state.points[0];

/////////////////////////////////////////////////////////////////////////

///////////////////////////// Game Logic ////////////////////////////////

// This function calculates the amount of pieces added (newPiecesCount) to the targetHouseIndex 
// when the player moves the piecesCount from houseIndex around the board.
const getUpdatedPiecesCountForHouse = (originalPiecesCount, targetHouseIndex, houseIndex, piecesCount) => {
  // the actualDistance is the amount of spaces the pieces must travel through to get to the targetHouseIndex
  const actualDistance = targetHouseIndex <= houseIndex ? (12 - houseIndex) + targetHouseIndex : targetHouseIndex - houseIndex;

  // the newPieces calculates how many spaces the pieces can travel after they've gotten to the targetHouseIndex and reduces it down to the additional pieces added to the original pieces
  const newPieces = (piecesCount >= actualDistance && ((piecesCount - actualDistance) / 12) < (UInt.max - 1)) ? ((piecesCount - actualDistance) / 12) + 1 : 0;
  
  // if there aren't enough pieces to cross the actualDistance then the piece count of the targetHouseIndex won't change and can be returned
  if (piecesCount < actualDistance) return originalPiecesCount;

  // the 
  const newPiecesCount = (originalPiecesCount >= 0 && newPieces < UInt.max && originalPiecesCount <= (UInt.max - newPieces)) ? originalPiecesCount + newPieces : originalPiecesCount;
  return newPiecesCount;
}

// This function calculates the amount of times a player has added a piece to their store
// when starting from a house at houseIndex with x amount of pieces (piecesCount).

// Turnaroundpoint represents the index of the store at either the left or right 
// side of the board.
const caclulateLaps = (turnaroundPoint, houseIndex, piecesCount) => {
  // actualDistance gets the amount of pieces needed to get from the houseIndex to the turnaroundPoint
  const actualDistance = turnaroundPoint < houseIndex ? (13 - houseIndex) + turnaroundPoint : turnaroundPoint - houseIndex;
  // If there are enough pieces to get there, then reduce them by that amount,
  // and divide the remainder by the length of the board to see how many more  
  // laps can be made 
  const laps = (piecesCount >= actualDistance && ((piecesCount - actualDistance) / 12) < (UInt.max - 1)) ? ((piecesCount - actualDistance) / 12) + 1 : 0;
  // if there aren't enough pieces to get from the houseIndex to the turnaroundPoint,
  // then there aren't enough pieces to score a point and therefore a 0 can be returned
  if (piecesCount < actualDistance) return 0;

  return laps;
}

// Moves the pieces contained at a house with houseIndex around the board, thereby completing one turn
// on behalf of the player.
const movePieces = (state, houseIndex) => {
  const playersStoreIndex = state.currentTurnIndex;
  const piecesCount = state.board[houseIndex];
  const turnaroundPoint = playersStoreIndex == 0 ? 12 : 6;
  const points = caclulateLaps(turnaroundPoint, houseIndex, piecesCount);
  
  const updatedPiecesCount = piecesCount - points
  const preparedBoard = state.board.set(houseIndex, 0);
  const updatedBoard = preparedBoard.mapWithIndex((value, index) => getUpdatedPiecesCountForHouse(value, index, houseIndex, updatedPiecesCount));
  const verifiedPoints = (state.points[playersStoreIndex] >= 0 && state.points[playersStoreIndex] <= UInt.max - points) ? state.points[playersStoreIndex] + points : state.points[playersStoreIndex];
  const updatedPoints = state.points.set(playersStoreIndex, verifiedPoints);
  const updatedState = { 
    currentTurnIndex: playersStoreIndex == 1 ? 0 : 1, 
    board: updatedBoard,
    points: updatedPoints,
  }

  return updatedState;
}

/////////////////////////////////////////////////////////////////////////

///////////////////////// Validation Logic ////////////////////////////

const verifyTurnIndex = (currentTurnIndex) => (currentTurnIndex == 0 || currentTurnIndex == 1);

// verifies the houseIndex given is within the boundaries of the board
const houseIndexInsideBoard = (index) => (index >= 0 && index < 12);

// verifies the house at houseIndex is not empty of pieces and can therefore be chosen
const houseAtIndexIsNotEmpty = (index, state) => state.board[index] > 0;

const validateMove = (interact, state) => {
  const houseIndex = interact.getMove(state);
  assume(verifyTurnIndex(state.currentTurnIndex));
  assume(houseIndexInsideBoard(houseIndex));
  assume(houseAtIndexIsNotEmpty(houseIndex, state));
  return declassify(houseIndex);
}

const executeMove = (state, houseIndex) => {
  require(verifyTurnIndex(state.currentTurnIndex));
  require(houseIndexInsideBoard(houseIndex));
  require(houseAtIndexIsNotEmpty(houseIndex, state));
  const newState = movePieces(state, houseIndex);
  return newState;
}

const betIsValid = (initialBet) => (initialBet >= 0 && initialBet < UInt.max && initialBet < (UInt.max - initialBet));

const validateBet = (interact) => {
  const { initialBet, deadline } = declassify(interact.getBet());
  assume(betIsValid(initialBet));
  return {
    initialBet: initialBet,
    deadline: deadline
  };
}

/////////////////////////////////////////////////////////////////////////

//////////////////////// Participant Profiles ///////////////////////////

const Players = {
  gameEnds: Fun([], Null),
  getMove: Fun([State], UInt),
};

const Alice = {
  getBet: Fun([], Object({
    initialBet: UInt,
    deadline: UInt
  })),
};

const Bob = {
  acceptBet: Fun([], Null),
  relayState: Fun([State], Null),
};

/////////////////////////////////////////////////////////////////////////

export const main = Reach.App(() => {
  setOptions({ 
    verifyArithmetic: true, 
    verifyPerConnector: true 
  });
  const A = Participant('Alice', {...Players, ...Alice});
  const B   = Participant('Bob', {...Players, ...Bob});
  deploy();

  const endOfGame = () => {
    each([A, B], () => {
        interact.gameEnds()
    });
  };
  
  A.only(() => {
    const { initialBet, deadline } = validateBet(interact);
  });

  A.publish(initialBet, deadline)
    .pay(initialBet);

  require(betIsValid(initialBet));

  commit();

  B.only(() => {
    interact.acceptBet();
  });

  B.publish().pay(initialBet)
    // .timeout(deadline, () => closeTo(A, endOfGame));

  // NEW CONTRACT START SEGMENT
  
  // A.only(() => {
  //   const { initialBet, deadline } = validateBet(interact);
  //   const _coinFlipA = interact.random();
  //   const commitA = declassify(digest(_coinFlipA));
  // });

  // A.publish(initialBet, deadline, commitA)
  //   .pay(initialBet);

  // require(betIsValid(initialBet));

  // commit();

  // B.only(() => {
  //   interact.acceptBet();
  //   const coinFlipB = declassify(interact.random());
  // });

  // B.publish(coinFlipB).pay(initialBet)

  // A.only(() => {
  //   const coinFlipA = declassify(_coinFlipA);
  // });
  // A.publish(coinFlipA);

  // require(commitA == digest(coinFlipA));
  // const AliceIsFirst = (((coinFlipA % 2) + (coinFlipB % 2)) % 2) == 0 ? 0 : 1;

  // GAME LOOP

  const currentTurnIndex = 1//AliceIsFirst;
  var state = initialState(currentTurnIndex);
  invariant( balance() == 2 * initialBet );
  while ( rowsAreNotEmpty(state) ) {
    
    if (state.currentTurnIndex == 0) {
      commit();
      A.only(() => {
        const houseIndex = validateMove(interact, state);
      });
      A.publish(houseIndex);
      state = executeMove(state, houseIndex);
      continue;
    } else {
      commit();
      B.only(() => {
        const houseIndex = validateMove(interact, state);
      });
      B.publish(houseIndex);
      state = executeMove(state, houseIndex);
      continue;
    }
  }


  // GAME WON LOGIC

  // const [ winningsForAlice, winningsForBob ] = 
  //   winnerIsAlice(state) ? [2, 0] :
  //   winnerIsBob(state) ? [2, 0] :
  //   [1,1]

  // transfer(winningsForAlice * initialBet).to(A);
  // transfer(winningsForBob * initialBet).to(B);

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  endOfGame()
  commit();
  exit();

});