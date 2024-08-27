import React from "react";
import { CardI } from "~/components/objects/Card";
import Button from "~/components/ui/Button";

interface GameButtonProps {
  stand: (e:boolean) => void;
  hit: () => void;
  split: () => void;
  double: () => void;
  hand: CardI[];
  firstMove: boolean;
}

export default function GameButtons({
  stand,
  hit,
  split,
  double,
  hand,
  firstMove
}: GameButtonProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <Button
        color="#f22c3d"
        onClick={() => stand(true)}
        style="px-4 py-2 border border-white rounded text-white"
      >
        Stand
      </Button>
      <Button
        color="var(--primary)"
        onClick={hit}
        style="px-4 py-2 border border-white rounded text-white"
      >
        Hit
      </Button>
      {firstMove && hand[0]!.value === hand[1]!.value && (
        <Button
          color="#5662f6"
          onClick={split}
          style="px-4 py-2 border border-white rounded text-white"
        >
          Split
        </Button>
      )}
      {firstMove && (
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
