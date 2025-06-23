import { useRoomsQuery } from "../../api/rooms";
import { Button, CircularProgress } from "@mui/material";
import { UserInfo } from "../../components/UserInfo";
import CreateRoomDialog from "./CreatRoomDialog";
import { useEffect, useState } from "react";
import { socketService } from "../../services/socket-io";
import { useQueryClient } from "@tanstack/react-query";

export function Rooms() {
  const queryClient = useQueryClient();
  const { data: rooms, isLoading, error } = useRoomsQuery();
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);

  useEffect(() => {
    socketService.on("room-created", () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    });

    return () => {
      socketService.off("room-created");
    };
  }, []);

  return (
    <main className="flex flex-1 w-full justify-center h-screen p-8">
      <header className="absolute top-0 left-0 right-0 py-4 px-2">
        <div className="flex justify-end">
          <UserInfo />
        </div>
      </header>

      <div className="flex flex-col gap-4 max-w-4xl flex-1 min-w-96">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rooms</h1>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateRoomDialogOpen(true)}
          >
            Create Room
          </Button>
          <CreateRoomDialog
            open={createRoomDialogOpen}
            onClose={() => setCreateRoomDialogOpen(false)}
          />
        </div>

        {error && (
          <div className="flex flex-col gap-1 bg-red-500/10 p-4 rounded-md border border-red-500/20">
            <h2 className="text-red-700 font-bold">Error</h2>
            <p className="text-sm">{error?.message}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-1 justify-center items-center mt-4">
            <CircularProgress />
          </div>
        )}

        {rooms?.data.length === 0 && (
          <div className="flex flex-col gap-1 justify-center items-center mt-4">
            <p className="text-sm">No rooms found</p>
          </div>
        )}

        {rooms?.data.map((room) => (
          <div
            key={room.id}
            className="flex gap-2 p-2 px-4 bg-background-550 rounded-md items-center justify-between"
          >
            <div className="flex flex-1 gap-2 items-center">
              <span className="text-xl font-bold">{room.name}</span>
              <span className="text-sm">
                {room.numberOfPlayers}/{room.maxNumberOfPlayers}
              </span>
            </div>

            <Button variant="contained" color="primary">
              Join
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
