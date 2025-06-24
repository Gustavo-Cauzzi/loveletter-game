import type { User } from "./User.types";
import type { TypedOmit, UUID } from "./utils";

type CardActionDefinition =
  | { type: "princess"; action?: undefined }
  | { type: "countess"; action?: undefined }
  | { type: "king"; action: { targetPlayerId: User["id"] } }
  | {
      type: "chancellor";
      action: { ihavenoclueineedhelpfiguringhowtohandlethisguy: Card["id"] };
    }
  | { type: "prince"; action: { targetPlayerId: User["id"] } }
  | { type: "handmaid"; action?: undefined }
  | { type: "baron"; action: { targetPlayerId: User["id"] } }
  | { type: "priest"; action: { targetPlayerId: User["id"] } }
  | { type: "guard"; action: { guess: CardType; targetPlayerId: User["id"] } }
  | { type: "spy"; action?: undefined };

export type CardType = CardActionDefinition["type"];
export type CardAction = CardActionDefinition["action"];

export type CardActionDefinitionOf<TCardType extends CardType> = Extract<
  CardActionDefinition,
  { type: TCardType }
>;
export type CardActionOf<TCardType extends CardType> = Extract<
  CardActionDefinition,
  { type: TCardType }
>["action"];

export type Card = {
  id: UUID;
  type: CardType;
};

export interface PlayerData {
  discardedCards: Card[];
  playedCards: Card[];
  heldCards: Card[];
  isEliminated: boolean;
  isProtected: boolean;
}

/**
 * Game interface without sensitive information like deck contents and held cards
 */
export interface Game {
  id: UUID;
  started: boolean;
  type: "love-letter";
  winner: User["id"] | undefined;
  currentTurnInfo: {
    playerId: User["id"] | undefined;
    phase: "setup" | "in-progress" | "finished";
    hasDrawnACard: boolean;
    playedCard: Card["id"] | undefined;
  };

  yourPlayerData: PlayerData;

  playersData: Record<
    User["id"],
    TypedOmit<PlayerData, "heldCards"> & {
      heldCardsCount: number;
    }
  >;

  deckCount: number;

  log: Array<{
    playerId: User["id"];
    action: string;
    timestamp: Date;
  }>;
}
