import { Card, CardI } from "./Card";

export class Deck {
  numDecks: number;
  deck: CardI[];
  discards: CardI[];

  constructor(numDecks = 1) {
    this.numDecks = numDecks;
    this.deck = [];
    this.discards = [];
    this.initializeDeck();
  }

  initializeDeck(): void {
    const suits = ["♦️", "♥️", "♠️", "♣️"];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    this.deck = [];

    for (let i = 0; i < this.numDecks; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          this.deck.push(new Card(suit, rank, i));
        }
      }
    }

    this.shuffle();
  }

  shuffle(): void {
    let currentIndex = this.deck.length,
      randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      let temp:CardI = this.deck[currentIndex] as CardI;
      this.deck[currentIndex] = this.deck[randomIndex] as CardI;
      this.deck[randomIndex] = temp;
    }
  }

  dealCard(): CardI {
    if (this.deck.length === 0) {
      this.resetDeck();
    }

    return this.deck.pop()!;
  }

  resetDeck(): void {
    if (this.discards.length === 0) {
      this.initializeDeck();
    } else {
      this.deck = [...this.discards];
      this.discards = [];
      this.shuffle();
    }
  }

  displayDeck(): void {
    console.log(this.deck);
  }
}
