import { Navigate, useNavigate } from "react-router";
import { useCurrentRoom } from "../../hooks/currentRoom";
import { Main } from "../../components/Main";
import { useGameQuery } from "../../api/game";
import { Button, CircularProgress } from "@mui/material";
import { ErrorCard } from "../../components/ErrorCard";
import { Loleleller } from "./Loleleller";

export function Game() {
  const { currentRoom, isLoading: isCurrentRoomLoading } = useCurrentRoom();
  const navigate = useNavigate();
  const { data: game, isLoading, isError } = useGameQuery(currentRoom?.gameId);

  if (isLoading || isCurrentRoomLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!currentRoom) {
    return <Navigate to="/" />;
  }

  console.log("[Czz] currentRoom.started: ", currentRoom.started);
  if (!currentRoom.started) {
    return <Navigate to={`/room/${currentRoom.id}`} />;
  }

  if (isError) {
    return <ErrorCard title="Error" description="Failed to load game" />;
  }

  if (!game) {
    return (
      <div className="flex flex-col">
        <div>Game not found</div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Leave
        </Button>
      </div>
    );
  }

  return (
    <Main>
      <Loleleller game={game} />
    </Main>
  );
}
