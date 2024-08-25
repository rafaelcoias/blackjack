import React from "react";
import "~/styles/game.css";

const DeckComponent: React.FC<{ deckSize: number }> = ({ deckSize }) => {
  const maxVisibleCards = 5; 

  return (
    <div className="flex z-[5] absolute top-0 left-0">
      {Array.from({ length: Math.min(deckSize, maxVisibleCards) }).map((_, index) => (
        <div
          key={index}
          className="pattern-zigzag flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4"
          style={{ transform: `translateX(-${index * 62}px)` }}
        />
      ))}
      {/* <div className="absolute left-6 bottom-[-1.4rem] text-[.8rem]">{deckSize}</div> */}
    </div>
  );
};

export default DeckComponent;
