import { useJoinRoomMutation, useRoomsQuery } from "../../api/rooms";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { UserInfo } from "../../components/UserInfo";
import CreateRoomDialog from "./CreatRoomDialog";
import { useEffect, useState } from "react";
import { socketService } from "../../services/socket-io";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ErrorCard } from "../../components/ErrorCard";
import { useCurrentRoom } from "../../hooks/currentRoom";
import { AddOutlined, ArrowForward } from "@mui/icons-material";
import { Main } from "../../components/Main";

export function Rooms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rooms, isLoading, error } = useRoomsQuery();
  const { mutate: joinRoom } = useJoinRoomMutation();
  const { currentRoom } = useCurrentRoom();
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);

  useEffect(() => {
    socketService.on("/rooms/new", () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    });

    return () => {
      socketService.off("/rooms/new");
    };
  }, []);

  return (
    <Main>
      <CreateRoomDialog
        open={createRoomDialogOpen}
        onClose={() => setCreateRoomDialogOpen(false)}
      />

      <header className="absolute top-0 left-0 right-0 py-4 px-2">
        <div className="flex justify-end">
          <UserInfo />
        </div>
      </header>

      <div className="flex flex-col gap-4 max-w-4xl flex-1 min-w-96">
        <div className="flex items-end gap-4">
          <h1 className="text-2xl font-bold">Rooms</h1>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setCreateRoomDialogOpen(true)}
            size="small"
            startIcon={<AddOutlined />}
          >
            Create Room
          </Button>
        </div>

        {error && <ErrorCard title="Error" description={error.message} />}

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
                {room.connectedPlayersIds.length}/{room.maxNumberOfPlayers}
              </span>
              {room.started && <span className="text-sm">(Started)</span>}
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                joinRoom(room.id, {
                  onError: (error) => {
                    toast.error(error.message);
                  },
                  onSuccess: () => {
                    navigate(`/room/${room.id}`);
                  },
                })
              }
              disabled={
                room.connectedPlayersIds.length >= room.maxNumberOfPlayers ||
                !!currentRoom ||
                room.started
              }
            >
              Join
            </Button>
          </div>
        ))}
      </div>

      {currentRoom && (
        <div className="absolute bottom-4 right-4 p-4 max-w-60 w-full bg-background-550 rounded-md shadow-md flex gap-2 justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold">Current Room:</span>
            <div className="flex gap-2 items-center">
              <span className="text-md">{currentRoom?.name}</span>
              <span className="text-sm text-gray-400">
                {currentRoom.connectedPlayersIds.length}/
                {currentRoom.maxNumberOfPlayers}
              </span>
            </div>
          </div>

          <div>
            <IconButton
              sx={{ backgroundColor: "primary.main" }}
              onClick={() => {
                navigate(`/room/${currentRoom?.id}`);
              }}
            >
              <ArrowForward />
            </IconButton>
          </div>
        </div>
      )}
    </Main>
  );
}
