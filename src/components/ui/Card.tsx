"use client";

import React from "react";
import { CardI } from "../objects/Card";

export function BackCardUI({
  index,
}: {
  index: number;
}) {
  void index;
  return (
    <div
      className="pattern-zigzag flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-[#aaa] font-bold text-black pattern-bg-white pattern-blue-500 pattern-opacity-100 pattern-size-4"
    ></div>
  );
}

export function CardUI({ card, index, translateX }: { card: CardI; index: number, translateX:number }) {
  const getIcon = () => {
    if (card?.rank === "J") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="absolute right-1 top-0 text-[.9rem]">👑</div>
          <div
            className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}
          >
            {card?.suit}
          </div>
        </div>
      );
    }
    if (card?.rank === "Q") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="absolute right-1 top-0 text-[.9rem]">👑</div>
          <div
            className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}
          >
            {card?.suit}
          </div>
        </div>
      );
    }
    if (card?.rank === "K") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="absolute right-1 top-0 text-[.9rem]">👑</div>
          <div
            className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}
          >
            {card?.suit}
          </div>
        </div>
      );
    }
    if (card?.rank === "A") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div
            className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}
          >
            {card?.suit}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={{ transform: `translate(-${index * translateX}px)` }}
      className={`relative flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-white pb-5 pt-4 font-bold text-black`}
    >
      <div className="absolute left-1 top-0 text-[.9rem]">{card?.rank}</div>
      <div className="flex h-full items-center justify-center">
        {card?.rank !== "J" &&
        card?.rank !== "Q" &&
        card?.rank !== "K" &&
        card?.rank !== "A" ? (
          <div
            className={`flex h-full items-center gap-[6px] text-[.7rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}
          >
            <div
              className={`flex h-full flex-col justify-between leading-[16px]`}
            >
              {["4", "5", "6", "7", "8", "9", "10"].includes(
                card?.value?.toString(),
              ) && <span>{card?.suit}</span>}
              {["6", "7", "8", "9", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["9", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["4", "5", "6", "7", "8", "9", "10"].includes(
                card?.value?.toString(),
              ) && <span>{card?.suit}</span>}
            </div>
            <div
              className={`flex h-full flex-col justify-evenly leading-[16px]`}
            >
              {["2", "3", "7", "8", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["A", "3", "5", "9"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["2", "3", "8", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
            </div>
            <div
              className={`flex h-full flex-col justify-between leading-[16px]`}
            >
              {["4", "5", "6", "7", "8", "9", "10"].includes(
                card?.value?.toString(),
              ) && <span>{card?.suit}</span>}
              {["6", "7", "8", "9", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["9", "10"].includes(card?.value?.toString()) && (
                <span>{card?.suit}</span>
              )}
              {["4", "5", "6", "7", "8", "9", "10"].includes(
                card?.value?.toString(),
              ) && <span>{card?.suit}</span>}
            </div>
          </div>
        ) : (
          getIcon()
        )}
      </div>
      <div className="absolute bottom-[-2px] right-1 text-[.9rem]">
        {card?.rank}
      </div>
    </div>
  );
}
