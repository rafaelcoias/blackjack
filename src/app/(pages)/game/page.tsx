"use client";

import React, { useState, useEffect } from "react";
import Button from "~/components/ui/Button";
import { Deck } from "~/components/objects/Deck";
import { CardI, Card } from "~/components/objects/Card";
import "~/styles/game.css";
import GameButtons from "./components/actions/GameActions";
import GameOptions from "./components/actions/StartOptions";
import RoundOptions from "./components/actions/RoundOptions";
import PlayerHand from "./components/hands/player";
import DeckAndBet from "./components/hands/deckAndBet";
import DealerHand from "./components/hands/dealer";
import { set } from "zod";

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Deck>();

  const [hand, setHand] = useState<CardI[]>([]);
  const [hand2, setHand2] = useState<CardI[]>([]);
  const [dealerHand, setDealerHand] = useState<CardI[]>([]);
  const [cardsBeingGiven, setCardsBeingGiven] = useState<CardI[]>([]);

  const [handPlaying, setHandPlaying] = useState<number>(1);
  const [bet, setBet] = useState<number>(0);
  const [inicialBet, setInicialBet] = useState<number>(0);
  const [money, setMoney] = useState<GLfloat>(-1);

  const [deckNeedReset, setDeckNeedReset] = useState<boolean>(false);
  const [nextRound, setNextRound] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [hasDoubled, setHasDoubled] = useState<boolean>(false);
  const [hasSplitted, setHasSplitted] = useState<boolean>(false);
  const [roundStarted, setRoundStarted] = useState<boolean>(false);
  const [isFlippingCard, setIsFlippingCard] = useState<boolean>(false);
  const [checkSplittedHand, setCheckSplittedHand] = useState<boolean>(false);

  // =========================== USE EFFECTS =====================================

  // Set deck and money on first render
  useEffect(() => {
    const newDeck = new Deck(6);
    setDeck(newDeck);
    if (localStorage.getItem("money")) {
      setMoney(parseFloat(localStorage.getItem("money")!));
    } else {
      setMoney(500);
    }
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
      if (hasSplitted && handPlaying === 1) {
        setHandPlaying(2);
        return;
      }
      stand(false);
      setTimeout(() => {
        alert("Bust! Dealer wins!");
      }, 500);
    } else if (sum === 21) {
      stand(true);
    }
  }, [hand, playing, roundStarted]);

  // Check if player second hand busts, if so stops playing
  useEffect(() => {
    if (!gameStarted || !playing || !roundStarted || !hasSplitted || handPlaying === 1) return;
    const sum = getHandSum(hand2);
    if (sum > 21 || sum === 21) {
      stand(true);
    }
  }, [hand2, playing, roundStarted, hasSplitted]);

  // Check if dealer needs to draw more cards
  // or check winner when dealer has more than 17
  useEffect(() => {
    if (playing || nextRound || !gameStarted) return;
    if (getDealerHandSum(dealerHand) < 17) {
      setTimeout(() => dealCards("dealer", 1), 800);
      return;
    }
    checkWinner();
  }, [dealerHand, playing, nextRound, gameStarted]);

  // Check second hand when first hand is done
  useEffect(() => {
    if (!checkSplittedHand || nextRound) return;
    checkWinner();
  }, [checkSplittedHand, hasSplitted]);

  // When round starts check for blackjacks
  useEffect(() => {
    if (!roundStarted || !gameStarted) return;
    if (checkBlackjack(hand) && dealerHand.length === 2) {
      setTimeout(() => {
        if (checkBlackjack(dealerHand)) {
          stand(false);
          setTimeout(() => alert("Push!"), 500);
          setMoney((prevMoney) => prevMoney + inicialBet);
        } else {
          stand(false);
          setTimeout(() => alert("Blackjack!"), 500);
          setMoney((prevMoney) => prevMoney + inicialBet * 2.5);
        }
      }, 300);
      return;
    }
    if (checkBlackjack(dealerHand)) {
      stand(false);
      setTimeout(() => {
        alert("You lose!");
      }, 500);
    }
  }, [roundStarted, gameStarted, hand, dealerHand]);

  // Save money to local storage when page unloads
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", function (event) {
        localStorage.setItem("money", money.toString());
      });
    }

    // Cleanup when the component unmounts
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", function (event) {
          localStorage.setItem("money", money.toString());
        });
      }
    };
  }, [money]);

  // =============================== FUNCTIONS ===================================

  // Deal cards to player or dealer
  const dealCards = (player: string, count: number, hand2?: boolean): void => {
    // Check if deck needs to be reset

    // Start dealing animation
    if (player === "player") {
      setIsDealing(true);
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
        if (hand2) setHand2((prevHand) => [...prevHand, ...newCards]);
        else setHand((prevHand) => [...prevHand, ...newCards]);
        setIsDealing(false);
      } else {
        setDealerHand((prevHand) => [...prevHand, ...newCards]);
      }
      setCardsBeingGiven([]);
    }, 600);
  };

  // Flip dealer card
  const flipDealerCard = () => {
    setIsFlippingCard(true);
    setTimeout(() => {
      setIsFlippingCard(false);
    }, 800);
  };

  // Checks

  const checkWinner = () => {
    const dealerSum = getDealerHandSum(dealerHand);
    let sum = 0;
    if (handPlaying === 1) sum = getHandSum(hand);
    if (handPlaying === 2) sum = getHandSum(hand2);

    let winnerMessage = "";
    if (nextRound) return;
    if (sum > 21) {
      winnerMessage = "Bust! You lose!";
    } else if (dealerSum > 21 || (sum > dealerSum && sum <= 21)) {
      if (handPlaying === 1 && hand.every((card) => card.rank === "7") || handPlaying === 2 && hand2.every((card) => card.rank === "7")) {
        winnerMessage = "Triple Seven, x3 Money!";
        setMoney((prevMoney) => prevMoney + (inicialBet * 3));
      } else {
        winnerMessage = "You win!";
        if (hasDoubled) setMoney((prevMoney) => prevMoney + (inicialBet * 4));
        else setMoney((prevMoney) => prevMoney + (inicialBet * 2));
      }
    } else if (dealerSum === sum) {
      winnerMessage = "Push!";
      if (hasDoubled) setMoney((prevMoney) => prevMoney + (inicialBet * 2));
      else setMoney((prevMoney) => prevMoney + inicialBet);
    } else if (dealerSum > sum) {
      winnerMessage = "Dealer wins!";
    }
    setTimeout(() => alert(winnerMessage), 500);
    if (!hasSplitted || checkSplittedHand) {
      setCheckSplittedHand(false);
      setNextRound(true);
    } else {
      setTimeout(() => {
        setHandPlaying(1);
        setCheckSplittedHand(true);
      }, 500);
    }
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

  const getDealerHandSum = (hand: CardI[]): number => {
    if (playing) return hand.length > 0 ? hand[0]!.value : 0;
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21)
      return sum + 10;
    return sum;
  };

  // Rounds

  const clearRound = () => {
    setHand([]);
    setHand2([]);
    setHandPlaying(1);
    setDealerHand([]);
    setHasSplitted(false);
    setHasDoubled(false);
    setBet(0);
  };

  const goToNextRound = () => {
    if (inicialBet > money) {
      alert("You don't have enough money");
      return;
    }
    setNextRound(false);
    setRoundStarted(false);
    clearRound();
    setBet(inicialBet);
    setMoney((prevMoney) => prevMoney - inicialBet);
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
    if (inicialBet === 0) {
      alert("Please place a bet.");
      return;
    }
    if (inicialBet > money) {
      alert("You don't have enough money.");
      return;
    }
    reset();
  };

  const hit = () => {
    if (handPlaying === 1) {
      dealCards("player", 1);
    } else {
      dealCards("player", 1, true);
    }
  };

  const stand = (clicked: boolean) => {
    if (handPlaying === 1 && hasSplitted) {
      setHandPlaying(2);
      return;
    }
    if (!clicked) setNextRound(true);
    setPlaying(false);
    flipDealerCard();
  };

  const split = () => {
    if (inicialBet > money) {
      alert("You don't have enough money to double.");
      return;
    }
    setMoney((prevMoney) => prevMoney - inicialBet);
    setBet((prevBet) => prevBet + inicialBet);
    setHasSplitted(true);
    setHand([hand[0]!]);
    setHand2([hand[1]!]);
    dealCards("player", 1);
    setTimeout(() => dealCards("player", 1, true), 1000);
  };

  const double = () => {
    if (inicialBet > money) {
      alert("You don't have enough money to double.");
      return;
    }
    setMoney((prevMoney) => prevMoney - inicialBet);
    setBet((prevBet) => prevBet + inicialBet);

    if (hasSplitted) {
      if (handPlaying === 1) {
        dealCards("player", 1);
        setTimeout(() => setHandPlaying(2), 1000);
        return;
      }
      dealCards("player", 1, true);
      setTimeout(() => setPlaying(false), 1000);
      return;
    }
    setHasDoubled(true);
    dealCards("player", 1);
    setTimeout(() => setPlaying(false), 1000);
  };

  const makeBet = (value: number) => {
    setInicialBet((prevBet) => prevBet + value);
  };

  const resetBet = () => {
    setGameStarted(false);
    setInicialBet(0);
    clearRound();
  };

  // TESTS

  // const forceDeal = () => {
  //   setNextRound(false);
  //   setRoundStarted(false);
  //   clearRound();
  //   setBet(inicialBet);
  //   setMoney((prevMoney) => prevMoney - inicialBet);

  //   const cardOnePlayer = new Card("♠️", "A", 1) as CardI;
  //   const cardTwoPlayer = new Card("♥️", "J", 2) as CardI;
  //   const cardOneDealer = new Card("♥️", "2", 3) as CardI;
  //   const cardTwoDealer = new Card("♠️", "2", 4) as CardI;

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
  //   }

  //   setCardsBeingGiven([card]);

  //   // Add cards to player or dealer hand after dealing animation
  //   setTimeout(() => {
  //     if (player === "player") {
  //       setHand((prevHand) => [...prevHand, card]);
  //       setIsDealing(false);
  //     } else {
  //       setDealerHand((prevHand) => [...prevHand, card]);
  //     }
  //     setCardsBeingGiven([]);
  //   }, 600);
  // };

  // ================================== WINDOW ==================================

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center gap-4 bg-[#1b86d3] pt-10 text-white">
      <div className="relative flex w-full flex-col items-center justify-center gap-10">
        {/* Dealer Hand */}
        <DealerHand
          dealerHand={dealerHand}
          gameStarted={gameStarted}
          playing={playing}
          isFlippingCard={isFlippingCard}
          nextRound={nextRound}
        />

        <DeckAndBet
          deck={deck!}
          cardsBeingGiven={cardsBeingGiven}
          bet={gameStarted ? bet : inicialBet}
          isDealing={isDealing}
          dealerHand={dealerHand}
        />

        <PlayerHand
          hand={hand}
          hand2={hand2}
          gameStarted={gameStarted}
          playing={playing}
          handPlaying={handPlaying}
        />
      </div>

      {/* Options */}
      <div className="mt-6 flex justify-center">
        {!gameStarted && (
          <GameOptions makeBet={makeBet} play={play} setBet={setInicialBet} />
        )}
        {nextRound && gameStarted && (
          <RoundOptions goToNextRound={goToNextRound} resetBet={resetBet} />
        )}
        {playing && !hasDoubled && roundStarted && (
          <GameButtons
            stand={stand}
            hit={hit}
            split={split}
            double={double}
            hand={hand}
            firstMove={
              hand.length === 2 || (hand2.length === 2 && handPlaying === 2)
            }
          />
        )}
      </div>

      {/* Money */}
      <div className="rounded-md border border-blue-800 px-4 py-2">
        <span>My Total: &ensp;{money}$</span>
      </div>

      {/* For tests */}

      {/* <Button
        color=""
        onClick={forceDeal}
        style="mt-4 px-4 py-2 border border-white rounded text-white"
      >
        Force Cards Test
      </Button> */}
    </div>
  );
};

export default Game;
