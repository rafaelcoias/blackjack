import React from "react";
import Button from "../../../../../components/ui/Button";
import Chip from "../../../../../components/ui/Chip";

export default function GameOptions({makeBet, play, setBet}: {makeBet: (bet: number) => void, play: () => void, setBet: (bet: number) => void}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <div className="grid grid-cols-4 gap-x-2 gap-y-8">
        <Chip value={"1"} background="bg-gray-400" setBet={() => makeBet(1)} />
        <Chip value={"5"} background="bg-red-500" setBet={() => makeBet(5)} />
        <Chip
          value={"25"}
          background="bg-blue-600"
          setBet={() => makeBet(25)}
        />
        <Chip
          value={"50"}
          background="bg-green-500"
          setBet={() => makeBet(50)}
        />
        <Chip
          value={"100"}
          background="bg-yellow-300"
          setBet={() => makeBet(100)}
        />
        <Chip
          value={"500"}
          background="bg-orange-500"
          setBet={() => makeBet(500)}
        />
        <Chip
          value={"1k"}
          background="bg-purple-500"
          setBet={() => makeBet(1000)}
        />
        <Chip value={"5k"} background="bg-white" setBet={() => makeBet(5000)} />
      </div>
      <div className="flex gap-4">
        <Button
          color="var(--primary)"
          onClick={play}
          style="px-4 py-2 border border-white rounded text-white"
        >
          Play
        </Button>
        <Button
          onClick={() => setBet(0)}
          style="px-4 py-2 border border-white rounded text-white bg-yellow-500"
        >
          Reset Bet
        </Button>
      </div>
    </div>
  );
}
