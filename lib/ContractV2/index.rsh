'reach 0.1';

// Constants

const Board = Array(UInt, 14);
const defaultBoard = array(UInt, [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0]);

// Win Logic

const leftRowIsEmpty = (board) => {
  return board[1] == 0 && 
         board[2] == 0 && 
         board[3] == 0 && 
         board[4] == 0 && 
         board[5] == 0 && 
         board[6] == 0
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

// Game Logic

const movePieces = (board, houseIndex, nextTurnIndex) => {

  const isAlice = nextTurnIndex == 0
  const enemyStoreIndex = isAlice ? 13 : 0;
  
  // Depending on whose turn it is, an offset is added to the houseIndex to ensure 
  // that the board only has 13 traversable inlets (since each side ignores their 
  // opponents inlet when circling the board)
  const nextHouseIndex = isAlice ? houseIndex + 1 : houseIndex;
  
  // Circles the board once, updating the number of pieces in each house 
  // as it visits them

  const updatedBoard = board.mapWithIndex((value, index) => {
    
    // Calculates the number of spaces (traveling forward around the board) it will 
    // take to get from the current house (index) to the house that the player 
    // moved (nextHouseIndex)
    const spacesFromMovedHouse = (index < nextHouseIndex ? (13 - nextHouseIndex) + index : index - nextHouseIndex)
    const pieces = board[nextHouseIndex];
    
    // Empty the house that is being moved
    if (index == nextHouseIndex) {
      return 0

    // If this house is the enemies store then no pieces are added to it; 
    // also, if the number of pieces from the moved house won't reach this house 
    // then don't add any pieces to it
    } else if ( (index == enemyStoreIndex) || (pieces < spacesFromMovedHouse) ) {
      return value
    } else {

      // If there are enough pieces to reach this house then add the 
      // new pieces to its original value
      const newPieces = ((pieces - spacesFromMovedHouse) / 12) + 1;
      const updatedPieceCount = newPieces + value;
      return updatedPieceCount;
    }
  });

  return updatedBoard
}

// Validation Logic

const betIsValid = (initialBet) => (initialBet >= 0 && initialBet < UInt.max && initialBet < (UInt.max - initialBet));

const validateBet = (interact) => {
  const initialBet = declassify(interact.getBet());
  assume(betIsValid(initialBet));
  return initialBet;
}

const verifyTurnIndex = (currentTurnIndex) => (currentTurnIndex == 0 || currentTurnIndex == 1);

const houseIndexInsideBoard = (index) => (index >= 0 && index < 14 && index != 13 && index != 0);

const houseAtIndexIsNotEmpty = (index, board) => board[index] > 0;

const validateMove = (interact, currentTurnIndex, board) => {
  const houseIndex = interact.getMove(board);
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
  getMove: Fun([Board], UInt),
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
  invariant( balance() == 2 * initialBet && Array.all(board, x => x < 49) )
  while ( rowsAreNotEmpty(board) ) {

    if (currentTurnIndex == 0) {
      commit();
      A.only(() => {
        const nextHouseIndex = validateMove(interact, currentTurnIndex, board);
        const nextTurnIndex = 1;
      });
      A.publish(nextHouseIndex, nextTurnIndex);

      verifyMove(currentTurnIndex, board, nextHouseIndex)

      const updatedBoard = movePieces(board, nextHouseIndex, nextTurnIndex);
      [currentTurnIndex, board, houseIndex] = [nextTurnIndex, updatedBoard, nextHouseIndex]
      continue;
    } else {
      commit();
      B.only(() => {
        const nextHouseIndex = validateMove(interact, currentTurnIndex, board);
        const nextTurnIndex = 0;
      });
      B.publish(nextHouseIndex, nextTurnIndex);

      verifyMove(currentTurnIndex, board, nextHouseIndex)

      const updatedBoard = movePieces(board, nextHouseIndex, nextTurnIndex);
      [currentTurnIndex, board, houseIndex] = [nextTurnIndex, updatedBoard, nextHouseIndex]
      continue;
    }

  }

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  commit();

});
