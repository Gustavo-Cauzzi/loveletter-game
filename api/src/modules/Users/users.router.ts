import { ApplicationIoRouter } from '@modules/router';
import express from 'express';
import { v4 } from 'uuid';
import { usersSockets } from './users.service';
import { UserService } from './users.service';
const UsersRouter = express.Router();

UsersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await UserService.createUser(username, password);

  return res.status(200).json(user);
});

UsersRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const token = await UserService.login(username, password);

  return res.status(200).json({ token });
});

UsersRouter.post('/fakeLogin', async (req, res) => {
  const { username } = req.body;
  const id = v4();

  const token = await UserService.fakeLogin(username, id);

  return res.status(200).json({ token, id });
});

UsersRouter.get('/debug/sockets', async (_req, res) => {
  return res.status(200).json(Object.keys(usersSockets));
});

const UserIoRouter: ApplicationIoRouter = (socket, io) => {
  // Executado no connect
  if (socket.data.global?.user?.id) {
    UserService.assignSocketToUser(socket, socket.data.global.user.id);
  }
};

export { UserIoRouter, UsersRouter };
