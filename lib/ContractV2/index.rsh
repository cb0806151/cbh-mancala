'reach 0.1';

// Constants

const Board = Array(UInt, 14);
const defaultBoard = array(UInt, [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]);

// Win Logic

const leftRowIsEmpty = (board) => {
  return board[0] == 0 && 
         board[1] == 0 && 
         board[2] == 0 && 
         board[3] == 0 && 
         board[4] == 0 && 
         board[5] == 0 
}

const rightRowIsEmpty = (board) => {
  return board[7] == 0 && 
         board[8] == 0 && 
         board[9] == 0 && 
         board[10] == 0 && 
         board[11] == 0 && 
         board[12] == 0
}

const rowsAreNotEmpty = (board) => {
  return (leftRowIsEmpty(board) == false && rightRowIsEmpty(board) == false)
}

const winnerIsAlice = (points) => points[0] > points[1];

const winnerIsBob = (points) => points[1] > points[0];

const determineWinner = (board) => {
  const indexOfLosingSide = leftRowIsEmpty(board) ? 6 : 13;
  const leftoverPoints = board.sum()
  const updatedPointsForLosingSide = board[indexOfLosingSide] + leftoverPoints
  const newPoints = board.set(indexOfLosingSide, updatedPointsForLosingSide);
  const [ winningsForAlice, winningsForBob ] =  winnerIsAlice(newPoints) ? [2, 0] :
                                                winnerIsBob(newPoints) ? [0, 2] :
                                                [1,1]

  return [ winningsForAlice, winningsForBob, newPoints ]
}

// Game Logic

const getPiecesCount = (board, nextHouseIndex, enemyStoreIndex) => {
  const spacesFromMovedHouse = (enemyStoreIndex < nextHouseIndex ? (14 - nextHouseIndex) + enemyStoreIndex : enemyStoreIndex - nextHouseIndex)
  const pieces = board[nextHouseIndex];
  // since the circling of the board is ignoring the enemies store, an offset needs 
  // to be added to the number of pieces to compensate for that ignored move
  const offset = (pieces >= spacesFromMovedHouse) ? (((pieces - spacesFromMovedHouse) / 12) + 1) : 0
  // const updatedPieces = pieces + offset < 49 ? pieces + offset : pieces
  const updatedPieces = pieces + offset
  return updatedPieces
}

const calculateNextTurnIndex = (startIndex, currentTurnIndex, board) => {
  const turnaroundPoint = currentTurnIndex == 0 ? 13 : 6;
  const enemyStoreIndex = currentTurnIndex == 0 ? 6 : 13;
  const piecesCount = getPiecesCount(board, startIndex, enemyStoreIndex)
  // calculate the last house/store a pieces is dropped in
  const lastHouseVisited = (startIndex + piecesCount) % 14;
  // checks if the last house/store a piece is dropped in is the current players store. If so, it grants them 
  // an extra turn; if not, the other player goes next
  if (lastHouseVisited === turnaroundPoint) {
    return currentTurnIndex
  } else {
    return currentTurnIndex == 1 ? 0 : 1;
  }
}

const movePieces = (board, houseIndex, nextTurnIndex) => {
  const enemyStoreIndex = nextTurnIndex == 0 ? 6 : 13;
  const pieces = getPiecesCount(board, houseIndex, enemyStoreIndex)
  const cleanedBoard = board.set(houseIndex, 0)
  
  // Iterates over the board, updating the number of pieces in each house 
  // as it visits them
  const updatedBoard = cleanedBoard.mapWithIndex((value, index) => {
    
    // Calculates the number of spaces (traveling forward around the board) it will 
    // take to get from the current house (index) to the house that the player 
    // moved (houseIndex)
    const spacesFromMovedHouse = (index <= houseIndex ? (14 - houseIndex) + index : index - houseIndex)
    
    // If this house is the enemies store then no pieces are added to it; 
    // also, if the number of pieces from the moved house (houseIndex) won't 
    // reach this house then don't add any pieces to it
    if ( (index == enemyStoreIndex) || (pieces < spacesFromMovedHouse) ) {
      return value
    } else {

      // If there are enough pieces to reach this house then add the 
      // new pieces to its original value
      const newPieces = ((pieces - spacesFromMovedHouse) / 14) + 1;
      const updatedPieceCount = newPieces + value < 49 ? newPieces + value : value;
      return updatedPieceCount;
    }
  });

  return updatedBoard
}

