"use client";

import React, { useState, useEffect } from "react";
import Button from "~/components/Button";
import { Deck } from "~/components/objects/Deck";
import { CardI } from "~/components/objects/Card";

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Deck>(() => new Deck(6));
  const [hand, setHand] = useState<CardI[]>([]);
  const [dealerHand, setDealerHand] = useState<CardI[]>([]);
  const [deckNeedReset, setDeckNeedReset] = useState<boolean>(false);
  const [nextRound, setNextRound] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Check if deck needs to be reset
  useEffect(() => {
    if (deck.deck.length <= 10) {
      setDeckNeedReset(true);
    }
  }, [deck]);

  // Check if player busts or gets blackjack
  useEffect(() => {
    if (!gameStarted) return;
    const sum = getHandSum(hand);
    if (sum > 21) {
      alert("Bust!");
      setNextRound(true);
      setPlaying(false);
    } else if (sum === 21 && hand.length === 2) {
      alert("Blackjack!");
      setNextRound(true);
      setPlaying(false);
    }
  }, [hand]);

  // Check if dealer busts, wins, or pushes
  // If dealer has less than 17, deal another card
  useEffect(() => {
    if (!gameStarted || playing) return;
    checkWinner();
  }, [dealerHand]);

  const dealCards = (player: string, count: number): void => {
    if (deck.deck.length + 10 < count) {
      setDeckNeedReset(true);
      return;
    }

    const newCards: CardI[] = [];
    for (let i = 0; i < count; i++) {
      newCards.push(deck.dealCard());
    }

    if (player === "player") {
      setHand((prevHand) => [...prevHand, ...newCards]);
      setPlaying(true);
    } else {
      setDealerHand((prevDealerHand) => [...prevDealerHand, ...newCards]);
    }
  };

  const getHandSum = (hand: CardI[]): string => {
    let sum = hand.reduce((acc, card) => acc + card.value, 0);
    let numAces = hand.filter((card) => card.rank === "A").length;
  
    // This will store the potential lower sum if Aces are reduced to 1
    let minSum = sum;
  
    while (minSum > 21 && numAces > 0) {
      minSum -= 10;
      numAces--;
    }
  
    // If both sums are the same, just return one value
    if (sum === minSum) {
      return `${sum}/${sum}`;
    } else {
      return `${minSum}/${sum}`;
    }
  };
  
  const getDealerHandSum = (hand: CardI[]): number => {
    if (playing) return hand[0]!.value;
    return hand.reduce((acc, card) => acc + card.value, 0);
  };

  const clearRound = () => {
    setHand([]);
    setDealerHand([]);
  };

  const reset = () => {
    const newDeck = new Deck(6);
    setDeck(newDeck);
    clearRound();
    setDeckNeedReset(false);
    dealCards("player", 2);
    dealCards("dealer", 2);
    setGameStarted(true);
  };

  const checkWinner = () => {
    const dealerSum = getDealerHandSum(dealerHand);
    const sum = getHandSum(hand);
    const minSum = parseInt(sum.split("/")[0]);
    const maxSum = parseInt(sum.split("/")[1]);
    if (dealerSum > 21) {
      alert("Dealer Busts! You win!");
      return ;
    }
    if (dealerSum < 17) {
      dealCards("dealer", 1);
      return ;
    }
    if (dealerSum === minSum) {
      alert("Push!");
    } else if (dealerSum > minSum) {
      alert("Dealer Wins!");
    } else if (sum > dealerSum) {
      alert("You win!");
    } else if (sum < dealerSum) {
      alert("Dealer Wins!");
    } 
    setNextRound(true);
  };

  const stand = () => {
    setPlaying(false);
    checkWinner();
  };

  const goToNextRound = () => {
    setNextRound(false);
    clearRound();
    dealCards("player", 2);
    dealCards("dealer", 2);
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center gap-4 bg-[#1b86d3] pt-10 text-white">
      <div className="flex w-full flex-col items-center justify-center gap-20">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[1.5rem] font-bold">DEALER</h1>
          <div
            className="flex justify-center"
            style={{
              transform: `translateX(${(dealerHand.length - 1) * 10}px)`,
            }}
          >
            {dealerHand.map((card, index) => {
              if (index === 0) {
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
              if (!playing) {
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
              } else {
                return (
                  <div
                    key={card.id}
                    className="pattern-zigzag flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4"
                    style={{ transform: `translate(-${index * 20}px)` }}
                  ></div>
                );
              }
            })}
          </div>
          <div>{getDealerHandSum(dealerHand)}</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex justify-center"
            style={{
              transform: `translateX(${(hand.length - 1) * 10}px)`,
            }}
          >
            {hand.map((card, index) => (
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
            ))}
          </div>
          <div>{getHandSum(hand)}</div>
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
        {playing && (
          <div className="flex justify-center gap-4">
            <Button
              color="#f22c3d"
              onClick={stand}
              style="mt-4 px-4 py-2 border border-white rounded text-white"
            >
              Stand
            </Button>
            <Button
              color="var(--primary)"
              onClick={() => dealCards("player", 1)}
              style="mt-4 px-4 py-2 border border-white rounded text-white"
            >
              Hit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
