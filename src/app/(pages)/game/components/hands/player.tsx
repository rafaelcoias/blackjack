import React from "react";
import { CardI } from "~/components/objects/Card";
import { CardUI } from "~/components/ui/Card";

export default function PlayerHand({
  hand,
  hand2,
  gameStarted,
  playing,
  handPlaying,
}: {
  hand: CardI[];
  hand2: CardI[];
  gameStarted: boolean;
  playing: boolean;
  handPlaying: number;
}) {
  const getHandSumToDisplay = (hand: CardI[]): string => {
    const sum = hand.reduce((acc, card) => acc + card.value, 0);
    if (hand.some((card) => card.rank === "A") && sum + 10 <= 21) {
      if (!playing || sum + 10 === 21) return `${sum + 10}`;
      return `${sum} / ${sum + 10}`;
    }
    return `${sum}`;
  };

  return (
    <div className="z-[5] flex gap-4">
      <div className={`flex flex-col items-center gap-4 ${handPlaying === 2 ? "brightness-75" : ""}`}>
        <div
          className={`flex min-h-24 justify-center`}
          style={{
            transform: `translateX(${(hand.length - 1) * 10}px)`,
          }}
        >
          {hand.map((card, index) => (
            <div key={index}>
              <CardUI card={card} index={index} translateX={20} />
            </div>
          ))}
        </div>
        {gameStarted && <div>{getHandSumToDisplay(hand)}</div>}
      </div>
      {hand2.length > 0 && (
        <div className={`flex flex-col items-center gap-4 ${handPlaying === 1 ? "brightness-75" : ""}`}>
          <div
            className={`flex min-h-24 justify-center`}
            style={{
              transform: `translateX(${(hand2.length - 1) * 10}px)`,
            }}
          >
            {hand2.map((card, index) => (
              <div key={index}>
                <CardUI card={card} index={index} translateX={20} />
              </div>
            ))}
          </div>
          {gameStarted && <div>{getHandSumToDisplay(hand2)}</div>}
        </div>
      )}
    </div>
  );
}
