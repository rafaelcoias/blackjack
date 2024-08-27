import React from "react";
import { BackCardUI, CardUI } from "~/components/ui/Card";
import DeckComponent from "~/components/ui/Deck";
import Image from "next/image";
import { CardI } from "~/components/objects/Card";
import { Deck } from "~/components/objects/Deck";

export default function DeckAndBet({ deck, cardsBeingGiven, bet, isDealing, dealerHand }: { deck: Deck; cardsBeingGiven: CardI[]; bet: number; isDealing: boolean, dealerHand: CardI[] }) {
  return (
    <div className="relative z-[10] flex h-[6rem] w-[20.3rem]">
      {deck && <DeckComponent deckSize={deck.deck.length} />}

      {/* Cards being given */}
      <div className="asbolute left-0 top-0 z-[10] ml-4 flex">
        {cardsBeingGiven?.map((card, index) => {
          return (
            <div className={`card post d`}>
              <div
                className={`wrap ${isDealing ? "dealing-player" : !isDealing && dealerHand.length === 1 ? "dealing-dealer-without-spin" : "dealing-dealer"}`}
              >
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

      {/* Bet */}
      <div className="absolute left-1/2 top-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center gap-2 rounded-md border px-4 py-2">
        <span>{bet} $</span>
        <Image
          src="/content/images/chips.png"
          alt="chips"
          width={20}
          height={20}
          className="w-10"
        />
      </div>
    </div>
  );
}
