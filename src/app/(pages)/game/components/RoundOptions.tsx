import React from "react";
import Button from "~/components/ui/Button";

export default function RoundOptions({goToNextRound, resetBet}: {goToNextRound: () => void, resetBet: () => void}) {
  return (
    <div className="flex gap-4">
      <Button
        color="var(--primary)"
        onClick={goToNextRound}
        style="px-4 py-2 border border-white rounded text-white"
      >
        Next Round
      </Button>
      <Button
        onClick={resetBet}
        style="px-4 py-2 border border-white rounded text-white bg-yellow-500"
      >
        Change Bet
      </Button>
    </div>
  );
}
