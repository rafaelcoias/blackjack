"use client";

import React, { useState, useEffect } from "react";
import Button from "~/components/ui/Button";
import { Deck } from "~/components/objects/Deck";
import { CardI, Card } from "~/components/objects/Card";
import "~/styles/game.css";
import DeckComponent from "~/components/ui/Deck";
import Image from "next/image";
import CardUI from "~/components/ui/Card";
import GameButtons from "./components/GameButtons";
import Chip from "~/components/ui/Chip";
import GameOptions from "./components/GameOptions";
import RoundOptions from "./components/RoundOptions";
import { set } from "zod";

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Deck>();

  const [hand, setHand] = useState<CardI[]>([]);
  const [hand2, setHand2] = useState<CardI[]>([]);
  const [cardsBeingGiven, setCardsBeingGiven] = useState<CardI[]>([]);
  const [dealerHand, setDealerHand] = useState<CardI[]>([]);

  const [deckNeedReset, setDeckNeedReset] = useState<boolean>(false);
  const [nextRound, setNextRound] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [isDealingDealer, setIsDealingDealer] = useState<boolean>(false);
  const [hasDoubled, setHasDoubled] = useState<boolean>(false);
  const [roundStarted, setRoundStarted] = useState<boolean>(false);

  const [bet, setBet] = useState<number>(0);
  const [money, setMoney] = useState<GLfloat>(500.0);

  // Set deck on first render
  useEffect(() => {
    const newDeck = new Deck(6);
    setDeck(newDeck);
  }, []);

  // Check if deck needs to be reset
  useEffect(() => {
    if (deck && deck.deck.length <= 10) {
      setDeckNeedReset(true);
    }
  }, [deck]);

  // Check if deck needs to be reset after round ends
  useEffect(() => {
    if (deckNeedReset && nextRound) {
      const newDeck = new Deck(6);
      setDeck(newDeck);
      setDeckNeedReset(false);
    }
  }, [deckNeedReset, nextRound]);

  // Check if player busts, if so dealer wins and round ends
  useEffect(() => {
    if (!gameStarted || !playing || !roundStarted) return;
    const sum = getHandSum(hand);
    if (sum > 21) {
      setNextRound(true);
      setPlaying(false);
      setTimeout(() => {
        alert("Bust! Dealer wins!");
      }, 800);
    }
  }, [hand, playing, roundStarted]);

  // Check if dealer needs to draw more cards 
  // or check winner when dealer has more than 17
  useEffect(() => {
    if (playing || nextRound || !gameStarted) return;
    if (getDealerHandSum(dealerHand) < 17) {
      setTimeout(() => dealCards("dealer", 1), 800);
    } else {
      checkWinner();
    }
  }, [dealerHand, playing, nextRound, gameStarted]);

  // When round starts check for blackjacks
  useEffect(() => {
    if (!roundStarted || !gameStarted) return;
    if (checkBlackjack(hand) && dealerHand.length === 2) {
      setTimeout(() => {
        if (checkBlackjack(dealerHand)) {
          setNextRound(true);
          setPlaying(false);
          setTimeout(() => alert("Push!"), 800);
          setMoney((prevMoney) => prevMoney + bet);
        } else {
          setNextRound(true);
          setPlaying(false);
          setTimeout(() => alert("Blackjack! You win!"), 800);
          setMoney((prevMoney) => prevMoney + (bet * 3) / 2);
        }
      }, 1200);
      return;
    }
    if (checkBlackjack(dealerHand)) {
      setNextRound(true);
      setPlaying(false);
      setTimeout(() => {
        alert("Dealer has blackjack! You lose!");
      }, 800);
    }
  }, [roundStarted, gameStarted, hand, dealerHand]);

  // Deal cards to player or dealer
  const dealCards = (player: string, count: number): void => {
    // Check if deck needs to be reset

    // Start dealing animation
    if (player === "player") {
      setIsDealing(true);
    } else {
      setIsDealingDealer(true);
    }

    // Get cards from deck
    const newCards: CardI[] = [];
    for (let i = 0; i < count; i++) {
      newCards.push(deck!.dealCard());
    }

    setCardsBeingGiven(newCards);

    // Add cards to player or dealer hand after dealing animation
    setTimeout(() => {
      if (player === "player") {
        setHand((prevHand) => [...prevHand, ...newCards]);
        setIsDealing(false);
      } else {
        setDealerHand((prevHand) => [...prevHand, ...newCards]);
        setIsDealingDealer(false);
      }
      setCardsBeingGiven([]);
    }, 600);
  };

  // Checks

  const checkWinner = () => {
    const dealerSum = getDealerHandSum(dealerHand);
    const sum = getHandSum(hand);

    let winnerMessage = "";
    if (nextRound) return;
    if (dealerSum > 21) {
      winnerMessage = "Dealer busts! You win!";
      setMoney((prevMoney) => prevMoney + bet * 2);
    } else if (dealerSum === sum) {
      winnerMessage = "Push!";
      setMoney((prevMoney) => prevMoney + bet);
    } else if (dealerSum > sum) {
      winnerMessage = "Dealer wins!";
    } else if (sum > dealerSum) {
      winnerMessage = "You win!";
      setMoney((prevMoney) => prevMoney + bet * 2);
    }
    if (winnerMessage) setTimeout(() => alert(winnerMessage), 800);
    setNextRound(true);
  };

  const checkBlackjack = (hand: CardI[]) => {
    let sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21) sum += 10;
    if (sum === 21 && hand.length === 2) {
      return true;
    }
    return false;
  };

  // Get sum of hands

  const getHandSum = (hand: CardI[]): number => {
    // If it has As, return highest value
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21)
      return sum + 10;
    return sum;
  };

  const getHandSumToDisplay = (hand: CardI[]): string => {
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21) {
      if (!playing || sum + 10 === 21) return `${sum + 10}`;
      return `${sum} / ${sum + 10}`;
    }
    return `${sum}`;
  };

  const getDealerHandSum = (hand: CardI[]): number => {
    if (playing) return hand.length > 0 ? hand[0]!.value : 0;
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21)
      return sum + 10;
    return sum;
  };

  const getDealerHandSumToDisplay = (hand: CardI[]): string => {
    if (playing) return hand.length > 0 ? hand[0]!.value.toString() : "0";
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (
      hand.some((card) => card.rank === "A") &&
      sum + 10 <= 21 &&
      !nextRound
    ) {
      return `${sum} / ${sum + 10}`;
    } else if (
      hand.some((card) => card.rank === "A") &&
      sum + 10 <= 21 &&
      nextRound
    ) {
      return `${sum + 10}`;
    }
    return `${sum}`;
  };

  // Rounds

  const clearRound = () => {
    setHand([]);
    setDealerHand([]);
    setHasDoubled(false);
  };

  const goToNextRound = () => {
    if (bet > money) {
      alert("You don't have enough money");
      return;
    }
    setNextRound(false);
    setRoundStarted(false);
    clearRound();
    setMoney((prevMoney) => prevMoney - bet);
    dealCards("player", 1);
    setTimeout(() => dealCards("dealer", 1), 1000);
    setTimeout(() => dealCards("player", 1), 2000);
    setTimeout(() => dealCards("dealer", 1), 3000);
    setTimeout(() => setRoundStarted(true), 3800);
    setGameStarted(true);
    setPlaying(true);
  };

  const reset = () => {
    setDeckNeedReset(false);
    goToNextRound();
  };

  // Actions

  const play = () => {
    if (bet === 0) {
      alert("Please place a bet");
      return;
    }
    if (bet > money) {
      alert("You don't have enough money");
      return;
    }
    reset();
  };

  const stand = () => {
    setPlaying(false);
  };

  const split = () => {
    alert("Splitting not implemented yet");
  };

  const double = () => {
    if (bet > money) {
      alert("You don't have enough money");
      return;
    }
    setMoney((prevMoney) => prevMoney - bet);
    setBet((prevBet) => prevBet * 2);
    setHasDoubled(true);
    dealCards("player", 1);
    setTimeout(() => setPlaying(false), 1000);
  };

  const makeBet = (value: number) => {
    setBet((prevBet) => prevBet + value);
  };

  const resetBet = () => {
    setGameStarted(false);
    clearRound();
    setBet(0);
  };

  // TESTS

  // const forceDeal = () => {
  //   setNextRound(false);
  //   setRoundStarted(false);
  //   clearRound();

  //   const cardOnePlayer = new Card("♠️", "A", 1) as CardI;
  //   const cardTwoPlayer = new Card("♥️", "K", 10) as CardI;
  //   const cardOneDealer = new Card("♥️", "2", 10) as CardI;
  //   const cardTwoDealer = new Card("♥️", "3", 10) as CardI;

  //   dealCard("player", cardOnePlayer);
  //   setTimeout(() => dealCard("dealer", cardOneDealer), 1000);
  //   setTimeout(() => dealCard("player", cardTwoPlayer), 2000);
  //   setTimeout(() => dealCard("dealer", cardTwoDealer), 3000);
  //   setTimeout(() => setRoundStarted(true), 3500);
  //   setGameStarted(true);
  //   setPlaying(true);
  // };

  // const dealCard = (player: string, card: CardI): void => {
  //   // Start dealing animation
  //   if (player === "player") {
  //     setIsDealing(true);
  //   } else {
  //     setIsDealingDealer(true);
  //   }

  //   setCardsBeingGiven([card]);

  //   // Add cards to player or dealer hand after dealing animation
  //   setTimeout(() => {
  //     if (player === "player") {
  //       setHand((prevHand) => [...prevHand, card]);
  //       setIsDealing(false);
  //     } else {
  //       setDealerHand((prevHand) => [...prevHand, card]);
  //       setIsDealingDealer(false);
  //     }
  //     setCardsBeingGiven([]);
  //   }, 600);
  // };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center gap-4 bg-[#1b86d3] pt-10 text-white">
      <div className="relative flex w-full flex-col items-center justify-center gap-10">

        {/* Dealer Hand */}
        <div className="z-[5] flex flex-col items-center gap-4">
          <h1 className="text-[1.5rem] font-bold">DEALER</h1>
          <div
            className="flex h-24 justify-center"
            style={{
              transform: `translateX(${(dealerHand.length - 1) * 10}px)`,
            }}
          >
            {dealerHand.map((card, index) => {
              if (index === 0 || !playing) {
                return (
                  <div key={index}>
                    <CardUI card={card} index={index} />
                  </div>
                );
              }
              return (
                <div
                  key={card.id}
                  className="pattern-zigzag flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4"
                  style={{ transform: `translate(-${index * 20}px)` }}
                ></div>
              );
            })}
          </div>
          {gameStarted && <div>{getDealerHandSumToDisplay(dealerHand)}</div>}
        </div>

        {/* Deck in middle */}
        <div className="relative z-[10] flex h-[6rem] w-[20.3rem]">
          {
            deck &&
            <DeckComponent deckSize={deck.deck.length} />
          }

          {/* Cards being given */}
          <div className="asbolute left-0 top-0 z-[10] ml-4 flex">
            {cardsBeingGiven?.map((card, index) => {
              if (true) {
                return (
                  <div
                    key={card.id}
                    className={`${isDealing ? "dealing-player" : "dealing-dealer"} pattern-zigzag z-[10] flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4`}
                    style={{ transform: `translate(-${index * 55}px)` }}
                  ></div>
                );
              }
            })}
          </div>

          {/* Bet */}
          <div className="absolute left-1/2 top-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center gap-2 rounded-md px-4">
            <span>{bet} $</span>
            <Image
              src="/content/images/chips.png"
              alt="chips"
              width={20}
              height={20}
              className="w-10"
            />
          </div>
        </div>

        {/* Player Hand */}
        <div className="z-[5] flex flex-col items-center gap-4">
          <div
            className={`flex min-h-24 justify-center`}
            style={{
              transform: `translateX(${(hand.length - 1) * 10}px)`,
            }}
          >
            {hand.map((card, index) => (
              <div key={index}>
                <CardUI card={card} index={index} />
              </div>
            ))}
          </div>
          {gameStarted && <div>{getHandSumToDisplay(hand)}</div>}
        </div>
      </div>

      {/* Options */}
      <div className="mt-6 flex justify-center">
        {!gameStarted && (
          <GameOptions makeBet={makeBet} play={play} setBet={setBet} />
        )}
        {nextRound && gameStarted && (
          <RoundOptions goToNextRound={goToNextRound} resetBet={resetBet} />
        )}
        {playing && !hasDoubled && roundStarted && (
          <GameButtons
            stand={stand}
            dealCards={dealCards}
            split={split}
            double={double}
            hand={hand}
          />
        )}
      </div>

      {/* Money */}
      <div className="rounded-md border border-blue-800 px-4 py-2">
        <span>My Total: &ensp;{money}$</span>
      </div>

      {/* For tests */}

      {/* <Button
        color="#f2c72c"
        onClick={forceDeal}
        style="mt-4 px-4 py-2 border border-white rounded text-white"
      >
        Force Blackjack Test
      </Button> */}
    </div>
  );
};

export default Game;
