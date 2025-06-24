import { useQuery } from "@tanstack/react-query";
import type { Game } from "../types/Game.types";
import { api } from "../services/api";

export const useGameQuery = (gameId?: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => {
      if (!gameId) {
        return null;
      }

      return api.get<Game>(`/game/${gameId}`).then((response) => response.data);
    },
  });
};
