

const movePieces = (board, houseIndex, nextTurnIndex) => {
  const enemyStoreIndex = nextTurnIndex == 0 ? 13 : 0;
  const nextHouseIndex = nextTurnIndex == 0 ? houseIndex + 1 : houseIndex;
  
  const updatedBoard = board.map((value, index) => {
    
    const spacesFromMovedHouse = (index < nextHouseIndex ? (13 - nextHouseIndex) + index : index - nextHouseIndex)
    const pieces = board[nextHouseIndex];
    
    if (index == nextHouseIndex) {
      return 0
    } else if ( (index == enemyStoreIndex) || (pieces < spacesFromMovedHouse) ) {
      return value
    } else {
      return value + Math.floor((pieces - spacesFromMovedHouse) / 12) + 1;
    }
  });
  console.log(nextHouseIndex, updatedBoard)
  printBoard(board)
  return updatedBoard
}

const printBoard = (theBoard) => {
  var boardString = ""
  for (i = 0; i < 14; i++) {
    boardString = boardString + ` ${theBoard[i]} `;
    if (i == 6) boardString = boardString + `\n`;
  }

  console.log(boardString)
}

for (i = 0; i < 14; i++) {
  if (i == 0 || i == 13) continue
  board = movePieces(board, i, 1);
  
}











// actualDistance gets the amount of pieces needed to get from the startIndex to the endIndex
const actualDistance = houseCount == 13 ? 
(endIndex < startIndex ? (houseCount - startIndex) + endIndex : endIndex - startIndex) :
(endIndex <= startIndex ? (houseCount - startIndex) + endIndex : endIndex - startIndex)



// This function calculates the amount of pieces added (newPiecesCount) to the targetHouseIndex 
// when the player moves the piecesCount from houseIndex around the board.
const getUpdatedPiecesCountForHouse = (originalPiecesCount, targetHouseIndex, houseIndex, piecesCount) => {

  const actualDistance = targetHouseIndex <= houseIndex ? (12 - houseIndex) + targetHouseIndex : targetHouseIndex - houseIndex;

  const newPieces = (piecesCount >= actualDistance && ((piecesCount - actualDistance) / 12) < (UInt.max - 1)) ? ((piecesCount - actualDistance) / 12) + 1 : 0;

  if (piecesCount < actualDistance) return originalPiecesCount;

  const newPiecesCount = (originalPiecesCount >= 0 && newPieces < UInt.max && originalPiecesCount <= (UInt.max - newPieces)) ? originalPiecesCount + newPieces : originalPiecesCount;
  return newPiecesCount;
}


const caclulateLaps = (turnaroundPoint, houseIndex, piecesCount) => {
  
  const actualDistance = turnaroundPoint < houseIndex ? (13 - houseIndex) + turnaroundPoint : turnaroundPoint - houseIndex;

  const laps = (piecesCount >= actualDistance && ((piecesCount - actualDistance) / 12) < (UInt.max - 1)) ? ((piecesCount - actualDistance) / 12) + 1 : 0;

  if (piecesCount < actualDistance) return 0;

  return laps;
}



