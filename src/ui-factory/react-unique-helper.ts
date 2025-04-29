type Holder = {
  counter: number;
  instances: Set<unknown>;
};
const holderMap: Record<string, Holder> = {};

export const uniqueChecker = (name: string, target: unknown, silent = false) => {
  const holder = holderMap[name];
  if (!holder) {
    holderMap[name] = { counter: 0, instances: new Set<unknown>() };
  }
  const holder2 = holderMap[name];
  holder2.counter++;
  holder2.instances.add(target);
  if (!silent) {
    console.debug('unique helper', name, holder2.counter, holder2.instances.size);
  }
};
