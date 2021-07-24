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

const deductPointsFromPiecesCount = (houseIndex, piecesCount, turnaround, playerIndex) => {
  let distance = houseIndex + piecesCount;
  let newPoints = 0;
  while (distance > turnaround) {
    distance = distance - 12;
    newPoints++;
  }
  playerStores[playerIndex] = playerStores[playerIndex] + newPoints;
  return houseIndex + piecesCount - newPoints;
}

const moveHousesPieces = (houseIndex, playerIndex) => {
  // turnaround is the name for the point on the board at which the player drops a point in their store, 
  // flips to the other line of houses, and starts moving in the opposite direction.
  
  // That turnaround point for the player on the left is index 11 in the board variable and index 5 
  // for the player on the right
  const turnaround = playerIndex === 0 ? 11 : 5;
  const piecesCount = deductPointsFromPiecesCount(houseIndex, board[houseIndex], turnaround, playerIndex);
  const offset = 1;
  board[houseIndex] = 0;
  for (nextHouseIndex = 0; nextHouseIndex < piecesCount; nextHouseIndex++) {
     let currentHouseIndex = (houseIndex + offset + nextHouseIndex) % 12;
     board[currentHouseIndex] = board[currentHouseIndex] + 1;
  }
}

makeMove(4, 1)
console.log(board)
console.log(playerStores)
