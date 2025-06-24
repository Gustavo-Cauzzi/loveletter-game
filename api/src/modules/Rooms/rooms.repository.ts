import { v4 } from 'uuid';
import { Room } from './Room.types';
import AppError from '@shared/exceptions/AppException';

const rooms: Room[] = [];

const MAX_NUMBER_OF_PLAYERS = 6;

const createRoom = async (name: string, creatingUserId: string) => {
  const newRoom: Room = {
    id: v4(),
    name,
    gameId: undefined,
    connectedPlayersIds: [creatingUserId],
    leaderPlayerId: creatingUserId,
    started: false,
    maxNumberOfPlayers: MAX_NUMBER_OF_PLAYERS,
  };
  rooms.push(newRoom);
  return newRoom;
};

const getRoomByGameId = async (gameId: string) => {
  const room = rooms.find(room => room.gameId === gameId);
  if (!room) {
    throw new Error(`Room with the game ID ${gameId} was not found`);
  }
  return room;
};

const getRoomById = async (id: string) => {
  return rooms.find(room => room.id === id);
};

const getRoomByName = async (name: string) => {
  return rooms.find(room => room.name === name);
};

const updateRoom = async (id: string, updatedRoom: Partial<Room>) => {
  const roomIndex = rooms.findIndex(room => room.id === id);
  if (roomIndex !== -1) {
    rooms[roomIndex] = { ...rooms[roomIndex], ...updatedRoom };
    return rooms[roomIndex];
  }
  return undefined;
};

const deleteRoom = async (id: string) => {
  const roomIndex = rooms.findIndex(room => room.id === id);
  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
    return true;
  }
  return false;
};

const getAllOpenRooms = async () => {
  // const allGameIds =  rooms.map(room => room.gameId);
  // const allGames = await Promise.all(allGameIds.filter(isTruthy).map(GamesRepository.getGameById))
  // const allStartedGames
  // const allGamesById = toMap(allGames, game => game.id)
  console.log('[Czz] rooms: ', rooms);
  return rooms.filter(room => !room.started);
};

const getUserRooms = async (userId: string) => {
  return rooms.filter(room => room.connectedPlayersIds.includes(userId));
};

const leaveRoom = async (roomId: string, leavingUserId: string) => {
  const room = await getRoomById(roomId);
  if (!room) throw new AppError('Room not found', 404);
  room.connectedPlayersIds = room.connectedPlayersIds.filter(
    id => id !== leavingUserId,
  );

  if (room.connectedPlayersIds.length === 0) {
    await deleteRoom(roomId);
  }

  if (room.leaderPlayerId === leavingUserId) {
    room.leaderPlayerId = room.connectedPlayersIds[0];
  }

  return room;
};

export const RoomsRepository = {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getRoomByName,
  getRoomByGameId,
  getAllOpenRooms,
  getUserRooms,
  leaveRoom,
};
