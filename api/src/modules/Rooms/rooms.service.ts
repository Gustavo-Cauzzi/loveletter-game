import AppError from '../../shared/exceptions/AppException';
import { GameService } from '../Game/game.service';
import { RoomsRepository } from './rooms.repository';

const createRoom = async (name: string, creatingUserId: string) => {
  if (!name) throw new AppError('Nome não informado', 400);

  const nameAlreadyInUse = await RoomsRepository.getRoomByName(name);

  if (nameAlreadyInUse) throw new AppError('Nome já utilizado', 400);

  return await RoomsRepository.createRoom(name, creatingUserId);
};

const isUserInRoom = async (userId: string) => {
  const rooms = await RoomsRepository.getUserRooms(userId);
  if (rooms.length > 1) {
    console.error('User in multiple rooms', userId, rooms);
  }
  return rooms[0];
};

const joinRoom = async (roomId: string, userId: string) => {
  const room = await RoomsRepository.getRoomById(roomId);

  if (!room) {
    throw new AppError('Unable to find the respective room', 400);
  }

  if (room.connectedPlayersIds.length === room.maxNumberOfPlayers) {
    throw new AppError('Room is full', 401);
  }

  if (
    room.connectedPlayersIds.some(connectedUserId => connectedUserId === userId)
  ) {
    throw new AppError(
      'A user already connected to a room cannot join the same room',
      401,
    );
  }

  const updatedRoom = await RoomsRepository.updateRoom(roomId, {
    connectedPlayersIds: [...room.connectedPlayersIds, userId],
  });

  if (!updatedRoom) {
    throw new AppError('Failed to update the room after joining', 500);
  }

  return updatedRoom;
};

const startGame = async (userId: string, roomId: string) => {
  const room = await RoomsRepository.getRoomById(roomId);

  if (!room) {
    throw new AppError('Unable to locate the room with the requested id', 400);
  }

  if (room.leaderPlayerId !== userId) {
    throw new AppError('Only the room leader can start the game', 401);
  }

  if (room.connectedPlayersIds.length !== 2) {
    // Splendor specific rule
    throw new AppError(
      `Not enough players to start the game (${room.connectedPlayersIds.length})`,
      401,
    );
  }

  const game = await GameService.createGame(room);
  const updatedRoom = await RoomsRepository.updateRoom(roomId, {
    gameId: game.id,
    started: true,
  });

  if (!updatedRoom) {
    throw new AppError(
      'Failed to update the room after starting the game',
      500,
    );
  }

  return updatedRoom;
};

const getAllOpenRooms = async () => {
  const openRooms = await RoomsRepository.getAllOpenRooms();
  return openRooms ?? [];
};

const getRoomById = async (roomId: string) => {
  return await RoomsRepository.getRoomById(roomId);
};

const leaveRoom = async (roomId: string, leavingUserId: string) => {
  return await RoomsRepository.leaveRoom(roomId, leavingUserId);
};

export const RoomService = {
  createRoom,
  joinRoom,
  startGame,
  getAllOpenRooms,
  isUserInRoom,
  getRoomById,
  leaveRoom,
};
