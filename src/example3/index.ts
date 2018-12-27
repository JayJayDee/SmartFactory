import { injectable, init, resolve } from "../lib";

injectable('A', ['B'], async () => 'A');
injectable('B', ['C'], async () => 'B');
injectable('C', ['D'], async () => 'C');
injectable('D', ['E'], async () => 'D');
injectable('E', ['DEP_B'], async () => 'E');

injectable('DEP_A', [], async () => 'DEP_A');
injectable('DEP_B', ['DEP_A'], async () => 'DEP_B');

(async () => {
  await init({
    debug: true
  });

  const a = await resolve<string>('C');
  console.log(a);
})();