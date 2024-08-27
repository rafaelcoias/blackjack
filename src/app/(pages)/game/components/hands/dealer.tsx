import React from "react";
import { CardI } from "~/components/objects/Card";
import { BackCardUI, CardUI } from "~/components/ui/Card";

export default function DealerHand({
  dealerHand,
  gameStarted,
  playing,
  isFlippingCard,
  nextRound,
}: {
  dealerHand: CardI[];
  gameStarted: boolean;
  playing: boolean;
  isFlippingCard: boolean;
  nextRound: boolean;
}) {
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

  return (
    <div className="z-[5] flex flex-col items-center gap-4">
      <h1 className="text-[1.5rem] font-bold">DEALER</h1>
      <div
        className="flex h-24 justify-center"
        style={{
          transform: `translateX(${(dealerHand.length - 1) * 10}px)`,
        }}
      >
        {dealerHand.map((card, index) => {
          if ((index === 0 || !playing) && !isFlippingCard) {
            return (
              <div key={index}>
                <CardUI card={card} index={index} translateX={20} />
              </div>
            );
          }
          return (
            <div
              className="card post d"
              key={index}
              style={{ transform: `translateX(-${index * 20}px)` }}
            >
              <div className={`wrap ${isFlippingCard ? "flipped" : ""}`}>
                <div className="face front">
                  <BackCardUI index={index} />
                </div>
                <div className="face back">
                  <CardUI card={card} index={index} translateX={0} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {gameStarted && <div>{getDealerHandSumToDisplay(dealerHand)}</div>}
    </div>
  );
}
