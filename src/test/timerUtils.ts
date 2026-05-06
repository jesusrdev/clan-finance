export function createDeferredFlag(delayMs: number) {
  let done = false;

  const id = setTimeout(() => {
    done = true;
  }, delayMs);

  return {
    isDone: () => done,
    cancel: () => clearTimeout(id),
  };
}
