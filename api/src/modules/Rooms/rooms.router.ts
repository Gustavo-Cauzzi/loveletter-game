import { ApplicationIoRouter } from '@modules/router';
import { UserService, usersSockets } from '@modules/Users/users.service';
import AppError from '@shared/exceptions/AppException';
import express from 'express';
import { RoomService } from './rooms.service';
const RoomsRouter = express.Router();

RoomsRouter.get('/', async (req, res) => {
  const allOpenRooms = await RoomService.getAllOpenRooms();
  return res.status(200).json(allOpenRooms);
});

RoomsRouter.get('/current', async (req, res) => {
  const user = req.user;
  const room = await RoomService.isUserInRoom(user.id);
  // const users = await UserService.getUsersByIds(room.connectedPlayersIds);
  return res.status(200).json(room ?? null);
});

RoomsRouter.get('/:id', async (req, res) => {
  const room = await RoomService.getRoomById(req.params.id);
  return res.status(200).json(room);
});

RoomsRouter.post('/', async (req, res) => {
  const { name } = req.body;
  const socket = usersSockets[req.user.id];

  const newRoom = await RoomService.createRoom(name, req.user.id);
  socket.broadcast.emit('/rooms/new', newRoom);

  return res.status(201).json(newRoom);
});

RoomsRouter.patch('/join', async (req, res) => {
  const { roomId } = req.body; // TODO: Get current roomId From User
  const joiningUserId = req.user.id;

  const userSocket = usersSockets[joiningUserId];

  const room = await RoomService.joinRoom(roomId, joiningUserId);

  // Notify all OTHER connected sockets that a room needs to be updated
  userSocket.broadcast.emit('/rooms/update', room);

  const otherUsersIds = room.connectedPlayersIds.filter(
    userId => userId !== joiningUserId,
  );

  const otherUsersSocket = otherUsersIds.map(
    otherUserId => usersSockets[otherUserId],
  );
  if (otherUsersSocket.length !== otherUsersIds.length)
    throw new AppError(
      'Some socket of another player connected to the room could not be located',
      400,
    );

  otherUsersSocket.forEach(socket => socket.emit('/rooms/current/update'));

  return res.status(202).json(room);
});

RoomsRouter.patch('/leave', async (req, res) => {
  const { roomId } = req.body; // TODO: Get current roomId From User
  const leavingUserId = req.user.id;

  const userSocket = usersSockets[leavingUserId];

  const room = await RoomService.leaveRoom(roomId, leavingUserId);

  // Notify all OTHER connected sockets that a room needs to be updated
  userSocket.broadcast.emit('/rooms/update', room);

  const otherUsersIds = room.connectedPlayersIds.filter(
    userId => userId !== leavingUserId,
  );

  const otherUsersSocket = otherUsersIds.map(
    otherUserId => usersSockets[otherUserId],
  );
  if (otherUsersSocket.length !== otherUsersIds.length)
    throw new AppError(
      'Some socket of another player connected to the room could not be located',
      400,
    );

  otherUsersSocket.forEach(socket => socket.emit('/rooms/current/update'));

  return res.status(202).json(room);
});

RoomsRouter.patch('/start', async (req, res) => {
  const { roomId } = req.body; // TODO: Get current roomId From User

  if (!roomId) {
    throw new AppError('roomId not provided', 400);
  }

  const room = await RoomService.startGame(req.user.id, roomId);

  room.connectedPlayersIds.forEach(playerId => {
    const socket = usersSockets[playerId];
    if (!socket)
      throw new AppError(`Socket for user ${playerId} not found`, 404);

    socket.emit('/room/started', room);
  });

  return res.json(room).status(200);
});

// Para comunicações Cliente > Servidor
const RoomsSocketRouter: ApplicationIoRouter = (socket, io) => {
  // nada por enquanto
};

export { RoomsRouter, RoomsSocketRouter };
