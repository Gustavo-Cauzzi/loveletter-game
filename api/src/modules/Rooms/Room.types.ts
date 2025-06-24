import { Game } from '@modules/Game/Game.types';

export interface Room {
  id: string;
  name: string;
  gameId?: Game['id'];
  connectedPlayersIds: string[];
  leaderPlayerId: string;
  started: boolean;
  maxNumberOfPlayers: number;
}
