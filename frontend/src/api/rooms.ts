import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Room } from "../types/Room.types";

export const useRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get<Room[]>("/room"),
  });
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => api.post<Room>("/room", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
