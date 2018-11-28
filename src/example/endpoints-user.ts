import { injectable } from '../lib';
import { Modules } from './modules';
import { UserModel } from './dummy-model';

export type Endpoint = (req: Express.Request, res: Express.Response, next: (err?: Error) => void) => void;

injectable(Modules.UserEndpoints,
  [Modules.UserModel],
  async (user: UserModel): Promise<Endpoint[]> => {
    return [];
  });