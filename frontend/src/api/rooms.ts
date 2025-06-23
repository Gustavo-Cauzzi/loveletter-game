import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Room } from "../types/Room.types";

export const useRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get<Room[]>("/room"),
  });
};
