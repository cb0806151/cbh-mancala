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

//////////////////////// Win Logic /////////////////////////////////

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

const winnerIsAlice = (points) => points[0] > points[1];

const winnerIsBob = (points) => points[1] > points[0];

const determineWinner = (state) => {
  const indexOfLosingSide = leftRowIsEmpty(state.board) ? 0 : 1;
  const leftoverPoints = Array.all(state.board, x => x < 49) ? state.board.sum() : 0
  const updatedPointsForLosingSide = state.points[indexOfLosingSide] <= (UInt.max - leftoverPoints) ? state.points[indexOfLosingSide] + leftoverPoints : 0
  const newPoints = state.points.set(indexOfLosingSide, updatedPointsForLosingSide);
  const [ winningsForAlice, winningsForBob ] =  winnerIsAlice(newPoints) ? [2, 0] :
                                                winnerIsBob(newPoints) ? [0, 2] :
                                                [1,1]
  const finalState = {
    currentTurnIndex: state.currentTurnIndex,
    board: array(UInt, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    points: newPoints
  }
  return [ winningsForAlice, winningsForBob, finalState ]
}

/////////////////////////////////////////////////////////////////////////

///////////////////////////// Game Logic ////////////////////////////////

const caclulateLaps = (endIndex, startIndex, piecesCount, houseCount) => {
  // actualDistance gets the amount of pieces needed to get from the startIndex to the endIndex
  const actualDistance = houseCount == 13 ? 
    (endIndex < startIndex ? (houseCount - startIndex) + endIndex : endIndex - startIndex) :
    (endIndex <= startIndex ? (houseCount - startIndex) + endIndex : endIndex - startIndex)

  if (piecesCount < actualDistance) {
    // if there aren't enough pieces to get from the startIndex to the endIndex,
    // then there aren't enough pieces to make a circuit and therefore a 0 can be returned
    return 0;
  } else {
    // If there are enough pieces to get there, then reduce them by that amount,
    // and divide the remainder by the length of the board to see how many more  
    // circuits can be made 
    return ((piecesCount - actualDistance) / 12 < (UInt.max - 1)) ? ((piecesCount - actualDistance) / 12) + 1 : 0;
  }
}

const calculateNextTurnIndex = (startIndex, piecesCount, turnaroundPoint, currentTurnIndex) => {
  // calculate the last house/store a pieces is dropped in
  const lastHouseVisited = startIndex <= (UInt.max - piecesCount) ? (startIndex + piecesCount) % 13 : 0;
  // checks if the last house/store a piece is dropped in is the current players store. If so, it grants them 
  // an extra turn; if not, the other player goes next
  if (lastHouseVisited === turnaroundPoint) {
    return currentTurnIndex
  } else {
    return currentTurnIndex == 1 ? 0 : 1;
  }
}

const calculateFinalState = (piecesInOppositeHouse, piecesInLastHouseVisited, updatedBoard, houseOppositeTheOneVisited, points, lastHouseVisited, currentTurnIndex) => {
  if (piecesInOppositeHouse > 0 && piecesInLastHouseVisited == 1) {
    const updatedPoints = (updatedBoard[houseOppositeTheOneVisited] < (UInt.max - 1)) ? updatedBoard[houseOppositeTheOneVisited] + 1 : 0
    const finalPoints = updatedPoints < (UInt.max - points[currentTurnIndex]) ? updatedPoints + points[currentTurnIndex] : 0
    const boardWithoutOppositeHouse = updatedBoard.set(houseOppositeTheOneVisited, 0);
    const boardWithoutOriginalPiece = boardWithoutOppositeHouse.set(lastHouseVisited, 0);
    return {
      currentTurnIndex: currentTurnIndex,
      board: boardWithoutOriginalPiece,
      points: points.set(currentTurnIndex, finalPoints)
    }
  } else {
    return {
      currentTurnIndex: currentTurnIndex,
      board: updatedBoard,
      points: points
    }
  }
}

const checkHouseTakenRule = (points, updatedBoard, startIndex, piecesCount, turnaroundPoint, currentTurnIndex) => {

  const lastHouseVisited = startIndex <= (UInt.max - piecesCount) ? (startIndex + piecesCount) % 13 : 0;
  if (lastHouseVisited == turnaroundPoint) {
    return {
      currentTurnIndex: currentTurnIndex,
      board: updatedBoard,
      points: points
    }
  } else {
    const piecesInLastHouseVisited = lastHouseVisited < 12 ? updatedBoard[lastHouseVisited] : 0
    const lastHouseVisitedBelongsToAlice = lastHouseVisited > 5;
    const houseOppositeTheOneVisited = lastHouseVisitedBelongsToAlice ? (11 - lastHouseVisited) : ((((5 - lastHouseVisited) * 2) + 1) + lastHouseVisited)
    const piecesInOppositeHouse = updatedBoard[houseOppositeTheOneVisited]
    const canTakeOppositeHouse = (currentTurnIndex == 0 && lastHouseVisitedBelongsToAlice) || (currentTurnIndex == 1 && !lastHouseVisitedBelongsToAlice)
  
    if (canTakeOppositeHouse) {
      return calculateFinalState(piecesInOppositeHouse, piecesInLastHouseVisited, updatedBoard, houseOppositeTheOneVisited, points, lastHouseVisited, currentTurnIndex)
    } else {
      return {
        currentTurnIndex: currentTurnIndex,
        board: updatedBoard,
        points: points
      }
    } 
  }
}

// Moves the pieces contained at a house with houseIndex around the board, thereby completing one turn
// on behalf of the player.
const movePieces = (state, houseIndex) => {
  const playersStoreIndex = state.currentTurnIndex;
  const piecesCount = state.board[houseIndex];
  const turnaroundPoint = playersStoreIndex == 0 ? 12 : 6;
  const points = caclulateLaps(turnaroundPoint, houseIndex, piecesCount, 13);
  
  const updatedPiecesCount = piecesCount - points
  const preparedBoard = state.board.set(houseIndex, 0);
  const updatedBoard = preparedBoard.mapWithIndex((value, index) => {
    const laps = caclulateLaps(index, houseIndex, updatedPiecesCount, 12)
    return (value <= (UInt.max - laps)) ? value + laps : value;
  });
  const verifiedPoints = (state.points[playersStoreIndex] >= 0 && state.points[playersStoreIndex] <= UInt.max - points) ? state.points[playersStoreIndex] + points : state.points[playersStoreIndex];
  const updatedPoints = state.points.set(playersStoreIndex, verifiedPoints);
  const nextTurnIndex = calculateNextTurnIndex(houseIndex, piecesCount, turnaroundPoint, playersStoreIndex)
  const finalState = checkHouseTakenRule(updatedPoints, updatedBoard, houseIndex, piecesCount, turnaroundPoint, playersStoreIndex)
  const updatedState = { 
    currentTurnIndex: nextTurnIndex,
    board: finalState.board,
    points: finalState.points,
  }
  return updatedState
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
  const initialBet = declassify(interact.getBet());
  assume(betIsValid(initialBet));
  return initialBet;
}

/////////////////////////////////////////////////////////////////////////

//////////////////////// Participant Profiles ///////////////////////////

const Players = {
  ...hasRandom,
  gameEnds: Fun([UInt, State], Null),
  getMove: Fun([State], UInt),
};

const Alice = {
  getBet: Fun([], UInt),
};

/////////////////////////////////////////////////////////////////////////

export const main = Reach.App(() => {
  setOptions({ 
    verifyArithmetic: true, 
    verifyPerConnector: true 
  });
  const A = Participant('Alice', {...Players, ...Alice});
  const B   = Participant('Bob', {...Players});
  deploy();
  
  A.only(() => {
    const initialBet = validateBet(interact);
    const _coinFlipA = interact.random();
    const commitA = declassify(digest(_coinFlipA));
  });

  A.publish(initialBet, commitA)
    .pay(initialBet);

  require(betIsValid(initialBet));

  commit();

  B.only(() => {
    const coinFlipB = declassify(interact.random());
  });

  B.publish(coinFlipB).pay(initialBet)

  commit()

  A.only(() => {
    const coinFlipA = declassify(_coinFlipA);
  });
  A.publish(coinFlipA);

  require(commitA == digest(coinFlipA));
  const participantIndex = (((coinFlipA % 2) + (coinFlipB % 2)) % 2) == 0 ? 0 : 1;

  const currentTurnIndex = participantIndex;
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

  const [ winningsForAlice, winningsForBob, finalState ] = determineWinner(state)

  transfer(winningsForAlice * initialBet).to(A);
  transfer(winningsForBob * initialBet).to(B);
  commit();

  const gameResolution = winningsForAlice == 2 ? 1 : 
                         winningsForBob == 2 ? 2 : 0;

  each([A, B], () => {
    interact.gameEnds(gameResolution, finalState)
  });
});