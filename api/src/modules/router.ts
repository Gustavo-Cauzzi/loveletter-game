import { IoConnection, SocketConnection } from '@shared/infra/http/server';
import { Router } from 'express';
import { GameRouter } from './Game/game.router';
import { RoomsRouter, RoomsSocketRouter } from './Rooms/rooms.router';
import { UserIoRouter, UsersRouter } from './Users/users.router';

export const allRoutes: Record<string, Router> = {
  '/room': RoomsRouter,
  '/game': GameRouter,
  '/user': UsersRouter,
};

export type ApplicationIoRouter = (
  socket: SocketConnection,
  io: IoConnection,
) => void;

export const allIoRoutes: ApplicationIoRouter[] = [
  RoomsSocketRouter,
  UserIoRouter,
];