const updateBoardIfOppositeHouseTaken = (startIndex, currentTurnIndex, board) => {
  const turnaroundPoint = currentTurnIndex == 0 ? 13 : 6;
  const enemyStoreIndex = currentTurnIndex == 0 ? 6 : 13;
  const piecesCount = getPiecesCount(board, startIndex, enemyStoreIndex)
  // calculate the last house/store a piece is dropped in
  const lastHouseVisited = (startIndex + piecesCount) % 14;

  if (lastHouseVisited > 12 || lastHouseVisited == turnaroundPoint) {
    return board
  } else {
    const piecesInLastHouseVisited = board[lastHouseVisited]
    const lastHouseVisitedBelongsToAlice = lastHouseVisited > 6;
    const houseOppositeTheOneVisited = lastHouseVisitedBelongsToAlice ? (12 - lastHouseVisited) : ((((6 - lastHouseVisited) * 2) + 1) + lastHouseVisited)
    const piecesInOppositeHouse = board[houseOppositeTheOneVisited]
    const lastHouseIsOnPlayersSideOfBoard = (currentTurnIndex == 0 && lastHouseVisitedBelongsToAlice) || (currentTurnIndex == 1 && !lastHouseVisitedBelongsToAlice)
    const canTakeOppositeHouse = lastHouseIsOnPlayersSideOfBoard && piecesInOppositeHouse > 0 && piecesInLastHouseVisited == 1

    if (canTakeOppositeHouse) {
      const updatedPoints = (board[houseOppositeTheOneVisited] + board[turnaroundPoint] + 1) < 49 ? board[houseOppositeTheOneVisited] + board[turnaroundPoint] + 1 : piecesInLastHouseVisited
      const boardWithoutOppositeHouse = board.set(houseOppositeTheOneVisited, 0);
      const boardWithoutOriginalPiece = boardWithoutOppositeHouse.set(lastHouseVisited, 0);
      const updatedBoard = boardWithoutOriginalPiece.set(turnaroundPoint, updatedPoints)
      return updatedBoard
    } else {
      return board
    }
  }
}

// Validation Logic

const betIsValid = (initialBet) => (initialBet >= 0 && initialBet < UInt.max && initialBet < (UInt.max - initialBet));

const validateBet = (interact) => {
  const initialBet = declassify(interact.getBet());
  assume(betIsValid(initialBet));
  return initialBet;
}

const verifyTurnIndex = (currentTurnIndex) => (currentTurnIndex == 0 || currentTurnIndex == 1);

const houseIndexInsideBoard = (index) => (index >= 0 && index < 14 && index != 13 && index != 6);

const houseAtIndexIsNotEmpty = (index, board) => board[index] > 0;

const validateMove = (interact, currentTurnIndex, board) => {
  const houseIndex = interact.getMove(board, currentTurnIndex);
  assume(verifyTurnIndex(currentTurnIndex));
  assume(houseIndexInsideBoard(houseIndex));
  assume(houseAtIndexIsNotEmpty(houseIndex, board));
  return declassify(houseIndex);
}

const verifyMove = (currentTurnIndex, board, houseIndex) => {
  require(verifyTurnIndex(currentTurnIndex));
  require(houseIndexInsideBoard(houseIndex));
  require(houseAtIndexIsNotEmpty(houseIndex, board));
}

// Participant Profiles 

const Players = {
  ...hasRandom,
  gameEnds: Fun([UInt, Board], Null),
  getMove: Fun([Board, UInt], UInt),
};

const Alice = {
  getBet: Fun([], UInt),
};

export const main = Reach.App(() => {
  setOptions({ 
    verifyArithmetic: true, 
    verifyPerConnector: true 
  });
  const A = Participant('Alice', {...Players, ...Alice});
  const B   = Participant('Bob', {...Players});
  deploy();

  const validateLoop = (initialBet, board) => {
    return balance() == 2 * initialBet 
    && Array.all(board, x => x < 49)
  }
  
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

  var [currentTurnIndex, board, houseIndex] = [participantIndex, defaultBoard, 0];
  invariant( validateLoop(initialBet, board) )
  while ( rowsAreNotEmpty(board) ) {

    if (currentTurnIndex == 0) {
      commit();
      A.only(() => {
        const nextHouseIndex = validateMove(interact, currentTurnIndex, board);
        const nextTurnIndex = calculateNextTurnIndex(nextHouseIndex, currentTurnIndex, board);
      });
      A.publish(nextHouseIndex, nextTurnIndex);

      verifyMove(currentTurnIndex, board, nextHouseIndex)

      const updatedBoard = movePieces(board, nextHouseIndex, nextTurnIndex);
      const finalBoard = updateBoardIfOppositeHouseTaken(nextHouseIndex, currentTurnIndex, updatedBoard);
      [currentTurnIndex, board, houseIndex] = [nextTurnIndex, finalBoard, nextHouseIndex]
      continue;
    } else {
      commit();
      B.only(() => {
        const nextHouseIndex = validateMove(interact, currentTurnIndex, board);
        const nextTurnIndex = calculateNextTurnIndex(nextHouseIndex, currentTurnIndex, board);
      });
      B.publish(nextHouseIndex, nextTurnIndex);

      verifyMove(currentTurnIndex, board, nextHouseIndex)

      const updatedBoard = movePieces(board, nextHouseIndex, nextTurnIndex);
      const finalBoard = updateBoardIfOppositeHouseTaken(nextHouseIndex, currentTurnIndex, updatedBoard);
      [currentTurnIndex, board, houseIndex] = [nextTurnIndex, finalBoard, nextHouseIndex]
      continue;
    }

  }

  const [ winningsForAlice, winningsForBob, finalBoard ] = determineWinner(board)

  transfer(winningsForAlice * initialBet).to(A);
  transfer(winningsForBob * initialBet).to(B);
  commit();

  const gameResolution = winningsForAlice == 2 ? 1 : 
                         winningsForBob == 2 ? 2 : 0;

  each([A, B], () => {
    interact.gameEnds(gameResolution, finalBoard)
  });

});
