import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../services/api";
import type { Room } from "../types/Room.types";

export const useRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get<Room[]>("/room"),
  });
};

export const useRoomQuery = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () =>
      api.get<Room>(`/room/${roomId}`).then((response) => response.data),
  });
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Room,
    AxiosError<{ message: string; status: "error" }>,
    string
  >({
    mutationFn: (name: string) =>
      api.post<Room>("/room", { name }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["currentRoom"] });
    },
  });
};

export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => api.patch<Room>("/room/join", { roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["currentRoom"] });
    },
  });
};

export const useCurrentRoomQuery = (
  options?: Partial<UseQueryOptions<Room>>
) => {
  return useQuery({
    queryKey: ["currentRoom"],
    queryFn: () =>
      api.get<Room>("/room/current").then((response) => response.data),
    ...options,
  });
};

export const useLeaveRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: Room["id"]) =>
      api.patch<Room>("/room/leave", { roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentRoom"] });
    },
  });
};

export const useStartGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: Room["id"]) =>
      api.patch<Room>("/room/start", { roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentRoom"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
};
