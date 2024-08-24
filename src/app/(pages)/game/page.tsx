"use client";

import React, { useState, useEffect } from "react";
import Button from "~/components/ui/Button";
import { Deck } from "~/components/objects/Deck";
import { CardI } from "~/components/objects/Card";
import "~/styles/game.css";
import DeckComponent from "~/components/ui/Deck";
import { set } from "zod";
import { get } from "http";

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Deck>(() => new Deck(6));
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

  // Check if deck needs to be reset
  useEffect(() => {
    if (deck.deck.length <= 10) {
      setDeckNeedReset(true);
    }
  }, [deck]);

  // Check if player busts or gets blackjack, if so end round
  useEffect(() => {
    if (!gameStarted || !playing) return;
    const sum = getHandSum(hand);
    if (sum > 21) {
      alert("Bust! Dealer wins!");
      setNextRound(true);
      setPlaying(false);
    } else if (sum === 21 && hand.length === 2) {
      alert("Blackjack!");
      setNextRound(true);
      setPlaying(false);
    } else if (sum === 21) {
      setPlaying(false);
    }
  }, [hand]);

  useEffect(() => {
    if (playing || nextRound || !gameStarted) return;
    if (getDealerHandSum(dealerHand) < 17) {
      setTimeout(() => dealCards("dealer", 1), 800);
    } else {
      checkWinner();
    }
  }, [dealerHand, playing, nextRound, gameStarted]);

  // Deal cards to player or dealer
  const dealCards = (player: string, count: number): void => {
    // Check if deck needs to be reset
    if (deck.deck.length - count < 15) {
      setDeckNeedReset(true);
      return;
    }

    // Start dealing animation
    if (player === "player") {
      setIsDealing(true);
    } else {
      setIsDealingDealer(true);
    }

    // Get cards from deck
    const newCards: CardI[] = [];
    for (let i = 0; i < count; i++) {
      newCards.push(deck.dealCard());
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

  // Check winner
  const checkWinner = () => {
    const dealerSum = getDealerHandSum(dealerHand);
    const sum = getHandSum(hand);
    if (nextRound) return;
    if (dealerSum > 21) {
      alert("Dealer Busts! You win!");
    } else if (dealerSum === sum) {
      alert("Push!");
    } else if (dealerSum > sum) {
      alert("Dealer Wins!");
    } else if (sum > dealerSum) {
      alert("You win!");
    }
    setNextRound(true);
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
      if (!playing) return `${sum + 10}`;
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

  // Rounds

  const clearRound = () => {
    setHand([]);
    setDealerHand([]);
    setHasDoubled(false);
  };

  const goToNextRound = () => {
    setNextRound(false);
    clearRound();
    setIsDealing(true);
    setIsDealingDealer(true);
    dealCards("player", 2);
    setTimeout(() => dealCards("dealer", 2), 1000);
    setGameStarted(true);
    setPlaying(true);
  };

  const reset = () => {
    const newDeck = new Deck(6);
    setDeck(newDeck);
    setDeckNeedReset(false);
    goToNextRound();
  };

  // Actions

  const stand = () => {
    setPlaying(false);
  };

  const split = () => {
    alert("Splitting not implemented yet");
  };

  const double = () => {
    setHasDoubled(true);
    dealCards("player", 1);
    setTimeout(() => setPlaying(false), 1000);
  };

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
                  <div
                    key={card.id}
                    className="flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-white font-bold text-black"
                    style={{ transform: `translate(-${index * 20}px)` }}
                  >
                    <div>{card.rank}</div>
                    <div
                      className={`${card.suit === "♦️" || card.suit === "♥️" ? "text-red-500" : ""}`}
                    >
                      {card.suit}
                    </div>
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
          <div>
            {getDealerHandSum(dealerHand) === 1
              ? `${getDealerHandSum(dealerHand)} / 11`
              : getDealerHandSum(dealerHand)}
          </div>
        </div>
        {/* Deck in middle */}
        <div className="relative z-[10] h-[6rem] w-[20.3rem]">
          <DeckComponent deckSize={deck.deck.length} />
          {/* Crads being given */}
          <div className="asbolute left-0 top-0 z-[10] ml-4 flex">
            {cardsBeingGiven &&
              cardsBeingGiven.map((card, index) => {
                if (isDealingDealer && index === 1) {
                  return (
                    <div
                      key={card.id}
                      className={`${isDealing ? "dealing-player" : "dealing-dealer"} pattern-zigzag flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4`}
                      style={{ transform: `translate(-${index * 55}px)` }}
                    ></div>
                  );
                }
                return (
                  <div
                    key={card.id}
                    className={`${isDealing ? "dealing-player" : "dealing-dealer"} z-[5] flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-white font-bold text-black`}
                    style={{ transform: `translate(-${index * 55}px)` }}
                  >
                    <div>{card.rank}</div>
                    <div
                      className={`${card.suit === "♦️" || card.suit === "♥️" ? "text-red-500" : ""}`}
                    >
                      {card.suit}
                    </div>
                  </div>
                );
              })}
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
              <div
                key={card.id}
                style={{ transform: `translate(-${index * 20}px)` }}
                className={`flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-white font-bold text-black`}
              >
                <div>{card.rank}</div>
                <div
                  className={`${card.suit === "♦️" || card.suit === "♥️" ? "text-red-500" : ""}`}
                >
                  {card.suit}
                </div>
              </div>
            ))}
          </div>
          <div>{getHandSumToDisplay(hand)}</div>
        </div>
      </div>
      <div className="flex justify-center">
        {!gameStarted && (
          <Button
            color="var(--primary)"
            onClick={reset}
            style="mt-4 px-4 py-2 border border-white rounded text-white"
          >
            Play
          </Button>
        )}
        {deckNeedReset && (
          <Button
            color="#aaa"
            onClick={reset}
            style="mt-4 px-4 py-2 border border-white rounded text-white"
          >
            Reset Deck
          </Button>
        )}
        {nextRound && (
          <Button
            color=""
            onClick={goToNextRound}
            style="mt-4 px-4 py-2 border border-white rounded text-white"
          >
            Next Round
          </Button>
        )}
        {playing && !isDealing && !isDealingDealer && !hasDoubled && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button
              color="#f22c3d"
              onClick={stand}
              style="px-4 py-2 border border-white rounded text-white"
            >
              Stand
            </Button>
            <Button
              color="var(--primary)"
              onClick={() => dealCards("player", 1)}
              style="px-4 py-2 border border-white rounded text-white"
            >
              Hit
            </Button>
            {hand.length === 2 && hand[0]!.value === hand[1]!.value && (
              <Button
                color="#5662f6"
                onClick={split}
                style="px-4 py-2 border border-white rounded text-white"
              >
                Split
              </Button>
            )}
            {
              hand.length === 2 && !hasDoubled && (
                <Button
                  color="#f2c72c"
                  onClick={double}
                  style="px-4 py-2 border border-white rounded text-white"
                >
                  Double
                </Button>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
