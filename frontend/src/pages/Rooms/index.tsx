import { useRoomsQuery } from "../../api/rooms";
import { CircularProgress } from "@mui/material";
import { UserInfo } from "../../components/UserInfo";

export function Rooms() {
  const { data: rooms, isLoading, error } = useRoomsQuery();

  return (
    <main className="flex flex-1 w-full justify-center h-screen p-8">
      <header className="absolute top-0 left-0 right-0 py-4 px-2">
        <div className="flex justify-end">
          <UserInfo />
        </div>
      </header>

      <div className="flex flex-col gap-4 max-w-xl min-w-96">
        <h1 className="text-2xl font-bold">Rooms</h1>

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
          <div key={room.id}>
            <h1>{room.name}</h1>
          </div>
        ))}
      </div>
    </main>
  );
}
