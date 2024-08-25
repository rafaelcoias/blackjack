import React from "react";
import { CardI } from "~/components/objects/Card";
import Button from "~/components/ui/Button";

interface GameButtonProps {
  stand: () => void;
  dealCards: (player: string, count: number) => void;
  split: () => void;
  double: () => void;
  hand: CardI[];
}

export default function GameButtons({
  stand,
  dealCards,
  split,
  double,
  hand,
}: GameButtonProps) {
  return (
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
      {hand.length === 2 && (
        <Button
          color="#f2c72c"
          onClick={double}
          style="px-4 py-2 border border-white rounded text-white"
        >
          Double
        </Button>
      )}
    </div>
  );
}
