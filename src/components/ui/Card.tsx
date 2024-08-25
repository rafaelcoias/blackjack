"use client";

import React from "react";
import { CardI } from "../objects/Card";
import { get } from "http";

export default function Card({ card, index }: { card: CardI; index: number }) {
  const getIcon = () => {
    if (card?.rank === "J") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-[.9rem] absolute top-0 right-1">👑</div>
          <div className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}>{card?.suit}</div>
        </div>
      );
    }
    if (card?.rank === "Q") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-[.9rem] absolute top-0 right-1">👑</div>
          <div className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}>{card?.suit}</div>
        </div>
      );
    }
    if (card?.rank === "K") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-[.9rem] absolute top-0 right-1">👑</div>
          <div className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}>{card?.suit}</div>
        </div>
      );
    }
    if (card?.rank === "A") {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className={`text-[1.2rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}>{card?.suit}</div>
        </div>
      );
    }
  }

  return (
    <div
      style={{ transform: `translate(-${index * 20}px)` }}
      className={`relative flex h-24 w-16 flex-col items-center justify-center rounded-lg border-[2px] border-black bg-white pt-4 pb-5 font-bold text-black`}
    >
      <div className="absolute left-1 top-0 text-[.9rem]">{card?.rank}</div>
      <div className="flex h-full items-center justify-center">
        {card?.rank !== "J" &&
        card?.rank !== "Q" &&
        card?.rank !== "K" &&
        card?.rank !== "A" ? (
          <div className={`flex h-full items-center gap-[6px] text-[.7rem] ${card?.suit === "♦️" || card?.suit === "♥️" ? "text-red-500" : ""}`}>
            <div
              className={`flex flex-col justify-between h-full leading-[16px]`}
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
              className={`flex flex-col justify-evenly h-full leading-[16px]`}
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
              className={`flex flex-col justify-between h-full leading-[16px]`}
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
