export interface CardI {
  suit: string;
  rank: string;
  id: string;
  value: number;
}

export class Card {
  suit: string;
  rank: string;
  id: string;
  value: number;

  constructor(suit: string, rank: string, deckIndex: number) {
    this.suit = suit;
    this.rank = rank;
    this.id = `${rank}-${suit}-${deckIndex}`;
    this.value = this.getValue();
  }

  getValue(): number {
    if (["J", "Q", "K"].includes(this.rank)) {
      return 10;
    } else if (this.rank === "A") {
      return 1;
    }
    return parseInt(this.rank);
  }
}
