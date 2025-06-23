import type { Game } from "./Game.types";

export interface Room {
  id: string;
  name: string;
  numberOfPlayers: number;
  gameId?: Game["id"];
  connectedPlayersIds: string[];
  leaderPlayerId: string;
  started: boolean;
  maxNumberOfPlayers: number;
}
