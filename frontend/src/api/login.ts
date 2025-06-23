import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export const useFakeLogin = () => {
  return useMutation({
    mutationFn: async (username: string) => {
      const response = await api.post<{ token: string; id: string }>(
        "/user/fakeLogin",
        {
          username,
        }
      );

      return response.data;
    },
  });
};
