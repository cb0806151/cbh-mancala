'reach 0.1';

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 
                           4, 4, 4, 4, 4, 4]);

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {});
  const Bob   = Participant('Bob', {});
  deploy();
  
  // place bets

  // while (no winner) {
  //   if (itsAlicesTurn) {
  //     makeMove()
  //     check if they get bonus
  //     check if they get extra turn
  //     flip turn boolean
  //     continue
  //   } else {

  //   }
  // }

  // give the winner the bet pool

});