const calculateNextTurnIndex = (endIndex, startIndex, piecesCount, currentTurnIndex) => {
  // actualDistance gets the amount of pieces needed to get from the startIndex to the endIndex
  const actualDistance = endIndex < startIndex ? (13 - startIndex) + endIndex : endIndex - startIndex;
  if (piecesCount < actualDistance) {
    return currentTurnIndex == 1 ? 0 : 1;
  } else {
    if ((piecesCount - actualDistance) < 12) {
      return currentTurnIndex == 1 ? 0 : 1;
    } else {
      if (((piecesCount - actualDistance) % 12) == 0) {
        return currentTurnIndex
      } else {
        return currentTurnIndex == 1 ? 0 : 1;
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
  const nextTurnIndex = calculateNextTurnIndex(turnaroundPoint, houseIndex, piecesCount, playersStoreIndex)
  const updatedState = { 
    currentTurnIndex: nextTurnIndex, 
    board: updatedBoard,
    points: updatedPoints,
  }

  return updatedState;
}



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

// Key:
// -Stores = inlets on each side of the board where the players collect points
// -Houses = 12 inlets covering the middle of the board
// -Pieces = pebbles that sit inside the inlets and are moved across them during a players turn

// to image the flow of the board, imagine the array like so
// top left side of board      4,4,4,4,4,4]   top right side of board
// bottom left side of board   [4,4,4,4,4,4   bottom righ side of board
let board = [4,4,4,4,4,4,4,4,4,4,4,4];

// the below array maps to the left and right Stores on the board
// left side of boards store [0, 0] right side of boards store
let playerStores = [0, 0];

// const deductPointsFromPiecesCount = (houseIndex, piecesCount, turnaround, playerIndex) => {
//   let distance = houseIndex + piecesCount;
//   let newPoints = 0;
//   while (distance > turnaround) {
//     distance = distance - 12;
//     newPoints++;
//   }
//   playerStores[playerIndex] = playerStores[playerIndex] + newPoints;
//   return houseIndex + piecesCount - newPoints;
// }

// const moveHousesPieces = (houseIndex, playerIndex) => {
//   // turnaround is the name for the point on the board at which the player drops a point in their store, 
//   // flips to the other line of houses, and starts moving in the opposite direction.
  
//   // That turnaround point for the player on the left is index 11 in the board variable and index 5 
//   // for the player on the right
//   const turnaround = playerIndex === 0 ? 11 : 5;
//   const piecesCount = deductPointsFromPiecesCount(houseIndex, board[houseIndex], turnaround, playerIndex);
//   const offset = 1;
//   board[houseIndex] = 0;
//   for (nextHouseIndex = 0; nextHouseIndex < piecesCount; nextHouseIndex++) {
//      let currentHouseIndex = (houseIndex + offset + nextHouseIndex) % 12;
//      board[currentHouseIndex] = board[currentHouseIndex] + 1;
//   }
// }

// makeMove(4, 1)

// let state = {
//   currentTurnIndex: 0,
//   board: board
// };

// const adjustHouse = (value, index, houseIndex, piecesCount) => {
//   const actualDistance = index < houseIndex ? (12 - houseIndex) + index : index - houseIndex
//   const newValue = value + Math.ceil((piecesCount - actualDistance) / 12)
//   console.log(newValue + " " + index + " " + houseIndex)
//   return newValue;
// }

// const movePieces = (state, houseIndex) => {

//   const turnaround = state.currentTurnIndex === 0 ? 11 : 5;
//   const piecesCount = state.board[houseIndex];
//   let uBoard = state.board
//   uBoard[houseIndex] = 0;
  
//   const updatedBoard = uBoard;
// //   const updatedBoard = state.board.set(houseIndex, 0);
  
//   const changedBoard = updatedBoard.map((value, index) => adjustHouse(value, index, houseIndex+1, piecesCount));
// //   const changedBoard = updatedBoard.mapWithIndex((value, index) => adjustHouse(value, index, houseIndex, 25));
  
//   const updatedState = { 
//     currentTurnIndex: 1, 
//     board: changedBoard 
//   }

//   return updatedState;
// }

// console.log(movePieces(state, 4))
// console.log(board)
// console.log(playerStores)



const calculateAdditionAtPoint = (calcPoint, pieces, startPoint) => {
  const actualDistance = calcPoint < startPoint ? (12 - startPoint) + calcPoint : calcPoint - startPoint
  const solution = pieces - actualDistance
  const solution2 = solution / 12
  const solution3 = Math.floor((solution * 100) / 12)
  const solution4 = solution3 > 200 ? 3 :
                    solution3 > 100 ? 2 :
                    solution3 > 0 ? 1 : 0
             
//   console.log(solution + " " + solution + " " + solution3 + " " + calcPoint)
  console.log(solution4 + " " + solution3 + " " + calcPoint)
  return solution;
}


for (i = 0; i < 12; i++) {
  calculateAdditionAtPoint(i, 13, 5);
}






// reach cant deal with floats so how do we ensure these values calculate correctly?







// by subtracting the intial distance from the pieces we are "normalizing" the leftover count in 
// that with it we can calculate how many more iterations will reach this point










// console.log((29 - 9) / 12)
// console.log((4 + 25) % 12); // gives us the location of the last spot
// console.log((4 + 22) % 12);
// console.log(25 / 12); // gives us the right addition except on the last one (which needs 3 instead of two)
// console.log(22 / 12); // gives use the right addition except on the last two


// (pieces - distance forward) / board length

// // why does place 2 only get 1 when the 

// console.log((12 - 4) + 5); // 13 is the distance forward to the point (will alwasy be positive)
// console.log((12 - 5) + 4); // 11 is the distance forward to the point (will alwasy be positive)
// console.log(5 - 4); // 1 is the distance back to the point (could be negative)





// calculateAdditionAtPoint(11, 22, 4);
// calculateAdditionAtPoint(4, 22, 4);
// calculateAdditionAtPoint(2, 22, 4);
// calculateAdditionAtPoint(9, 22, 4);

// this iteration somehow needs to calculate the exact 
// subtraction that is going to happen at each step based on the input values

// 1. you are given the starting point of 4 and 25 pebbles, 
// calculate the amount of pebbles that should be added to point 0, 5, and 11?

// the answer is 2, 3, and 2 

// you are given the starting point of 4 and 23 pebbles, 
// calculate the amount of pebbles that should be added to point 4?

// create an equation for problem 1 using javascript

// 24 / 12 = 2; // the amount of pieces added to each house


// 1 / 12 round up = 1 // the amount of pieces added to each house


// calculate the distance from the starting point to your current point

// from 4 to 1



let state = {
  currentTurnIndex: 0,
  board: board
};



const adjustHouse = (value, index, houseIndex, piecesCount) => {
  const actualDistance = index < houseIndex ? (12 - houseIndex) + index : index - houseIndex
  const remainder = Math.floor(((piecesCount - actualDistance) * 100) / 12)
  const calculation = remainder > 200 ? 3 :
                    remainder > 100 ? 2 :
                    remainder > 0 ? 1 : 0
  
  const newValue = value + calculation
  return newValue;
}

const adjustPoints = (value, index, houseIndex, piecesCount) => {
  const actualDistance = index < houseIndex ? (13 - houseIndex) + index : index - houseIndex
  const remainder = Math.floor(((piecesCount - actualDistance) * 100) / 13)
  const calculation = remainder >= 200 ? 3 :
                    remainder >= 100 ? 2 :
                    remainder >= 0 ? 1 : 0
  const stuff = {
    destination: index,
    youAreHere: houseIndex
  }
//   console.table(stuff)
  const newValue = value + calculation
  return newValue;
}

const deductPointsFromTotalPieces = (houseIndex, piecesCount, playerIndex) => {
  const turnaroundPoint = playerIndex === 0 ? 12 : 6;
  const points = adjustPoints(0, turnaroundPoint, houseIndex, piecesCount);
  const adjustedPieces = piecesCount - points
  return adjustedPieces
}

const movePieces = (state, houseIndex) => {

  const turnaround = state.currentTurnIndex === 0 ? 11 : 5;
//   console.log(state.board[houseIndex])
  const piecesCount = deductPointsFromTotalPieces(houseIndex, state.board[houseIndex], state.currentTurnIndex);
//   console.log(piecesCount)
  let uBoard = state.board
  uBoard[houseIndex] = 0;
  
  const updatedBoard = uBoard;
//   const updatedBoard = state.board.set(houseIndex, 0);
  
  const changedBoard = updatedBoard.map((value, index) => adjustHouse(value, index, houseIndex+1, piecesCount));
//   const changedBoard = updatedBoard.mapWithIndex((value, index) => adjustHouse(value, index, houseIndex, 25));
  
  const updatedState = { 
    currentTurnIndex: 1, 
    board: changedBoard 
  }

  return updatedState;
}



let currentState = state
for (i = 0; i < 6; i++) {
  currentState = movePieces(currentState, i);
  console.log(currentState.board)
}
