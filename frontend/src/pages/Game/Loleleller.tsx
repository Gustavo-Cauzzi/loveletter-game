import { Card } from "../../components/Loleleller/Card";
import type { Game } from "../../types/Game.types";

interface LolelellerProps {
  game: Game;
}

export function Loleleller({ game }: LolelellerProps) {
  console.log("[Czz] game: ", game);
  return (
    <div>
      <h1>Loleleller</h1>
      <Card card={game.yourPlayerData.heldCards[0]} />
    </div>
  );
}
