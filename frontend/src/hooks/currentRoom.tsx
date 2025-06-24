import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useCurrentRoomQuery } from "../api/rooms";
import { useAuth } from "./auth";
import type { Room } from "../types/Room.types";
import { socketService } from "../services/socket-io";
import { useQueryClient } from "@tanstack/react-query";

interface CurrentRoomContextType {
  currentRoom: Room | undefined;
  isLoading: boolean;
}

const CurrentRoomContext = createContext<CurrentRoomContextType | undefined>(
  undefined
);

interface CurrentRoomProviderProps {
  children: ReactNode;
}

export const CurrentRoomProvider: React.FC<CurrentRoomProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { data: currentRoom, isPending } = useCurrentRoomQuery({
    enabled: !!isAuthenticated,
  });

  useEffect(() => {
    socketService.on("/rooms/current/update", () => {
      queryClient.invalidateQueries({ queryKey: ["currentRoom"] });
    });

    return () => {
      socketService.off("/rooms/current/update");
    };
  }, []);

  const value: CurrentRoomContextType = {
    currentRoom,
    isLoading: isPending,
  };

  return (
    <CurrentRoomContext.Provider value={value}>
      {children}
    </CurrentRoomContext.Provider>
  );
};

// Custom hook to use the current room context
export const useCurrentRoom = (): CurrentRoomContextType => {
  const context = useContext(CurrentRoomContext);

  if (context === undefined) {
    throw new Error("useCurrentRoom must be used within a CurrentRoomProvider");
  }

  return context;
};

// Export the Room type for use in other components
export type { Room };
