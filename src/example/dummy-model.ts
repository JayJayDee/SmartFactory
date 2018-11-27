import { Modules } from './modules';
import { injectable } from '../lib';

injectable(Modules.UserModel,
  [],
  async () => {
    return {};
  });