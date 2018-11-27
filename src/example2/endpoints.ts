import { bean } from "../lib";
import { Modules, Config } from './types';

export default bean(Modules.EndpointRunner,
  [ Modules.Config ],
  async (cfg: Config) => {

  });