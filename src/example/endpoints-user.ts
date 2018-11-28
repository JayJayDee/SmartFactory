import { injectable } from '../lib';
import { Modules } from './modules';
import { UserModel } from './dummy-model';
import { Router } from 'express';
import { Response, Request, NextFunction } from 'express-serve-static-core';

export type Endpoint = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

injectable(Modules.UserEndpoints,
  [Modules.UserModel],
  async (user: UserModel): Promise<Router> => {
    const router = Router();
    router.get('/list', userList(user));
    return router;
  });

const userList = (user: UserModel): Endpoint =>
  async (req, res, next) => {
    const users = await user.list(0, 10);
    res.status(200).json(users);
  };