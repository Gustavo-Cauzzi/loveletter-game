import { Navigate, useNavigate, useParams } from "react-router";
import { useCurrentRoom } from "../../hooks/currentRoom";
import { WannaJoinRoom } from "./WannaJoinRoom";
import { Main } from "../../components/Main";
import { UserInfo } from "../../components/UserInfo";
import { Button } from "@mui/material";
import { useAuth } from "../../hooks/auth";
import { useLeaveRoomMutation, useStartGameMutation } from "../../api/rooms";
import { toast } from "react-hot-toast";

export function Lobby() {
  const { id } = useParams();
  const { currentRoom } = useCurrentRoom();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: leaveRoom } = useLeaveRoomMutation();
  const { mutate: startGame } = useStartGameMutation();

  const handleLeaveRoom = () => {
    if (!currentRoom) {
      return;
    }

    leaveRoom(currentRoom.id, {
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        toast.error("Failed to leave room");
      },
    });
  };

  const handleStartGame = () => {
    if (!currentRoom) {
      return;
    }

    startGame(currentRoom.id, {
      onSuccess: () => {
        navigate("/game");
      },
    });
  };

  if (currentRoom?.started) {
    return <Navigate to="/game" />;
  }

  if (!currentRoom) {
    return <WannaJoinRoom roomId={id as string} />;
  }

  return (
    <Main>
      <div className="absolute top-0 right-0 p-4">
        <UserInfo />
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold">Lobby</h1>
        <p className="text-md">
          You are in the lobby of <b>{currentRoom.name}</b>
        </p>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-lg font-bold">Players</h2>
          <div className="flex flex-col gap-2 items-center">
            {currentRoom.connectedPlayersIds.map((player) => (
              <div key={player}>{player}</div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {currentRoom.leaderPlayerId === user?.id ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          ) : null}
          <Button variant="contained" color="error" onClick={handleLeaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>
    </Main>
  );
}
