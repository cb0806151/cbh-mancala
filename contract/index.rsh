'reach 0.1';

const playerStores = array(UInt, [0, 0]);
const board = array(UInt, [4, 4, 4, 4, 4, 4, 
                           4, 4, 4, 4, 4, 4]);

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

  transfer(initialBet).to(A);
  transfer(initialBet).to(B);
  endOfGame()
  commit();
  exit();
  
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
