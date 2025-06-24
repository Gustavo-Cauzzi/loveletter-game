import { ArrowBack, MeetingRoomOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useJoinRoomMutation, useRoomQuery } from "../../api/rooms";
import { Main } from "../../components/Main";

interface WannaJoinRoomProps {
  roomId: string;
}

export function WannaJoinRoom({ roomId }: WannaJoinRoomProps) {
  const { data: room, isLoading } = useRoomQuery(roomId);
  const { mutate: joinRoom } = useJoinRoomMutation();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    joinRoom(roomId, {
      onSuccess: () => {
        navigate(`/room/${roomId}`);
      },
    });
  };

  return (
    <Main>
      <div className="flex flex-1 justify-center items-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : room ? (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">
              Wanna Join Room "{room?.name}"?
            </h1>
            <p className="text-md">
              You are not in a room. Would you like to join {room?.name}? There
              are {room?.connectedPlayersIds.length} players in the room.
            </p>
            <Button
              variant="contained"
              color="primary"
              endIcon={<MeetingRoomOutlined />}
              onClick={handleJoinRoom}
              sx={{ mt: 2 }}
            >
              Yes Please!
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Room not found</h1>
            <span className="text-md ">
              The room you are looking for does not exist.
            </span>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    </Main>
  );
}
