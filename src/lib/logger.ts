import { ContainerOptions, ContainerLogger } from "./types";

const logger = (opts: ContainerOptions): ContainerLogger => ({
  info(payload) {
    console.log(`payload`);
  },

  debug(payload) {
    if (opts.debug === true) console.log(payload);
  }
});
export default logger;