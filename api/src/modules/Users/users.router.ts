import { ApplicationIoRouter } from '@modules/router';
import express from 'express';
import {
  assignSocketToUser,
  createUser,
  fakeLogin,
  login,
  usersSockets,
} from './users.service';
import { v4 } from 'uuid';
const UsersRouter = express.Router();

UsersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await createUser(username, password);

  return res.status(200).json(user);
});

UsersRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const token = await login(username, password);

  return res.status(200).json({ token });
});

UsersRouter.post('/fakeLogin', async (req, res) => {
  const { username } = req.body;
  const id = v4();

  const token = await fakeLogin(username, id);

  return res.status(200).json({ token, id });
});

UsersRouter.get('/debug/sockets', async (_req, res) => {
  return res.status(200).json(Object.keys(usersSockets));
});

const UserIoRouter: ApplicationIoRouter = (socket, io) => {
  // Executado no connect
  if (socket.data.global?.user?.id) {
    assignSocketToUser(socket, socket.data.global.user.id);
  }
};

export { UsersRouter, UserIoRouter };
